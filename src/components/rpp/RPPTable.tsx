import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DownloadIcon } from "lucide-react"
import { RPPRowMenu } from "./RPPRowMenu"

type RPPTableProps = {
  searchQuery: string
}

const mockData = [
  {
    subject: "Matematika",
    teacher: "James Mullican",
    phase: "D(Kelas VIII)",
    year: "Ganjil 2024/2025",
    date: "10 Dec, 2020"
  },
  {
    subject: "Bahasa Indonesia",
    teacher: "Siti Nurhaliza",
    phase: "C(Kelas VII)",
    year: "Genap 2023/2024",
    date: "22 Jan, 2024"
  },
  {
    subject: "IPA",
    teacher: "Agus Santoso",
    phase: "D(Kelas VIII)",
    year: "Ganjil 2024/2025",
    date: "03 Mar, 2024"
  },
  {
    subject: "IPS",
    teacher: "Rina Marlina",
    phase: "E(Kelas IX)",
    year: "Genap 2023/2024",
    date: "15 Apr, 2024"
  },
  {
    subject: "Pendidikan Pancasila",
    teacher: "Dedi Gunawan",
    phase: "C(Kelas VII)",
    year: "Ganjil 2024/2025",
    date: "18 Feb, 2023"
  }
]

export function RPPTable({ searchQuery }: RPPTableProps) {
  const filteredData = mockData.filter((row) =>
    `${row.subject} ${row.teacher} ${row.year}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

  return (
    <div className="border rounded-md">
      <table className="w-full table-auto text-left">
        <thead className="bg-muted">
          <tr>
            <th className="p-3"><Checkbox /></th>
            <th className="p-3">Mata Pelajaran</th>
            <th className="p-3">Nama Guru</th>
            <th className="p-3">Fase</th>
            <th className="p-3">Tahun Ajaran</th>
            <th className="p-3">Tanggal Pembuatan</th>
            <th className="p-3">Attachments</th>
            <th className="p-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((row, idx) => (
              <tr key={idx} className="border-b hover:bg-muted/40">
                <td className="p-3"><Checkbox /></td>
                <td className="p-3">{row.subject}</td>
                <td className="p-3">{row.teacher}</td>
                <td className="p-3">{row.phase}</td>
                <td className="p-3">{row.year}</td>
                <td className="p-3">{row.date}</td>
                <td className="p-3">
                  <Button variant="outline" size="sm" className="text-green-700 border-green-500">
                    <DownloadIcon className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                </td>
                <td className="p-3 text-center">
                  <RPPRowMenu />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center p-6 text-muted-foreground">
                No matching records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
