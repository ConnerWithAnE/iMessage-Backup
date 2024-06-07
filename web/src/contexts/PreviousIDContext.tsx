import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';

interface PreviousMessageIDContextType {
    previousMessageID: number | null;
    setPreviousMessageID: Dispatch<SetStateAction<number | null>>;
}

export const PreviousMessageIDContext = createContext<PreviousMessageIDContextType | null>(null);

export const usePreviousMessageID = () => {
    const context = useContext(PreviousMessageIDContext);
    if (!context) {
        throw new Error('usePreviousMessageIDContext must be used within a PreviousMessageIDProvider');
    }
    return context;
};

