/**
 * @file AuthContext.jsx
 * @author Alex Kachur
 * @since 2025-11-22
 * @purpose Provides auth state and helpers to the React app, persisting sessions locally.
 *
 * TODO: [TypeScript Migration] Convert this file to TypeScript for full type safety.
 * Priority: HIGH - Security-critical authentication context.
 * Key types to define:
 * - AuthContextValue: { user, isAuthenticated, isAdmin, signin, signout, signup }
 * - User: { _id, name, email, role }
 * - SigninCredentials: { email, password }
 * - SignupData: { name, email, password }
 */

// React
import { createContext, useContext, useEffect, useState } from 'react';

// API
import {
    signin as signinApi,
    signout as signoutApi,
    signup as signupApi,
    validateSession
} from '../utils/api.js';

/* eslint-disable react-refresh/only-export-components */
const AuthContext = createContext(null);
const STORAGE_KEY = 'portfolio_auth_user';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        // Restore user info from localStorage and validate with server
        const initializeAuth = async () => {
            try {
                const stored = localStorage.getItem(STORAGE_KEY);
                if (!stored) {
                    setInitializing(false);
                    return;
                }

                const parsed = JSON.parse(stored);
                if (!parsed) {
                    setInitializing(false);
                    return;
                }

                // Validate session with server to ensure JWT cookie is still valid
                const res = await validateSession();
                if (res?.user) {
                    // Session is valid - use fresh user data from server
                    persistUser(res.user);
                } else {
                    // Session expired or invalid - clear stale localStorage
                    localStorage.removeItem(STORAGE_KEY);
                    setUser(null);
                }
            } catch {
                // On error, clear potentially stale session
                localStorage.removeItem(STORAGE_KEY);
                setUser(null);
            } finally {
                setInitializing(false);
            }
        };

        initializeAuth();
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

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return ctx;
}
