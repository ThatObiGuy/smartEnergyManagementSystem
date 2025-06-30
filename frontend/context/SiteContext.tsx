import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SiteContextType {
  siteId: number | null;
  setSiteId: (id: number) => void;
  installationDate: string | null;
  setInstallationDate: (date: string) => void;
  installationCost: number | null;
  setInstallationCost: (cost: number) => void;
}

const defaultContext: SiteContextType = {
  siteId: null,
  setSiteId: () => {},
  installationDate: null,
  setInstallationDate: () => {},
  installationCost: null,
  setInstallationCost: () => {}
};

const SiteContext = createContext<SiteContextType>(defaultContext);

export const useSiteContext = () => useContext(SiteContext);

interface SiteProviderProps {
  children: ReactNode;
}

export const SiteProvider: React.FC<SiteProviderProps> = ({ children }) => {
  const [siteId, setSiteId] = useState<number | null>(null);
  const [installationDate, setInstallationDate] = useState<string | null>(null);
  const [installationCost, setInstallationCost] = useState<number | null>(null);

  return (
    <SiteContext.Provider value={{ 
      siteId, 
      setSiteId, 
      installationDate, 
      setInstallationDate, 
      installationCost, 
      setInstallationCost 
    }}>
      {children}
    </SiteContext.Provider>
  );
};
