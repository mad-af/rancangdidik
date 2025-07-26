"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, Loader2 } from "lucide-react"
import { createDocument, type CreateDocumentData } from "@/lib/api/documents"
import { toast } from "sonner"

export default function CreateRPPPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState<CreateDocumentData & {
    assessment?: string
    sessionCount?: string
  }>({
    subject: "",
    teacherName: "",
    phase: "",
    semester: "",
    academicYear: "",
    attachmentUrl: "",
    assessment: "",
    sessionCount: "12"
  })

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.subject || !formData.teacherName || !formData.phase || !formData.semester || !formData.academicYear || !formData.assessment) {
      toast.error("Mohon lengkapi semua field yang wajib diisi")
      return
    }

    try {
      setLoading(true)
      await createDocument(formData)
      toast.success("Dokumen RPP berhasil dibuat!")
      router.push("/dashboard/rpp")
    } catch (error) {
      console.error("Error creating document:", error)
      toast.error("Gagal membuat dokumen. Silakan coba lagi.")
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-2xl font-bold">Tambah RPP Baru</h1>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Form Dokumen RPP</CardTitle>
          <CardDescription>
            Lengkapi informasi berikut untuk membuat dokumen RPP baru
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
                <Label htmlFor="semester">Semester *</Label>
                <Select 
                  value={formData.semester} 
                  onValueChange={(value) => handleInputChange("semester", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ganjil">Ganjil</SelectItem>
                    <SelectItem value="Genap">Genap</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
                  <SelectItem value="2024/2025">2024/2025</SelectItem>
                  <SelectItem value="2025/2026">2025/2026</SelectItem>
                  <SelectItem value="2026/2027">2026/2027</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ✅ Assessment Type */}
            <div className="space-y-2">
              <Label htmlFor="assessment">Jenis Asesmen *</Label>
              <Select 
                value={formData.assessment || ""}
                onValueChange={(value) => handleInputChange("assessment", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis asesmen" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tugas">Tugas (PR / Di Sekolah)</SelectItem>
                  <SelectItem value="Ujian">Ujian</SelectItem>
                  <SelectItem value="Diskusi">Diskusi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ✅ File Upload */}
            <div className="space-y-2">
              <Label htmlFor="attachment">Upload File (Opsional)</Label>
              <Input
                id="attachment"
                type="file"
                accept=".pdf"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    const fileUrl = URL.createObjectURL(file)
                    handleInputChange("attachmentUrl", fileUrl)
                  }
                }}
              />
              <p className="text-sm text-muted-foreground">
                File akan digunakan untuk lampiran RPP (PDF)
              </p>
            </div>

            {/* ✅ Session Count Slider */}
            <div className="space-y-2">
              <Label htmlFor="sessionCount">Jumlah Pertemuan</Label>
              <Slider
                defaultValue={[12]}
                min={6}
                max={24}
                step={1}
                onValueChange={([value]) => handleInputChange("sessionCount", value.toString())}
              />
              <p className="text-sm text-muted-foreground">
                Akan digenerate sebanyak {formData.sessionCount} pertemuan
              </p>
            </div>

            {/* Buttons */}
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
                    Menyimpan...
                  </>
                ) : (
                  "Simpan RPP"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
