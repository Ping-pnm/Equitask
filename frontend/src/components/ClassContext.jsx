import { createContext, useContext, useState } from 'react';

const ClassContext = createContext();

export function ClassProvider({ children }) {
    const [activeClassId, setActiveClassId] = useState(null);
    const [isLeader, setIsLeader] = useState(false);

    function updateRole(role) {
        setIsLeader(role === 'leader' ? true : false);
    }

    return (
        <ClassContext.Provider value={{ activeClassId, setActiveClassId, isLeader, updateRole }}>
            {children}
        </ClassContext.Provider>
    );
}

export function useClass() {
    return useContext(ClassContext);
}