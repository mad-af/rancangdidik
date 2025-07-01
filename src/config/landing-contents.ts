import { HeroHeader, ContentSection } from '@/types/landing-contents';

/* ====================
[> CUSTOMIZING CONTENT <]
-- Setup image by typing `/image-name.file` (Example: `/header-image.jpg`)
-- Add images by adding files to /public folder
-- Leave blank `` if you don't want to put texts or images
 ==================== */

export const heroHeader: HeroHeader = {
  header: `Dashboard made easy`,
  subheader: `Easy to setup. Customizable. Quick. Responsive.`,
  image: `/hero-img.webp`
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
  header: `Features`,
  subheader: `Why use this dashboard?`,
  image: `/features-img.webp`,
  content: [
    {
      text: `SEO Optimized`,
      subtext: `Improved website visibility on search engines`,
      icon: 'fileSearch'
    },
    {
      text: `Highly Performant`,
      subtext: `Fast loading times and smooth performance`,
      icon: 'barChart'
    },
    {
      text: `Easy Customizability`,
      subtext: `Change your content and layout with little effort`,
      icon: 'settings'
    }
  ]
};
