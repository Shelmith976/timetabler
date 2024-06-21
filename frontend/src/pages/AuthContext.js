import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')) || null);

  const login = (userData, role) => {
    // Save user data and role to session storage
    sessionStorage.setItem('user', JSON.stringify(userData));
    sessionStorage.setItem('role', role);
    
    // Set user state
    setUser({ ...userData, role });
  };

  const logout = () => {
    // Remove user data and role from session storage
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');
    
    // Clear user state
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
