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
   const promptForAnthropic = `Anda adalah asisten yang membantu membuat konten Rencana Pelaksanaan Pembelajaran (RPP) dalam format Kurikulum Merdeka.

Berdasarkan data berikut ini, buatkan konten RPP lengkap untuk mata pelajaran ${document.subject} oleh guru ${document.teacherName}, pada fase ${document.phase}, semester ${document.semester}, tahun ajaran ${document.academicYear}, dan jenis asesmen berupa **${document.assessment || "asesmen tidak ditentukan"}**.

Dokumen ini terdiri dari tiga bagian utama:
1. **Capaian Umum** — satu paragraf naratif yang menjelaskan secara umum tujuan pembelajaran dari mata pelajaran ${document.subject}.
2. **Capaian Per Elemen** — daftar poin-poin yang masing-masing terdiri dari:
   - **Judul Elemen**: nama atau topik elemen.
   - **Deskripsi**: penjabaran singkat capaian dari elemen tersebut.
3. **Kegiatan Pembelajaran Mingguan** — daftar kegiatan selama ${document.sessionCount || 12} minggu, dengan masing-masing minggu memiliki informasi berikut:
   - **Minggu ke-X**
   - **Tujuan Pembelajaran**
   - **Topik**
   - **Aktivitas Inti**
   - **Asesmen**: disesuaikan dengan jenis asesmen yaitu ${document.assessment || "tugas/ujian/diskusi"}
   - **Alokasi Waktu**: gunakan format n JP (n x 40 menit) dan buatlah jumlah JP yang wajar untuk satu sesi.

### Format Output
Kembalikan hasil dalam format JSON PENUH dan VALID, TANPA penjelasan tambahan. Struktur wajib seperti ini:

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

Catatan: Pastikan jumlah elemen dalam kegiatanPembelajaran sesuai dengan nilai sesi: ${document.sessionCount || 12} minggu. Gunakan bahasa Indonesia yang baku dan sesuai konteks pendidikan.
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