import { NavItem } from '@/types';
import Ticket from '@/assets/icons/Ticket';
import Chart from '@/assets/icons/Chart';
import Document from '@/assets/icons/Document';
import Calendar from '@/assets/icons/Calendar';
import Activity from '@/assets/icons/Activity';
import Notification from '@/assets/icons/Notification';
import Setting from '@/assets/icons/Setting';
import Category from '@/assets/icons/Category';


export type Document = {
  id: number;
  subject: string;
  teacherName: string;
  phase: string;
  semester: string;
  academicYear: string;
  attachmentUrl: string;
  created_at: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'Overview',
    url: '/dashboard/overview',
    icon: Chart,
    isActive: false,
    shortcut: ['o', 'v'],
    items: []
  },
  {
    title: 'RPP Management',
    url: '/dashboard/rpp',
    icon: Document,
    shortcut: ['r', 'p'],
    isActive: false,
    items: [
      {
        title: 'List RPP',
        url: '/dashboard/rpp'
      },
      {
        title: 'Create RPP',
        url: '/dashboard/rpp/create'
      }
    ]
  },
  {
    title: 'Documents',
    url: '/dashboard/documents',
    icon: Category,
    shortcut: ['d', 'o'],
    isActive: false,
    items: []
  },
  {
    title: 'Schedule',
    url: '/dashboard/schedule',
    icon: Calendar,
    shortcut: ['s', 'c'],
    isActive: false,
    items: []
  },
  {
    title: 'Analytics',
    url: '/dashboard/analytics',
    icon: Activity,
    shortcut: ['a', 'n'],
    isActive: false,
    items: []
  },
  {
    title: 'Messages',
    url: '/dashboard/messages',
    icon: Notification,
    shortcut: ['m', 's'],
    isActive: false,
    items: []
  },
  {
    title: 'Settings',
    url: '/dashboard/settings',
    icon: Setting,
    shortcut: ['s', 't'],
    isActive: false,
    items: [
      {
        title: 'Profile',
        url: '/dashboard/profile'
      },
      {
        title: 'Preferences',
        url: '/dashboard/settings/preferences'
      }
    ]
  }
];

export interface SaleUser {
  id: number;
  name: string;
  email: string;
  amount: string;
  image: string;
  initials: string;
}

export const recentSalesData: SaleUser[] = [
  {
    id: 1,
    name: 'Olivia Martin',
    email: 'olivia.martin@email.com',
    amount: '+$1,999.00',
    image: 'https://api.slingacademy.com/public/sample-users/1.png',
    initials: 'OM'
  },
  {
    id: 2,
    name: 'Jackson Lee',
    email: 'jackson.lee@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/2.png',
    initials: 'JL'
  },
  {
    id: 3,
    name: 'Isabella Nguyen',
    email: 'isabella.nguyen@email.com',
    amount: '+$299.00',
    image: 'https://api.slingacademy.com/public/sample-users/3.png',
    initials: 'IN'
  },
  {
    id: 4,
    name: 'William Kim',
    email: 'will@email.com',
    amount: '+$99.00',
    image: 'https://api.slingacademy.com/public/sample-users/4.png',
    initials: 'WK'
  },
  {
    id: 5,
    name: 'Sofia Davis',
    email: 'sofia.davis@email.com',
    amount: '+$39.00',
    image: 'https://api.slingacademy.com/public/sample-users/5.png',
    initials: 'SD'
  }
];
