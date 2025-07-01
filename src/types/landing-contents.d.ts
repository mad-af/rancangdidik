export type HeroHeader = {
  header: string;
  subheader: string;
  image: string;
};

export type Content = {
  text: string;
  subtext: string;
  icon?: keyof typeof import('@/components/icons').Icons;
};

export type ContentSection = {
  header: string;
  subheader: string;
  image?: string;
  content: Array<Content>;
};
