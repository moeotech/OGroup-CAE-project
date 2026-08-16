import { createContext, useContext, useState, ReactNode } from 'react';
import { User, Role } from '../types';

interface AuthContextType {
  user: User;
  setRole: (role: Role) => void;
  updateProfile: (updates: Partial<User>) => void;
}

const initialUser: User = {
  id: '1',
  name: 'أحمد عبدالله',
  email: 'ahmed@business.com',
  role: 'business',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(initialUser);

  const setRole = (role: Role) => {
    const roleProfiles: Record<Role, { name: string; email: string }> = {
      business: { name: 'أحمد عبدالله', email: 'ahmed@business.com' },
      creator: { name: 'سارة خالد', email: 'sara@creator.com' },
      sales: { name: 'محمد علي', email: 'mohammad@sales.com' },
      sales_manager: { name: 'سامر قاسم', email: 'samer@company.com' },
      admin: { name: 'مدير النظام', email: 'admin@ogroup.com' },
    };
    setUser({ ...user, role, ...roleProfiles[role] });
  };

  const updateProfile = (updates: Partial<User>) => {
    setUser({ ...user, ...updates });
  };

  return (
    <AuthContext.Provider value={{ user, setRole, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
