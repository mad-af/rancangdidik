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
  academicYear: string;
  attachmentUrl: string;
  created_at: string;
  updated_at: string;
};

//Info: The following data is used for the sidebar navigation and Cmd K bar.
export const navItems: NavItem[] = [
  {
    title: 'List RPP',
    url: '/dashboard/rpp',
    icon: Category,
    isActive: false,
    shortcut: ['d', 'd'],
    items: [] // Empty array as there are no child items for Dashboard
  },
  {
    title: 'Analytics',
    url: '/dashboard/documents',
    icon: Chart,
    shortcut: ['d', 'o'],
    isActive: false,
    items: [] // No child items
  },
  // {
  //   title: 'Account',
  //   url: '#', // Placeholder as there is no direct link for the parent
  //   icon: 'billing',
  //   isActive: true,

  //   items: [
  //     {
  //       title: 'Profile',
  //       url: '/dashboard/profile',
  //       icon: 'userPen',
  //       shortcut: ['m', 'm']
  //     },
  //     {
  //       title: 'Login',
  //       shortcut: ['l', 'l'],
  //       url: '/',
  //       icon: 'login'
  //     }
  //   ]
  // },
  {
    title: 'Invoice',
    url: '/dashboard/kanban',
    icon: Ticket,
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Schedule',
    url: '/dashboard/kanban',
    icon: Document,
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Calendar',
    url: '/dashboard/kanban',
    icon: Calendar,
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Messages',
    url: '/dashboard/kanban',
    icon: Activity,
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Notification',
    url: '/dashboard/kanban',
    icon: Notification,
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
  {
    title: 'Settings',
    url: '/dashboard/kanban',
    icon: Setting,
    shortcut: ['k', 'k'],
    isActive: false,
    items: [] // No child items
  },
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
