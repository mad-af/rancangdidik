import Link from 'next/link';
import Image from 'next/image';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { heroHeader } from '@/config/landing-contents';

export default function HeroHeader() {
  return (
    <section className='container mx-auto flex w-full flex-col gap-4 pt-4 pb-12 text-center lg:items-center lg:gap-8 lg:py-20'>
      <div className='flex flex-1 flex-col items-center gap-4 text-center lg:gap-8'>
        <div className='space-y-4'>
          <h1 className='text-4xl font-bold lg:text-6xl'>
            {heroHeader.header}
          </h1>
          <h2 className='text-muted-foreground text-lg font-light lg:text-3xl'>
            {heroHeader.subheader}
          </h2>
        </div>
        <Link
          href='/auth/sign-in'
          className={`w-[10rem] ${cn(buttonVariants({ size: 'lg' }))}`}
        >
          Mulai Sekarang
        </Link>
      </div>
      {heroHeader.image !== '' ? (
        <div className='flex flex-1 justify-center lg:justify-end'>
          <Image
            src={heroHeader.image}
            width={500}
            height={500}
            alt='Header image'
          />
        </div>
      ) : (
        <></>
      )}
    </section>
  );
}
