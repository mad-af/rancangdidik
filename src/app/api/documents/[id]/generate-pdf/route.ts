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
    console.log(rppContent);
    
    // Generate PDF with document data
    const pdfBuffer = await generatePDF(document, rppContent);

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
   const promptForAnthropic = `Anda adalah asisten yang membantu membuat konten Rencana Pelaksanaan Pembelajaran (RPP).
berdasarkan data yang diberikan, buatlah konten RPP untuk mata pelajaran ${document.subject} dengan guru ${document.teacherName} pada fase ${document.phase} di tahun ajaran ${document.academicYear}.

Saya ingin Anda menghasilkan data RPP dalam format JSON. Ikuti struktur JSON yang diberikan di bawah ini dengan tepat.

Berikut adalah detail konten yang saya butuhkan:
1.  **Capaian Umum:** Satu paragraf deskriptif tentang tujuan umum pembelajaran ${document.subject}.
2.  **Capaian Per Elemen:** Berikan daftar poin-poin capaian per elemen. Setiap poin harus memiliki judul dan deskripsi.
    * Judul Elemen: Deskripsi singkat tentang apa yang akan dipelajari siswa terkait elemen tersebut.
3.  **Kegiatan Pembelajaran:** Berikan daftar poin-poin kegiatan pembelajaran per minggu. Setiap poin harus mencakup detail untuk satu minggu.
    * Minggu ke-X:
        * Tujuan Pembelajaran: (Tujuan untuk ${document.subject})
        * Topik: (Topik untuk ${document.subject})
        * Aktivitas Inti: (Aktivitas untuk ${document.subject})
        * Asesmen: (Asesmen untuk ${document.subject})
        * Alokasi Waktu: (Format: n JP (n x 40 menit)) # JP adalah jam pelajaran

Pastikan konten relevan dengan mata pelajaran ${document.subject} untuk bagian Kegiatan Pembelajaran, sedangkan Capaian Umum dan Per Elemen sesuai dengan ${document.subject} seperti yang terlihat di dokumen RPP.

Output Anda harus berupa objek JSON tunggal dengan struktur berikut:

\`\`\`json
{
    "capaianUmum": "string",
    "capaianPerElemen": [
        {
            "title": "string",
            "description": "string"
        }
    ],
    "kegiatanPembelajaran": [
        {
            "minggu": "string",
            "tujuanPembelajaran": "string",
            "topik": "string",
            "aktivitasInti": "string",
            "asesmen": "string",
            "alokasiWaktu": "string"
        }
    ]
}
\`\`\`

Mohon berikan hanya output JSON yang valid, tanpa teks penjelasan tambahan di luar blok JSON.
`;

  const response = await anthropic.messages.create({
    model: 'claude-3-5-haiku-20241022',
    max_tokens: 4000,
    temperature: 0.7,
    messages: [
      {
        role: 'user',
        content: promptForAnthropic
      }
    ]
  });

  return response.content[0].type === 'text' ? response.content[0].text : '';
}

// Generate PDF from HTML template
async function generatePDF(document: any, rppContent: string): Promise<Buffer> {
  let browser;
  try {
    // Read the HTML template
    const templatePath = path.join(process.cwd(), 'src', 'app', 'api', 'documents', '[id]', 'generate-pdf', 'templatepdf.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf8');
    
    // Parse and format RPP content
    let formattedRPPContent = '';
    let formattedCapaianUmum = '';
    let formattedCapaianPerElemen = '';
    
    try {
      const rppData = JSON.parse(rppContent);
      
      // Format capaian umum
      formattedCapaianUmum = rppData.capaianUmum || 'Capaian umum belum tersedia.';
      
      // Format capaian per elemen
       if (rppData.capaianPerElemen && Array.isArray(rppData.capaianPerElemen)) {
         formattedCapaianPerElemen = rppData.capaianPerElemen.map((elemen: any, index: number) => {
           const alphabetPrefix = String.fromCharCode(65 + index); // A, B, C, etc.
           return `
           <div>
             <h3 class="font-medium text-lg mb-1">${alphabetPrefix}. ${elemen.title || ''}</h3>
             <p class="leading-relaxed">
               ${elemen.description || ''}
             </p>
           </div>
         `;
         }).join('');
       }
      
      // Format kegiatan pembelajaran
      if (rppData.kegiatanPembelajaran && Array.isArray(rppData.kegiatanPembelajaran)) {
        formattedRPPContent = rppData.kegiatanPembelajaran.map((kegiatan: any, index: number) => `
          <div class="mb-6 pb-4 border-b border-purple-200 last:border-b-0">
            <h3 class="font-medium text-lg text-purple-700 mb-2">${kegiatan.minggu || `Minggu ke-${index + 1}`}</h3>
            <div class="space-y-1 text-gray-700">
              <p><strong>Tujuan Pembelajaran:</strong> ${kegiatan.tujuanPembelajaran || ''}</p>
              <p><strong>Topik:</strong> ${kegiatan.topik || ''}</p>
              <p><strong>Aktivitas Inti:</strong> ${kegiatan.aktivitasInti || ''}</p>
              <p><strong>Asesmen:</strong> ${kegiatan.asesmen || ''}</p>
              <p><strong>Alokasi Waktu:</strong> ${kegiatan.alokasiWaktu || ''}</p>
            </div>
          </div>
        `).join('');
      }
    } catch (error) {
      console.error('Error parsing RPP content:', error);
      formattedRPPContent = '<p>Error loading RPP content</p>';
      formattedCapaianUmum = 'Error loading capaian umum';
      formattedCapaianPerElemen = '<p>Error loading capaian per elemen</p>';
    }
    
    // Replace placeholders with actual data
    htmlTemplate = htmlTemplate
      .replace('{{SUBJECT}}', document.subject || 'Mata Pelajaran')
      .replace('{{PHASE}}', document.phase || 'Fase')
      .replace('{{SEMESTER}}', document.semester || 'Semester')
      .replace('{{ACADEMIC_YEAR}}', document.academicYear || '2024/2025')
      .replace('{{TEACHER_NAME}}', document.teacherName || '')
      .replace('{{SCHOOL_NAME}}', 'SMP Negeri 1 Cerdas') // Default school name
      .replace('{{CAPAIAN_UMUM}}', formattedCapaianUmum)
      .replace('{{CAPAIAN_PER_ELEMEN}}', formattedCapaianPerElemen)
      .replace('{{RPP_CONTENT}}', formattedRPPContent);

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
      margin: {
        top: '2cm',
        bottom: '2cm',
        left: '2.5cm',
        right: '2.5cm'
      }
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