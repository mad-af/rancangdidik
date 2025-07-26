import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PageContainer({
  children,
  scrollable = true
}: {
  children: React.ReactNode;
  scrollable?: boolean;
}) {
  return (
    <>
      {scrollable ? (
        <ScrollArea className='h-[calc(100dvh-52px)]'>
          <div className='w-full flex-1 p-4 md:px-6'>{children}</div>
        </ScrollArea>
      ) : (
        <div className='w-full flex-1 p-4 md:px-6'>{children}</div>
      )}
    </>
  );
}
