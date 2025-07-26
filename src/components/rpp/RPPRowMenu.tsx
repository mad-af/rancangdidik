import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { MoreVertical } from "lucide-react"
import { deleteDocument } from "@/lib/api/documents"
import { useState } from "react"
import { useRouter } from "next/navigation"

type RPPRowMenuProps = {
  documentId: number
  onDocumentDeleted?: () => void
}

export function RPPRowMenu({ documentId, onDocumentDeleted }: RPPRowMenuProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleEdit = () => {
    router.push(`/dashboard/rpp/edit/${documentId}`)
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
