import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

export type UserRole = 'patient' | 'chw' | 'clinician' | 'admin' | null;
export type Language = 'sw' | 'en';

interface AppContextType {
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isOffline: boolean;
  setIsOffline: (offline: boolean) => void;
  userData: any;
  setUserData: (data: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [language, setLanguageState] = useState<Language>((i18n.language as Language) || 'sw');
  const [isOffline, setIsOffline] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Sync language with i18n
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setLanguageState(lng as Language);
    };

    i18n.on('languageChanged', handleLanguageChange);
    
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Custom setLanguage that updates i18n
  const setLanguage = async (lang: Language) => {
    try {
      await i18n.changeLanguage(lang);
      setLanguageState(lang);
    } catch (error) {
      console.error('Failed to change language:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        userRole,
        setUserRole,
        language,
        setLanguage,
        isOffline,
        setIsOffline,
        userData,
        setUserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}