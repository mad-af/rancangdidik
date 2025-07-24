import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/documents/[id] - Get a document by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid document ID' },
        { status: 400 }
      );
    }

    const document = await prisma.document.findUnique({
      where: { id }
    });

    if (!document) {
      return NextResponse.json(
        { success: false, message: `Document with ID ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      time: new Date().toISOString(),
      message: `Document with ID ${id} found`,
      document
    });
  } catch (error) {
    console.error(`Error fetching document ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch document' },
      { status: 500 }
    );
  }
}

// PUT /api/documents/[id] - Update a document
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const body = await request.json();
    const { subject, teacherName, phase, semester, academicYear, attachmentUrl } = body;

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid document ID' },
        { status: 400 }
      );
    }

    // Check if document exists
    const existingDocument = await prisma.document.findUnique({
      where: { id }
    });

    if (!existingDocument) {
      return NextResponse.json(
        { success: false, message: `Document with ID ${id} not found` },
        { status: 404 }
      );
    }

    // Update document
    const updatedDocument = await prisma.document.update({
      where: { id },
      data: {
        subject: subject || existingDocument.subject,
        teacherName: teacherName || existingDocument.teacherName,
        phase: phase || existingDocument.phase,
        semester: semester || existingDocument.semester,
        academicYear: academicYear || existingDocument.academicYear,
        attachmentUrl:
          attachmentUrl !== undefined
            ? attachmentUrl
            : existingDocument.attachmentUrl
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Document updated successfully',
      document: updatedDocument
    });
  } catch (error) {
    console.error(`Error updating document ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to update document' },
      { status: 500 }
    );
  }
}

// DELETE /api/documents/[id] - Delete a document
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { success: false, message: 'Invalid document ID' },
        { status: 400 }
      );
    }

    // Check if document exists
    const existingDocument = await prisma.document.findUnique({
      where: { id }
    });

    if (!existingDocument) {
      return NextResponse.json(
        { success: false, message: `Document with ID ${id} not found` },
        { status: 404 }
      );
    }

    // Delete document
    await prisma.document.delete({
      where: { id }
    });

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting document ${params.id}:`, error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete document' },
      { status: 500 }
    );
  }
}
