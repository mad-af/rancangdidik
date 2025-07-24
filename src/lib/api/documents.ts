import { Document } from '@/constants/data';
import { API_URLS } from '@/lib/config/api';

const API_BASE_URL = API_URLS.documents;

export interface DocumentsResponse {
  success: boolean;
  time: string;
  message: string;
  total_documents: number;
  offset: number;
  limit: number;
  documents: Document[];
}

export interface DocumentResponse {
  success: boolean;
  time?: string;
  message: string;
  document?: Document;
}

export interface CreateDocumentData {
  subject: string;
  teacherName: string;
  phase: string;
  academicYear: string;
  attachmentUrl?: string;
}

export interface UpdateDocumentData extends Partial<CreateDocumentData> {}

export interface DocumentFilters {
  page?: number;
  limit?: number;
  search?: string;
  subjects?: string[];
  phases?: string[];
}

// Get all documents with filtering
export async function getDocuments(
  filters: DocumentFilters = {}
): Promise<DocumentsResponse> {
  const {
    page = 1,
    limit = 10,
    search = '',
    subjects = [],
    phases = []
  } = filters;

  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    search,
    subjects: subjects.join('.'),
    phases: phases.join('.')
  });

  const response = await fetch(`${API_BASE_URL}?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch documents');
  }

  return response.json();
}

// Get a single document by ID
export async function getDocumentById(id: number): Promise<DocumentResponse> {
  const response = await fetch(`${API_BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch document with ID ${id}`);
  }

  return response.json();
}

// Create a new document
export async function createDocument(
  data: CreateDocumentData
): Promise<DocumentResponse> {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Failed to create document');
  }

  return response.json();
}

// Update an existing document
export async function updateDocument(
  id: number,
  data: UpdateDocumentData
): Promise<DocumentResponse> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`Failed to update document with ID ${id}`);
  }

  return response.json();
}

// Get a single document by ID (alias for getDocumentById)
export async function getDocument(id: number): Promise<Document> {
  const response = await getDocumentById(id);
  if (!response.document) {
    throw new Error(`Document with ID ${id} not found`);
  }
  return response.document;
}

// Delete a document
export async function deleteDocument(
  id: number
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`Failed to delete document with ID ${id}`);
  }

  return response.json();
}
