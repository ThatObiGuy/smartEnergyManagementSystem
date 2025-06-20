import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SiteContextType {
  siteId: number | null;
  setSiteId: (id: number) => void;
}

const defaultContext: SiteContextType = {
  siteId: null,
  setSiteId: () => {}
};

const SiteContext = createContext<SiteContextType>(defaultContext);

export const useSiteContext = () => useContext(SiteContext);

interface SiteProviderProps {
  children: ReactNode;
}

export const SiteProvider: React.FC<SiteProviderProps> = ({ children }) => {
  const [siteId, setSiteId] = useState<number | null>(null);


  return (
    <SiteContext.Provider value={{ siteId, setSiteId }}>
      {children}
    </SiteContext.Provider>
  );
};