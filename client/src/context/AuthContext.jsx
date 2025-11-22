/**
 * @file AuthContext.jsx
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Provides auth state and helpers to the React app, persisting sessions locally.
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { signin as signinApi, signout as signoutApi, signup as signupApi } from '../utils/api.js';

/* eslint-disable react-refresh/only-export-components */
const AuthContext = createContext(null);
const STORAGE_KEY = 'portfolio_auth_user';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        // Restore user info from localStorage so we can show admin UI without a fresh signin
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed) {
                    setUser(parsed);
                }
            }
        } catch {
            // Ignore corrupted storage entries
        } finally {
            setInitializing(false);
        }
    }, []);

    const persistUser = (nextUser) => {
        setUser(nextUser);
        try {
            if (nextUser) {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
            } else {
                localStorage.removeItem(STORAGE_KEY);
            }
        } catch {
            // Ignore storage errors (quota/blocked)
        }
    };

    const signin = async ({ email, password }) => {
        const res = await signinApi({ email, password });
        if (res?.error) return { error: res.error };
        if (res?.user) {
            persistUser(res.user);
            return { user: res.user };
        }
        return { error: 'Unexpected signin response.' };
    };

    const signout = async () => {
        await signoutApi();
        persistUser(null);
    };

    const signup = async ({ name, email, password }) => {
        const res = await signupApi({ name, email, password });
        if (res?.error) return { error: res.error };
        return res;
    };

    const value = {
        user,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        initializing,
        signin,
        signout,
        signup
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
}
