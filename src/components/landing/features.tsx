import HeadingText from './heading-text';
import { features } from '@/config/landing-contents';
import { Icons } from '@/components/icons';

export default function Features() {
  return (
    <section
      className='container mx-auto space-y-8 py-12 lg:py-20'
      id='features'
    >
      {features.header || features.subheader ? (
        <HeadingText subtext={features.subheader} className='text-center'>
          {features.header}
        </HeadingText>
      ) : null}
      <div className='align-middle'>
        <div className=''>
          {features.content.map((cards) => {
            const Icon = Icons[cards.icon || 'blank'];

            return (
              <div
                key={cards.text}
                className='flex flex-col items-center gap-2 text-center md:flex-row md:gap-8 md:text-left'
              >
                <div className='flex'>
                  <Icon className='h-[6rem] w-[6rem]' />
                </div>
                <div className='flex-1'>
                  <p className='md:text4xl text-2xl font-semibold'>
                    {cards.text}
                  </p>
                  <p className='text-muted-foreground font-light md:text-lg'>
                    {cards.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
