'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// --- Types ---
export interface AuthUser {
    name: string;
    email: string;
    username: string;
    address?: {
        street?: string;
        city?: string;
        state?: string;
        postcode?: string;
        country?: string;
    };
    professions?: string[];
    hasPayment?: boolean;
}

interface AuthContextValue {
    isLoggedIn: boolean;
    user: AuthUser | null;
    login: (user: AuthUser) => void;
    logout: () => void;
    updateUser: (partial: Partial<AuthUser>) => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = 'sp_auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Rehydrate from localStorage on mount
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw) as AuthUser;
                setUser(parsed);
            }
        } catch {
            // Corrupted storage — ignore
        } finally {
            setIsLoading(false);
        }
    }, []);

    const login = useCallback((newUser: AuthUser) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
        setUser(newUser);
    }, []);

    const logout = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    }, []);

    const updateUser = useCallback((partial: Partial<AuthUser>) => {
        setUser((prev) => {
            if (!prev) return prev;
            const updated = { ...prev, ...partial };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn: !!user, user, login, logout, updateUser, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
}
