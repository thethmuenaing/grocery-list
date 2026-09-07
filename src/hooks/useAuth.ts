import { useState, useCallback } from 'react';

const AUTH_STORAGE_KEY = 'grocery_app_auth';

export interface AuthUser {
  email: string;
  name: string;
}

function loadStoredUser(): AuthUser | null {
  try {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (parsed?.email && parsed?.name) return parsed as AuthUser;
  } catch {
    // ignore invalid stored auth
  }
  return null;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(loadStoredUser);

  const login = useCallback(async (email: string, password: string, remember: boolean) => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error('invalidEmail');
    }
    if (password.length < 6) {
      throw new Error('invalidPassword');
    }

    await new Promise((resolve) => setTimeout(resolve, 600));

    const authUser: AuthUser = {
      email: trimmedEmail,
      name: trimmedEmail.split('@')[0],
    };

    if (remember) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    }
    setUser(authUser);
  }, []);

  const register = useCallback(async (fullName: string, email: string, password: string) => {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedName) {
      throw new Error('registerNameRequired');
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      throw new Error('invalidEmail');
    }
    if (password.length < 6) {
      throw new Error('invalidPassword');
    }

    await new Promise((resolve) => setTimeout(resolve, 600));

    const authUser: AuthUser = {
      email: trimmedEmail,
      name: trimmedName,
    };

    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setUser(null);
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };
}
