import { createContext, ReactNode, useContext, useState } from 'react';

interface SelectedTabContextType {
    selectedTab: string;
    setSelectedTab: (tab: string) => void;
}

interface SelectedTabProviderProps {
    children: ReactNode;
}

const SelectedTabContext = createContext<SelectedTabContextType | undefined>(undefined);

export const useSelectedTab = () => {
    const context = useContext(SelectedTabContext);
    if (!context) {
        throw new Error('useSelectedTab must be used within a SelectedTabProvider');
    }
    return context;
};

export const SelectedTabProvider: React.FC<SelectedTabProviderProps> = ({ children }) => {
    const [selectedTab, setSelectedTab] = useState('messages');

    return (
        <SelectedTabContext.Provider value={{ selectedTab, setSelectedTab }}>
            {children}
        </SelectedTabContext.Provider>
    );
};
