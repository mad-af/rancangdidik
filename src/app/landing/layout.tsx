import LandingNavbar from '@/components/landing/navbar';
import LandingFooter from '@/components/landing/footer';

export default function LandingLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LandingNavbar />
      {children}
      <LandingFooter />
    </>
  );
}
