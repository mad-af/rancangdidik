"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Loader2 } from "lucide-react"
import { getDocument, updateDocument, type CreateDocumentData } from "@/lib/api/documents"
import { toast } from "sonner"

export default function EditRPPPage() {
  const router = useRouter()
  const params = useParams()
  const documentId = parseInt(params.id as string)
  
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [formData, setFormData] = useState<CreateDocumentData>({
    subject: "",
    teacherName: "",
    phase: "",
    academicYear: "",
    attachmentUrl: ""
  })

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setInitialLoading(true)
        const document = await getDocument(documentId)
        setFormData({
          subject: document.subject,
          teacherName: document.teacherName,
          phase: document.phase,
          academicYear: document.academicYear,
          attachmentUrl: document.attachmentUrl || ""
        })
      } catch (error) {
        console.error("Error fetching document:", error)
        toast.error("Gagal memuat data dokumen")
        router.push("/dashboard/rpp")
      } finally {
        setInitialLoading(false)
      }
    }

    if (documentId) {
      fetchDocument()
    }
  }, [documentId, router])

  const handleInputChange = (field: keyof CreateDocumentData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.subject || !formData.teacherName || !formData.phase || !formData.academicYear) {
      toast.error("Mohon lengkapi semua field yang wajib diisi")
      return
    }

    try {
      setLoading(true)
      await updateDocument(documentId, formData)
      toast.success("Dokumen RPP berhasil diperbarui!")
      router.push("/dashboard/rpp")
    } catch (error) {
      console.error("Error updating document:", error)
      toast.error("Gagal memperbarui dokumen. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="ml-2">Memuat data dokumen...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <h1 className="text-2xl font-bold">Edit RPP</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Form Edit Dokumen RPP</CardTitle>
          <CardDescription>
            Perbarui informasi dokumen RPP
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Mata Pelajaran *</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  placeholder="Contoh: Matematika"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="teacherName">Nama Guru *</Label>
                <Input
                  id="teacherName"
                  value={formData.teacherName}
                  onChange={(e) => handleInputChange("teacherName", e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phase">Fase *</Label>
                <Select 
                  value={formData.phase} 
                  onValueChange={(value) => handleInputChange("phase", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih fase" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A(Kelas I-II)">A (Kelas I-II)</SelectItem>
                    <SelectItem value="B(Kelas III-IV)">B (Kelas III-IV)</SelectItem>
                    <SelectItem value="C(Kelas V-VI)">C (Kelas V-VI)</SelectItem>
                    <SelectItem value="D(Kelas VII-VIII)">D (Kelas VII-VIII)</SelectItem>
                    <SelectItem value="E(Kelas IX-X)">E (Kelas IX-X)</SelectItem>
                    <SelectItem value="F(Kelas XI-XII)">F (Kelas XI-XII)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="academicYear">Tahun Ajaran *</Label>
                <Select 
                  value={formData.academicYear} 
                  onValueChange={(value) => handleInputChange("academicYear", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tahun ajaran" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ganjil 2024/2025">Ganjil 2024/2025</SelectItem>
                    <SelectItem value="Genap 2024/2025">Genap 2024/2025</SelectItem>
                    <SelectItem value="Ganjil 2025/2026">Ganjil 2025/2026</SelectItem>
                    <SelectItem value="Genap 2025/2026">Genap 2025/2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="attachmentUrl">URL Attachment (Opsional)</Label>
              <Input
                id="attachmentUrl"
                type="url"
                value={formData.attachmentUrl}
                onChange={(e) => handleInputChange("attachmentUrl", e.target.value)}
                placeholder="https://example.com/document.pdf"
              />
              <p className="text-sm text-muted-foreground">
                Masukkan URL file PDF atau dokumen lainnya
              </p>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                disabled={loading}
              >
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memperbarui...
                  </>
                ) : (
                  "Perbarui RPP"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}