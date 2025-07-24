import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Anthropic from '@anthropic-ai/sdk';
import puppeteer from 'puppeteer';

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
    const pdfBuffer = await generatePDF();

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

// Generate PDF from HTML template
async function generatePDF(): Promise<Buffer> {
  let browser;
  try {
    // Read the HTML template
    const templatePath = path.join(process.cwd(), 'src', 'app', 'api', 'documents', '[id]', 'generate-pdf', 'templatepdf.html');
    const htmlTemplate = fs.readFileSync(templatePath, 'utf8');

    // Launch puppeteer browser
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set the HTML content
    await page.setContent(htmlTemplate, {
      waitUntil: 'networkidle0'
    });

    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      displayHeaderFooter: true,
      outline: false,
      // margin: {
      //   top: '0.5in',
      //   right: '0.5in',
      //   bottom: '0.5in',
      //   left: '0.5in'
      // }
    });

    await browser.close();
    return Buffer.from(pdfBuffer);
  } catch (error) {
    if (browser) {
      await browser.close();
    }
    throw error;
  }
}