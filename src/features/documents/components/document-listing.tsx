import { Document } from '@/constants/data';
import { getDocuments } from '@/lib/api/documents';
import { searchParamsCache } from '@/lib/searchparams';
import { DocumentTable } from './document-tables';
import { columns } from './document-tables/columns';

type DocumentListingPage = {};

export default async function DocumentListingPage({}: DocumentListingPage) {
  // Showcasing the use of search params cache in nested RSCs
  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name');
  const pageLimit = searchParamsCache.get('perPage');
  const subjects = searchParamsCache.get('subject');
  const phases = searchParamsCache.get('phase');

  const filters = {
    page,
    limit: pageLimit,
    ...(search && { search }),
    ...(subjects && { subjects: subjects.split('.') }),
    ...(phases && { phases: phases.split('.') })
  };

  const data = await getDocuments(filters);
  const totalDocuments = data.total_documents;
  const documents: Document[] = data.documents;

  return (
    <DocumentTable
      data={documents}
      totalItems={totalDocuments}
      columns={columns}
    />
  );
}
