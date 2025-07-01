import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/documents - Get all documents with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const subjects =
      searchParams.get('subjects')?.split('.').filter(Boolean) || [];
    const phases =
      searchParams.get('phases')?.split('.').filter(Boolean) || [];

    const offset = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { subject: { contains: search, mode: 'insensitive' } },
        { teacherName: { contains: search, mode: 'insensitive' } },
        { phase: { contains: search, mode: 'insensitive' } },
        { academicYear: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (subjects.length > 0) {
      where.subject = { in: subjects };
    }

    if (phases.length > 0) {
      where.phase = { in: phases };
    }

    // Get total count for pagination
    const totalDocuments = await prisma.document.count({ where });

    // Get documents with pagination
    const documents = await prisma.document.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({
      success: true,
      time: new Date().toISOString(),
      message: 'Documents retrieved successfully',
      total_documents: totalDocuments,
      offset,
      limit,
      documents
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch documents' },
      { status: 500 }
    );
  }
}

// POST /api/documents - Create a new document
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, teacherName, phase, academicYear, attachmentUrl } = body;

    // Validate required fields
    if (!subject || !teacherName || !phase || !academicYear) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const document = await prisma.document.create({
      data: {
        subject,
        teacherName,
        phase,
        academicYear,
        attachmentUrl: attachmentUrl || ''
      }
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Document created successfully',
        document
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create document' },
      { status: 500 }
    );
  }
}