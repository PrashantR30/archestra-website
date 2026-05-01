'use client';

import { useEffect, useRef } from 'react';

import Footer from '@components/Footer';
import Header from '@components/Header';

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

const CALENDLY_URL = 'https://calendly.com/d/cswr-dwp-tsr/archestra-enterprise-demo';
const CALENDLY_CSS = 'https://assets.calendly.com/assets/external/widget.css';
const CALENDLY_JS = 'https://assets.calendly.com/assets/external/widget.js';

export default function BookDemoPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cssLink: HTMLLinkElement | null = null;
    if (!document.querySelector(`link[href="${CALENDLY_CSS}"]`)) {
      cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = CALENDLY_CSS;
      document.head.appendChild(cssLink);
    }

    const init = () => {
      if (!window.Calendly || !containerRef.current) return;
      containerRef.current.innerHTML = '';
      window.Calendly.initInlineWidget({
        url: CALENDLY_URL,
        parentElement: containerRef.current,
      });
    };

    if (window.Calendly) {
      init();
      return () => {
        cssLink?.remove();
      };
    }

    const existing = document.querySelector<HTMLScriptElement>(`script[src="${CALENDLY_JS}"]`);
    let script: HTMLScriptElement;
    if (existing) {
      script = existing;
      script.addEventListener('load', init);
    } else {
      script = document.createElement('script');
      script.src = CALENDLY_JS;
      script.async = true;
      script.addEventListener('load', init);
      document.body.appendChild(script);
    }

    return () => {
      script.removeEventListener('load', init);
      cssLink?.remove();
    };
  }, []);

  return (
    <>
      <link rel="preconnect" href="https://assets.calendly.com" crossOrigin="" />
      <link rel="preconnect" href="https://calendly.com" crossOrigin="" />
      <Header />
      <main className="bg-white">
        <section className="py-8 px-4">
          <div className="max-w-5xl mx-auto">
            <div ref={containerRef} style={{ minWidth: '320px', height: '700px' }} />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
