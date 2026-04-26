import { createContext, useContext, useState } from 'react';

const ClassContext = createContext();

export function ClassProvider({ children }) {
    const [activeClassId, setActiveClassId] = useState(null);



    return (
        <ClassContext.Provider value={{ activeClassId, setActiveClassId }}>
            {children}
        </ClassContext.Provider>
    );
}

export function useClass() {
    return useContext(ClassContext);
}