import { useState, useCallback, useEffect } from 'react';

const useSubMenuToggle = () => {
  const [openMenus, setOpenMenus] = useState<Set<string>>(new Set());
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 991);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleSubMenu = useCallback((menuId: string) => {
    setOpenMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        newSet.add(menuId);
      }
      return newSet;
    });
  }, []);

  const isMenuOpen = useCallback((menuId: string) => {
    return openMenus.has(menuId);
  }, [openMenus]);

  const getMenuStyle = useCallback((menuId: string) => {
    // Only apply maxHeight on mobile, let CSS handle desktop
    
    if (!isMobile) return {};
    return { maxHeight: openMenus.has(menuId) ? '20000px' : '0' };
  }, [openMenus, isMobile]);

  return { toggleSubMenu, isMenuOpen, getMenuStyle };
};

export default useSubMenuToggle;
