import Link from 'next/link';

const navLinks = [
  { route: 'Home', path: '/landing' },
  { route: 'Raport Otomatis', path: '/landing#features' },
  { route: 'Buat RPP', path: '/dashboard' },
  { route: 'Buat Asesmen', path: '/dashboard' },
];

export default function LandingFooter() {
  return (
    <footer className='mt-auto'>
      <div className='mx-auto w-full max-w-screen-xl p-6 md:py-8'>
        <div className='sm:flex sm:items-center sm:justify-between'>
          <Link href='/landing'>
            <h1 className='mb-2 text-2xl font-bold sm:mb-0'>
              RancangDidik
            </h1>
          </Link>
          <ul className='text-primary mb-6 flex flex-wrap items-center opacity-60 sm:mb-0'>
            {navLinks.map((link) => (
              <li key={link.route}>
                <Link href={link.path} className='mr-4 hover:underline md:mr-6'>
                  {link.route}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <hr className='text-muted-foreground my-6 sm:mx-auto lg:my-8' />
        <span className='text-muted-foreground block text-sm sm:text-center'>
          © {new Date().getFullYear()}{' '}
          <span className='hover:underline'>RancangDidik</span>. All Rights
          Reserved.
        </span>
      </div>
    </footer>
  );
}
