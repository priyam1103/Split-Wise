import React, {useState, createContext } from "react";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <AuthContext.Provider value={{
            user, setUser, modalVisible,setModalVisible
        }}>
            {children}
        </AuthContext.Provider>
    )
}