import FormCardSkeleton from '@/components/form-card-skeleton';
import PageContainer from '@/components/layout/page-container';
import DocumentViewPage from '@/features/documents/components/document-view-page';
import { Suspense } from 'react';

export const metadata = {
  title: 'Dashboard : Document View'
};

type PageProps = { params: Promise<{ documentId: string }> };

export default async function Page(props: PageProps) {
  const params = await props.params;
  return (
    <PageContainer scrollable>
      <div className='flex-1 space-y-4'>
        <Suspense fallback={<FormCardSkeleton />}>
          <DocumentViewPage documentId={params.documentId} />
        </Suspense>
      </div>
    </PageContainer>
  );
}
