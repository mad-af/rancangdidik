import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { DownloadIcon, MoreVertical } from "lucide-react"
import { RPPRowMenu } from "./RPPRowMenu"

const mockData = [
  {
    subject: "Matematika",
    teacher: "James Mullican",
    phase: "D(Kelas VIII)",
    year: "Ganjil 2024/2025",
    date: "10 Dec, 2020"
  },
  // ... more rows
]

export function RPPTable() {
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
          {mockData.map((row, idx) => (
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
          ))}
        </tbody>
      </table>
    </div>
  )
}
