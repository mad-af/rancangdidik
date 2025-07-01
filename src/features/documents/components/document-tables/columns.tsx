'use client';
import { Badge } from '@/components/ui/badge';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Document } from '@/constants/data';
import { Column, ColumnDef } from '@tanstack/react-table';
import { CheckCircle2, Text, XCircle, FileText } from 'lucide-react';
import { CellAction } from '@/features/documents/components/document-tables/cell-action';
import { PHASE_OPTIONS, SUBJECT_OPTIONS } from './options';

export const columns: ColumnDef<Document>[] = [
  {
    accessorKey: 'attachmentUrl',
    header: 'ATTACHMENT',
    cell: ({ row }) => {
      return (
        <div className='flex items-center justify-center'>
          <FileText className='h-6 w-6 text-blue-500' />
        </div>
      );
    }
  },
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
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
