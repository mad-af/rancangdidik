interface HeadingProps {
  children: string;
  subtext?: string;
  className?: string;
}

export default function HeadingText({
  children,
  subtext,
  className
}: HeadingProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <h1 className='text-primary text-3xl font-bold lg:text-4xl'>
        {children}
      </h1>
      {subtext && (
        <h2 className='text-muted-foreground font-light lg:text-lg'>
          {subtext}
        </h2>
      )}
    </div>
  );
}
