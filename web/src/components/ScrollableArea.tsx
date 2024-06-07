// ScrollableArea.tsx
import React, { ReactNode } from 'react';

interface ScrollableAreaProps {
    children: ReactNode;
}

const ScrollableArea: React.FC<ScrollableAreaProps> = ({ children }) => {
    return (
        <div className="w-full h-full overflow-y-auto border border-gray-200">
            {children}
        </div>
    );
};

export default ScrollableArea;
