'use client';

import React, { createContext, useState, ReactNode } from 'react';
import { Staff } from '../../../payload-types';

interface IAuthContext {
  user: Staff | null;
  setUser: React.Dispatch<React.SetStateAction<Staff | null>>;
}

export const AuthContext = createContext<IAuthContext>({
  user: null,
  setUser: () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const mockUser: Staff = {
    id: 'mock-user-id',
    fullName: 'Mock User',
    email: 'mock@example.com',
    assignedRole: { id: 'mock-role-id', name: 'Admin', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const [user, setUser] = useState<Staff | null>(mockUser);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};