import { useState, useEffect } from 'react';

export const useMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [mobilePreviewMode, setMobilePreviewMode] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // If preview mode is on, force mobile layout even on desktop
  const isEffectivelyMobile = isMobile || mobilePreviewMode;

  return { isMobile, mobilePreviewMode, setMobilePreviewMode, isEffectivelyMobile };
};
