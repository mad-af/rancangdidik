"use client"
import PageContainer from '@/components/layout/page-container';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { DownloadIcon, PlusIcon } from "lucide-react"
import { RPPTable } from "@/components/rpp/RPPTable"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export default function RPPPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <Heading
            title="RPP Management"
            description="Manage your Rencana Pelaksanaan Pembelajaran (RPP) documents"
          />
          <Link
            href="/dashboard/rpp/create"
            className={cn(buttonVariants({ variant: 'default' }))}
          >
            <PlusIcon className="mr-2 h-4 w-4" />
            Create New RPP
          </Link>
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <Input
              placeholder="Search RPP documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          </div>
        </div>
        
        {/* Table container with background styling */}
        <div className="bg-gray-50 rounded-lg p-6">
          <RPPTable searchQuery={searchQuery} />
        </div>
      </div>
    </PageContainer>
  )
}