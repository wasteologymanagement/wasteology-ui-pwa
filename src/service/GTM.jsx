// src/services/GTM.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GTM_ID = 'GTM-WFB662H2'; // Replace with your GTM ID

// Define public route prefixes or exact paths
const PUBLIC_PATH_PATTERNS = [
  '/',                    // exact homepage
  '/about',               // exact
  '/services',            // exact
  '/services/',           // dynamic e.g., /services/e-waste
  '/scrap-rates',         // exact
  '/pricing',             // exact
  '/contact',             // exact
  '/signup',              // exact
  '/login/customer',      // exact
  '/login/admin',         // exact
  '/blog/',               // dynamic e.g., /blog/what-is-scrap
];

const isPublicPath = (pathname) => {
  return PUBLIC_PATH_PATTERNS.some((pattern) =>
    pathname === pattern || pathname.startsWith(pattern)
  );
};

const GTM = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isPublicPath(pathname)) return;

    const script = document.createElement('script');
    script.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${GTM_ID}');
    `;
    document.head.appendChild(script);

    const noscript = document.createElement('noscript');
    noscript.innerHTML = `
      <iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe>
    `;
    document.body.prepend(noscript);

    return () => {
      document.head.removeChild(script);
      document.body.removeChild(noscript);
    };
  }, [pathname]);

  return null;
};

export default GTM;
