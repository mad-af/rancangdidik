'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import { useUser } from '@clerk/nextjs';

const navLinks = [
  { route: 'Home', path: '/landing' },
  { route: 'Raport Otomatis', path: '/landing#features' },
  { route: 'Buat RPP', path: '/dashboard' },
  { route: 'Buat Asesmen', path: '/dashboard' },
];

export default function LandingNavbar() {
  const [navbar, setNavbar] = useState(false);
  const { user, isLoaded } = useUser();

  const handleClick = async () => {
    setNavbar(false);
  };

  useEffect(() => {
    if (navbar) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [navbar]);

  return (
    <header className='select-none'>
      <nav className='mx-auto justify-between px-4 md:flex md:items-center md:px-8 lg:max-w-7xl'>
        <div>
          <div className='flex items-center justify-between py-3 md:block md:py-5'>
            <Link href='/landing' onClick={handleClick}>
              <h1 className='text-2xl font-bold duration-200 lg:hover:scale-[1.10]'>
                RancangDidik
              </h1>
            </Link>
            <div className='flex gap-1 md:hidden'>
              <button
                className='text-primary focus:border-primary rounded-md p-2 outline-none focus:border'
                aria-label='Hamburger Menu'
                onClick={() => setNavbar(!navbar)}
              >
                {navbar ? (
                  <Icons.close className='h-6 w-6' />
                ) : (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-6 w-6'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M4 6h16M4 12h16M4 18h16'
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <div
            className={`bg-background absolute right-0 left-0 z-10 m-auto justify-self-center rounded-md border p-4 md:static md:mt-0 md:block md:border-none md:p-0 ${
              navbar ? 'block' : 'hidden'
            }`}
            style={{ width: '100%', maxWidth: '20rem' }}
          >
            <ul className='text-primary flex flex-col items-center space-y-4 opacity-60 md:flex-row md:space-y-0 md:space-x-6'>
              {navLinks.map((link) => (
                <li key={link.route}>
                  <Link
                    className='hover:underline'
                    href={link.path}
                    onClick={handleClick}
                  >
                    {link.route}
                  </Link>
                </li>
              ))}
              <li>
                {isLoaded && user ? (
                  <Link href='/dashboard/overview'>
                    <Button variant='default' size='sm'>
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href='/auth/sign-in'>
                    <Button variant='default' size='sm'>
                      Sign In
                    </Button>
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
