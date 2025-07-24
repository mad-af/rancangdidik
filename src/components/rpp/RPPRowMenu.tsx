import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical, FileText } from "lucide-react"
import { deleteDocument, generateDocumentPDF } from "@/lib/api/documents"
import { toast } from "sonner"
import { useState } from "react"
import { useRouter } from "next/navigation"

type RPPRowMenuProps = {
  documentId: number
  onDocumentDeleted?: () => void
}

export function RPPRowMenu({ documentId, onDocumentDeleted }: RPPRowMenuProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)

  const handleEdit = () => {
    router.push(`/dashboard/rpp/edit/${documentId}`)
  }

  const handleGeneratePDF = async () => {
    try {
      setIsGeneratingPDF(true)
      toast.info('Sedang menggenerate PDF RPP...')
      
      const response = await generateDocumentPDF(documentId)
      
      if (response.success) {
        // Download PDF from the generated URL
        const link = document.createElement('a')
        link.href = response.pdfUrl
        link.download = response.fileName
        link.target = '_blank'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        toast.success('PDF RPP berhasil digenerate dan disimpan!')
      } else {
        toast.error(response.message || 'Gagal menggenerate PDF')
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error)
      toast.error('Gagal menggenerate PDF. Silakan coba lagi.')
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return
    }

    try {
       setIsDeleting(true)
       await deleteDocument(documentId)
       console.log('Document deleted successfully')
       // Call the callback to refresh parent component
       if (onDocumentDeleted) {
         onDocumentDeleted()
       }
     } catch (error) {
      console.error('Failed to delete document:', error)
      alert('Failed to delete document. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={handleEdit}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleGeneratePDF}
          disabled={isGeneratingPDF}
        >
          <FileText className="w-4 h-4 mr-2" />
          {isGeneratingPDF ? 'Generating PDF...' : 'Generate PDF'}
        </DropdownMenuItem>
        <DropdownMenuItem 
          className="text-red-500" 
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? 'Deleting...' : 'Delete'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
