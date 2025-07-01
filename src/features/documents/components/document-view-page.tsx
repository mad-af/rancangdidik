import { Document } from '@/constants/data';
import { getDocumentById } from '@/lib/api/documents';
import { notFound } from 'next/navigation';
import DocumentForm from '@/features/documents/components/document-form';

type TDocumentViewPageProps = {
  documentId: string;
};

export default async function DocumentViewPage({
  documentId
}: TDocumentViewPageProps) {
  let document = null;
  let pageTitle = 'Create New Document';

  if (documentId !== 'new') {
    try {
      const data = await getDocumentById(Number(documentId));
      document = data.document as Document;
      if (!document) {
        notFound();
      }
      pageTitle = `Edit Document`;
    } catch (error) {
      notFound();
    }
  }

  return <DocumentForm initialData={document} pageTitle={pageTitle} />;
}
