import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Anthropic from '@anthropic-ai/sdk';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';
import path from 'path';
import fs from 'fs';

// Initialize Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

// POST /api/documents/[id]/generate-pdf - Generate PDF RPP using AI
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const documentId = parseInt(id);
    if (isNaN(documentId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid document ID' },
        { status: 400 }
      );
    }

    // Get document from database
    const document = await prisma.document.findUnique({
      where: { id: documentId }
    });

    if (!document) {
      return NextResponse.json(
        { success: false, message: 'Document not found' },
        { status: 404 }
      );
    }

    // Generate RPP content using Anthropic Claude
    const rppContent = await generateRPPContent(document);

    // Generate PDF
    const pdfBuffer = await generatePDF(rppContent, document);

    // Save PDF to public folder
    const fileName = `RPP_${document.subject}_${document.phase}_${Date.now()}.pdf`;
    const filePath = path.join(process.cwd(), 'public', 'pdfs', fileName);
    
    // Create pdfs directory if it doesn't exist
    const pdfDir = path.join(process.cwd(), 'public', 'pdfs');
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }
    
    // Write PDF file
    fs.writeFileSync(filePath, pdfBuffer);
    
    // Update document with PDF URL
    const pdfUrl = `/pdfs/${fileName}`;
    await prisma.document.update({
      where: { id: documentId },
      data: { attachmentUrl: pdfUrl }
    });

    // Return success response with PDF URL
     return NextResponse.json({
       success: true,
       message: 'PDF generated successfully',
       pdfUrl: pdfUrl,
       fileName: fileName
     }, { status: 200 });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}

// Generate RPP content using Anthropic Claude
async function generateRPPContent(document: any) {
  const prompt = `
Buatkan Rencana Pelaksanaan Pembelajaran (RPP) yang lengkap dan sesuai dengan Kurikulum Merdeka untuk:

Mata Pelajaran: ${document.subject}
Nama Guru: ${document.teacherName}
Fase: ${document.phase}
Tahun Ajaran: ${document.academicYear}

RPP harus mencakup:
1. Identitas RPP (Nama Sekolah, Mata Pelajaran, Kelas/Fase, Alokasi Waktu)
2. Capaian Pembelajaran (CP)
3. Tujuan Pembelajaran
4. Pemahaman Bermakna
5. Pertanyaan Pemantik
6. Kegiatan Pembelajaran:
   - Kegiatan Pendahuluan (10 menit)
   - Kegiatan Inti (60 menit)
   - Kegiatan Penutup (10 menit)
7. Asesmen:
   - Asesmen Formatif
   - Asesmen Sumatif
8. Pengayaan dan Remedial
9. Refleksi Guru
10. Lampiran (jika diperlukan)

Buatlah RPP yang:
- Sesuai dengan karakteristik peserta didik pada fase tersebut
- Menggunakan pendekatan pembelajaran yang berpusat pada siswa
- Mengintegrasikan teknologi jika relevan
- Memperhatikan diferensiasi pembelajaran
- Menggunakan bahasa Indonesia yang baik dan benar
- Terstruktur dan mudah dipahami

Format output dalam bentuk teks yang terstruktur dengan heading yang jelas.`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 4000,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: prompt
      }
    ]
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

// Generate PDF from RPP content
async function generatePDF(content: string, document: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Load custom font
      const fontPath = path.join(process.cwd(), 'public', 'Lora-VariableFont_wght.ttf');
      
      const doc = new PDFDocument({
        size: 'A4',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        },
        font: fontPath
      });

      const chunks: Buffer[] = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Add header
      doc.fontSize(16)
         .text('RENCANA PELAKSANAAN PEMBELAJARAN (RPP)', {
           align: 'center'
         })
         .moveDown();

      // Add document info
      doc.fontSize(12)
         .text(`Mata Pelajaran: ${document.subject}`, { align: 'left' })
         .text(`Nama Guru: ${document.teacherName}`)
         .text(`Fase: ${document.phase}`)
         .text(`Tahun Ajaran: ${document.academicYear}`)
         .moveDown();

      // Add separator line
      doc.moveTo(50, doc.y)
         .lineTo(545, doc.y)
         .stroke()
         .moveDown();

      // Add generated content
      const lines = content.split('\n');
      
      for (const line of lines) {
        if (line.trim() === '') {
          doc.moveDown(0.5);
          continue;
        }

        // Check if line is a heading (starts with number or contains ":")
        if (line.match(/^\d+\.|^[A-Z][^a-z]*:/) || line.includes(':')) {
          doc.fontSize(12)
             .text(line.trim(), {
               align: 'left',
               continued: false
             })
             .moveDown(0.3);
        } else {
          doc.fontSize(11)
             .text(line.trim(), {
               align: 'justify',
               indent: line.startsWith('-') || line.startsWith('•') ? 20 : 0
             })
             .moveDown(0.2);
        }

        // Add new page if needed
        if (doc.y > 750) {
          doc.addPage();
        }
      }

      // Add footer
      const pageRange = doc.bufferedPageRange();
      const pageCount = pageRange.count;
      const startPage = pageRange.start;
      
      // Iterate through actual page range instead of assuming it starts at 0
      for (let i = 0; i < pageCount; i++) {
        const pageIndex = startPage + i;
        doc.switchToPage(pageIndex);
        doc.fontSize(9)
           .text(
             `Halaman ${i + 1} dari ${pageCount}`,
             50,
             750,
             { align: 'center' }
           );
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}