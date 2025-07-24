import { useState, useEffect } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DownloadIcon, Loader2, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import Calendar from "@/assets/icons/Calendar"
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
  const [selectedRows, setSelectedRows] = useState<number[]>([])

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
      setSelectedRows([]) // reset selection on page change
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
    fetchDocuments()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  const isAllSelected = selectedRows.length === documents.length
  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedRows([])
    } else {
      setSelectedRows(documents.map((_, i) => i))
    }
  }
  const toggleRow = (index: number) => {
    setSelectedRows((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    )
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
    <div className="space-y-4">
      {/* Header */}
      <div className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_40px] items-center px-6 text-sm font-semibold text-muted-foreground">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={toggleSelectAll}
        />
        <div>Mata Pelajaran</div>
        <div>Nama Guru</div>
        <div>Fase</div>
        <div>Tahun Ajaran</div>
        <div>Tanggal Pembuatan</div>
        <div>Attachments</div>
        <div></div>
      </div>

      {/* Rows */}
      {documents.length > 0 ? (
        documents.map((doc, idx) => (
          <div
            key={doc.id}
            className="grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr_1fr_40px] items-center bg-white rounded-xl shadow-sm px-6 py-4 hover:shadow-md transition"
          >
            <Checkbox
              checked={selectedRows.includes(idx)}
              onCheckedChange={() => toggleRow(idx)}
            />
            <div className="font-medium text-sm">{doc.subject}</div>
            <div className="text-sm">{doc.teacherName}</div>
            <div className="text-sm">{doc.phase}</div>
            <div className="text-sm">{doc.academicYear}</div>
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Calendar className="w-4 h-4 text-blue-600" />
              {formatDate(doc.created_at)}
            </div>
            <div>
              {doc.attachmentUrl ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 border-green-400 bg-green-50 hover:bg-green-100"
                  onClick={() => window.open(doc.attachmentUrl, '_blank')}
                >
                  <DownloadIcon className="w-4 h-4 mr-1" />
                  PDF
                </Button>
              ) : (
                <span className="text-sm text-muted-foreground">No attachment</span>
              )}
            </div>
            <div className="justify-self-end">
              <RPPRowMenu
                documentId={doc.id}
                onDocumentDeleted={handleDocumentDeleted}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="text-center p-6 text-muted-foreground">
          {searchQuery ? 'No matching records found.' : 'No documents available.'}
        </div>
      )}

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
