import { HeroHeader, ContentSection } from '@/types/landing-contents';

/* ====================
[> CUSTOMIZING CONTENT <]
-- Setup image by typing `/image-name.file` (Example: `/header-image.jpg`)
-- Add images by adding files to /public folder
-- Leave blank `` if you don't want to put texts or images
 ==================== */

export const heroHeader: HeroHeader = {
  header: `RancangDidik: Platform Perencanaan Edukasi Lengkap dengan AI Otomatisasi`,
  subheader: `RancangDidik memudahkan pembuatan RPP, soal otomatis, sesi mingguan, dan raport digital—diberdayai oleh Generative AI.`,
  image: ``
};

export const featureCards: ContentSection = {
  header: `Powered by`,
  subheader: `What makes this dashboard possible`,
  content: [
    {
      text: `Next.js`,
      subtext: `The React Framework`,
      icon: 'nextjs'
    },
    {
      text: `shadcn/ui`,
      subtext: `Beautifully designed components`,
      icon: 'shadcnUi'
    },
    {
      text: `Vercel`,
      subtext: `Develop. Preview. Ship.`,
      icon: 'vercel'
    }
  ]
};

export const features: ContentSection = {
  header: `Fitur Utama`,
  subheader: `Segera ciptakan RPP, soal, sesi belajar, dan raport digital secara otomatis menggunakan Generative AI.`,
  content: [
    {
      text: `RPP Otomatis`,
      subtext: `Buat RPP secara otomatis berdasaran kebutuhan`,
      icon: 'fileSearch'
    },
    {
      text: `AssesGen Engine`,
      subtext: `Buat soal asesmen essay dan pilihan ganda secara otomatis menggunakan AssesGen Engine`,
      icon: 'barChart'
    },
    {
      text: `Raport Digital`,
      subtext: `Buat raport secara otomatis`,
      icon: 'settings'
    }
  ]
};
