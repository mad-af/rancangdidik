'use client';

import { FileUploader } from '@/components/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Document } from '@/constants/data';
import { createDocument, updateDocument } from '@/lib/api/documents';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import * as z from 'zod';

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain'
];

const formSchema = z.object({
  attachment: z
    .any()
    .optional()
    .refine(
      (files) =>
        !files || files?.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE,
      `Max file size is 5MB.`
    )
    .refine(
      (files) =>
        !files ||
        files?.length === 0 ||
        ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      '.pdf, .doc, .docx and .txt files are accepted.'
    ),
  subject: z.string().min(2, {
    message: 'Subject must be at least 2 characters.'
  }),
  teacherName: z.string().min(2, {
    message: 'Teacher name must be at least 2 characters.'
  }),
  phase: z.string().min(1, {
    message: 'Please select a phase.'
  }),
  academicYear: z.string().min(1, {
    message: 'Please select an academic year.'
  })
});

export default function DocumentForm({
  initialData,
  pageTitle
}: {
  initialData: Document | null;
  pageTitle: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!initialData;

  const defaultValues = {
    subject: initialData?.subject || '',
    teacherName: initialData?.teacherName || '',
    phase: initialData?.phase || '',
    academicYear: initialData?.academicYear || ''
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    values: defaultValues
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);

      const documentData = {
        subject: values.subject,
        teacherName: values.teacherName,
        phase: values.phase,
        academicYear: values.academicYear,
        attachmentUrl:
          initialData?.attachmentUrl ||
          `https://example.com/documents/sample-${Math.floor(Math.random() * 100) + 1}.pdf`
      };

      if (isEditing && initialData) {
        await updateDocument(initialData.id, documentData);
        toast.success('Document updated successfully!');
      } else {
        await createDocument(documentData);
        toast.success('Document created successfully!');
      }

      router.push('/dashboard/documents');
      router.refresh();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error(
        isEditing ? 'Failed to update document' : 'Failed to create document'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className='mx-auto w-full'>
      <CardHeader>
        <CardTitle className='text-left text-2xl font-bold'>
          {pageTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
            <FormField
              control={form.control}
              name='attachment'
              render={({ field }) => (
                <div className='space-y-6'>
                  <FormItem className='w-full'>
                    <FormLabel>Document Attachment</FormLabel>
                    <FormControl>
                      <FileUploader
                        value={field.value}
                        onValueChange={field.onChange}
                        maxFiles={1}
                        maxSize={5 * 1024 * 1024}
                        // disabled={loading}
                        // progresses={progresses}
                        // pass the onUpload function here for direct upload
                        // onUpload={uploadFiles}
                        // disabled={isUploading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </div>
              )}
            />

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <FormField
                control={form.control}
                name='subject'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter subject' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='teacherName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teacher Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Enter teacher name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phase'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phase</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select phase' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='Foundation'>Foundation</SelectItem>
                        <SelectItem value='Intermediate'>
                          Intermediate
                        </SelectItem>
                        <SelectItem value='Advanced'>Advanced</SelectItem>
                        <SelectItem value='Expert'>Expert</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='academicYear'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Academic Year</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select academic year' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='2023/2024'>2023/2024</SelectItem>
                        <SelectItem value='2024/2025'>2024/2025</SelectItem>
                        <SelectItem value='2025/2026'>2025/2026</SelectItem>
                        <SelectItem value='2026/2027'>2026/2027</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type='submit' disabled={isLoading}>
              {isLoading
                ? 'Saving...'
                : isEditing
                  ? 'Update Document'
                  : 'Add Document'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
