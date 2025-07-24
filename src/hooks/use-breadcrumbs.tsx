'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// This allows to add custom title as well
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Dashboard', link: '/dashboard' }],
  '/dashboard/overview': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Overview', link: '/dashboard/overview' }
  ],
  '/dashboard/rpp': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'RPP Management', link: '/dashboard/rpp' }
  ],
  '/dashboard/rpp/create': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'RPP Management', link: '/dashboard/rpp' },
    { title: 'Create RPP', link: '/dashboard/rpp/create' }
  ],
  '/dashboard/documents': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Documents', link: '/dashboard/documents' }
  ],
  '/dashboard/schedule': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Schedule', link: '/dashboard/schedule' }
  ],
  '/dashboard/analytics': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Analytics', link: '/dashboard/analytics' }
  ],
  '/dashboard/messages': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Messages', link: '/dashboard/messages' }
  ],
  '/dashboard/settings': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Settings', link: '/dashboard/settings' }
  ],
  '/dashboard/profile': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Settings', link: '/dashboard/settings' },
    { title: 'Profile', link: '/dashboard/profile' }
  ],
  '/dashboard/kanban': [
    { title: 'Dashboard', link: '/dashboard' },
    { title: 'Kanban Board', link: '/dashboard/kanban' }
  ]
  // Add more custom mappings as needed
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    // Check if we have a custom mapping for this exact path
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    // If no exact match, fall back to generating breadcrumbs from the path
    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      return {
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        link: path
      };
    });
  }, [pathname]);

  return breadcrumbs;
}
