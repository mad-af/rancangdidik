import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { RPPRowMenu } from "./RPPRowMenu"
import { getDocuments, type DocumentFilters } from "@/lib/api/documents"
import { Document } from "@/constants/data"

type RPPTableProps = {
  searchQuery: string
}

export function RPPTable({ searchQuery }: RPPTableProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalDocuments, setTotalDocuments] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const filters: DocumentFilters = {
        page: currentPage,
        limit,
        search: searchQuery
      }
      
      const response = await getDocuments(filters)
      setDocuments(response.documents)
      setTotalDocuments(response.total_documents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch documents')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [searchQuery, currentPage])

  const handleDocumentDeleted = () => {
    // Refresh the current page data
    fetchDocuments()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="border rounded-md">
        <div className="flex items-center justify-center p-8">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading documents...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border rounded-md">
        <div className="flex items-center justify-center p-8 text-red-600">
          <span>Error: {error}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-md">
      <table className="w-full table-auto text-left">
        <thead className="bg-muted">
          <tr>
            <th className="p-3"><Checkbox /></th>
            <th className="p-3">Mata Pelajaran</th>
            <th className="p-3">Nama Guru</th>
            <th className="p-3">Fase</th>
            <th className="p-3">Semester</th>
            <th className="p-3">Tahun Ajaran</th>
            <th className="p-3">Tanggal Pembuatan</th>
            <th className="p-3">Attachments</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.length > 0 ? (
            documents.map((document) => (
              <tr key={document.id} className="border-b hover:bg-muted/40">
                <td className="p-3"><Checkbox /></td>
                <td className="p-3">{document.subject}</td>
                <td className="p-3">{document.teacherName}</td>
                <td className="p-3">{document.phase}</td>
                <td className="p-3">{document.semester}</td>
                <td className="p-3">{document.academicYear}</td>
                <td className="p-3">{formatDate(document.created_at)}</td>
                <td className="p-3">
                  {document.attachmentUrl ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-green-700 border-green-500"
                      onClick={() => window.open(document.attachmentUrl, '_blank')}
                    >
                      <DownloadIcon className="w-4 h-4 mr-1" />
                      PDF
                    </Button>
                  ) : (
                    <span className="text-muted-foreground text-sm">No attachment</span>
                  )}
                </td>
                <td className="p-3 text-center">
                   <RPPRowMenu 
                     documentId={document.id} 
                     onDocumentDeleted={handleDocumentDeleted}
                   />
                 </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center p-6 text-muted-foreground">
                {searchQuery ? 'No matching records found.' : 'No documents available.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
      
      {/* Pagination Controls */}
      {totalDocuments > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalDocuments)} of {totalDocuments} documents
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {Math.ceil(totalDocuments / limit)}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= Math.ceil(totalDocuments / limit) || loading}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
