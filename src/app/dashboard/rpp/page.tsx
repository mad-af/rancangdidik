"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DownloadIcon, PlusIcon } from "lucide-react"
import { RPPTable } from "@/components/rpp/RPPTable"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function RPPPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">List RPP</h1>
        <div className="flex justify-end space-x-4">
          <Input placeholder="Search..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-1/3" />
          <Button onClick={() => router.push("/dashboard/rpp/create")}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add New
          </Button>
        </div>  
      </div>

      <RPPTable searchQuery={searchQuery}/>
    </div>
  )
}
