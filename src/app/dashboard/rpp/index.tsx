import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DownloadIcon, PlusIcon } from "lucide-react"
import { RPPTable } from "@/components/rpp/RPPTable"

export default function RPPPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">List RPP</h1>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      <div className="flex justify-end">
        <Input placeholder="Search..." className="w-1/3" />
      </div>

      <RPPTable />
    </div>
  )
}
