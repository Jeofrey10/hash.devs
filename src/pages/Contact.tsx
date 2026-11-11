import { useEffect } from 'react';
import { ContactSection, Footer } from '@/sections/home';

export default function Contact() {
  useEffect(() => {
    document.title = 'Contact // HASH.DEVS — Project Initiation';
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative w-full bg-brand-obsidian min-h-screen pt-12">
      <ContactSection />
      <Footer />
    </div>
  );
}



