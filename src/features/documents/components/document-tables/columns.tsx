'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Document } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Text, XCircle, FileText, Download } from 'lucide-react';
import { CellAction } from '@/features/documents/components/document-tables/cell-action';
import { PHASE_OPTIONS, SUBJECT_OPTIONS } from './options';

export const columns: ColumnDef<Document>[] = [
  {
    id: 'subject',
    accessorKey: 'subject',
    header: ({ column }: { column: Column<Document, unknown> }) => (
      <DataTableColumnHeader column={column} title='Subject' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Document['subject']>()}</div>,
    meta: {
      label: 'Subject',
      placeholder: 'Search documents...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'teacherName',
    header: ({ column }: { column: Column<Document, unknown> }) => (
      <DataTableColumnHeader column={column} title='Teacher' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Document['teacherName']>()}</div>
  },
  {
    id: 'phase',
    accessorKey: 'phase',
    header: ({ column }: { column: Column<Document, unknown> }) => (
      <DataTableColumnHeader column={column} title='Phase' />
    ),
    cell: ({ cell }) => {
      const phase = cell.getValue<Document['phase']>();
      const getPhaseColor = (phase: string) => {
        switch (phase) {
          case 'Foundation':
            return 'bg-green-100 text-green-800';
          case 'Intermediate':
            return 'bg-blue-100 text-blue-800';
          case 'Advanced':
            return 'bg-orange-100 text-orange-800';
          case 'Expert':
            return 'bg-red-100 text-red-800';
          default:
            return 'bg-gray-100 text-gray-800';
        }
      };

      return (
        <Badge
          variant='outline'
          className={`capitalize ${getPhaseColor(phase)}`}
        >
          {phase}
        </Badge>
      );
    },
    enableColumnFilter: true,
    meta: {
      label: 'phases',
      variant: 'multiSelect',
      options: PHASE_OPTIONS
    }
  },
  {
    accessorKey: 'academicYear',
    header: ({ column }: { column: Column<Document, unknown> }) => (
      <DataTableColumnHeader column={column} title='Academic Year' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Document['academicYear']>()}</div>
  },
  {
    accessorKey: 'created_at',
    header: ({ column }: { column: Column<Document, unknown> }) => (
      <DataTableColumnHeader column={column} title='Created At' />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<Document['created_at']>());
      return <div>{date.toLocaleDateString()}</div>;
    }
  },
  {
    accessorKey: 'attachmentUrl',
    header: ({ column }: { column: Column<Document, unknown> }) => (
      <DataTableColumnHeader column={column} title='Attachment' />
    ),
    cell: ({ row }) => {
      const attachmentUrl = row.getValue('attachmentUrl') as string;

      const handleDownload = () => {
        if (attachmentUrl) {
          // Create a temporary link element
          const link = document.createElement('a');
          link.href = attachmentUrl;
          link.download = `${row.original.subject}_${row.original.teacherName}.pdf`;
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };

      return (
        <div>
          {attachmentUrl ? (
            <button
              onClick={handleDownload}
              className='flex items-center gap-2 rounded-md bg-blue-500 px-3 py-1 text-sm text-white transition-colors duration-200 hover:bg-blue-600'
              title='Download PDF'
            >
              <Download className='h-4 w-4' />
              Download
            </button>
          ) : (
            <div className='flex cursor-not-allowed items-center gap-2 rounded-md bg-gray-300 px-3 py-1 text-sm text-gray-500'>
              <FileText className='h-4 w-4' />
              No File
            </div>
          )}
        </div>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
