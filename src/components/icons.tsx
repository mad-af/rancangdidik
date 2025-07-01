import {
  IconAlertTriangle,
  IconArrowRight,
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconCommand,
  IconCreditCard,
  IconFile,
  IconFileText,
  IconHelpCircle,
  IconPhoto,
  IconDeviceLaptop,
  IconLayoutDashboard,
  IconLoader2,
  IconLogin,
  IconProps,
  IconShoppingBag,
  IconMoon,
  IconDotsVertical,
  IconPizza,
  IconPlus,
  IconSettings,
  IconSun,
  IconTrash,
  IconBrandTwitter,
  IconUser,
  IconUserCircle,
  IconUserEdit,
  IconUserX,
  IconX,
  IconLayoutKanban,
  IconBrandGithub,
  IconFileSearch,
  IconChartBar,
  IconBrandNextjs,
  IconBrandVercel
} from '@tabler/icons-react';
import Image from 'next/image';

export type Icon = React.ComponentType<IconProps>;

export const Icons = {
  dashboard: IconLayoutDashboard,
  logo: IconCommand,
  login: IconLogin,
  close: IconX,
  product: IconShoppingBag,
  spinner: IconLoader2,
  kanban: IconLayoutKanban,
  chevronLeft: IconChevronLeft,
  chevronRight: IconChevronRight,
  trash: IconTrash,
  employee: IconUserX,
  post: IconFileText,
  page: IconFile,
  userPen: IconUserEdit,
  user2: IconUserCircle,
  media: IconPhoto,
  settings: IconSettings,
  billing: IconCreditCard,
  ellipsis: IconDotsVertical,
  add: IconPlus,
  warning: IconAlertTriangle,
  user: IconUser,
  arrowRight: IconArrowRight,
  help: IconHelpCircle,
  pizza: IconPizza,
  sun: IconSun,
  moon: IconMoon,
  laptop: IconDeviceLaptop,
  github: IconBrandGithub,
  twitter: IconBrandTwitter,
  check: IconCheck,
  // Landing page icons
  fileSearch: IconFileSearch,
  barChart: IconChartBar,
  nextjs: () => (
    <Image
      src='/next.svg'
      className='dark:brightness-0 dark:invert-[1]'
      width={100}
      height={100}
      alt='Next.js logo'
    />
  ),
  shadcnUi: () => (
    <div className='flex h-[100px] w-[100px] items-center justify-center'>
      <svg viewBox='0 0 256 256' className='h-16 w-16' fill='currentColor'>
        <rect width='256' height='256' fill='none'></rect>
        <line
          x1='208'
          y1='128'
          x2='128'
          y2='208'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='16'
        ></line>
        <line
          x1='192'
          y1='40'
          x2='40'
          y2='192'
          fill='none'
          stroke='currentColor'
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth='16'
        ></line>
      </svg>
    </div>
  ),
  vercel: IconBrandVercel,
  blank: () => <></>
};
