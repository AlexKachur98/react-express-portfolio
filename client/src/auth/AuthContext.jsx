import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { signin, signout, signup } from '../utils/api.js';

const AuthContext = createContext(null);
const STORAGE_KEY = 'portfolio_auth';

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed?.user) {
                    setUser(parsed.user);
                    setToken(parsed.token || null);
                }
            }
        } catch {
            // Ignore malformed storage
        }
    }, []);

    const persistAuth = (payload) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch {
            // Ignore storage errors
        }
    };

    const clearAuth = () => {
        setUser(null);
        setToken(null);
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch {
            // Ignore storage errors
        }
    };

    const handleSignin = async ({ email, password }) => {
        const res = await signin({ email, password });
        if (res?.error) return { error: res.error };
        if (res?.user && res?.token) {
            setUser(res.user);
            setToken(res.token);
            persistAuth({ user: res.user, token: res.token });
            return {};
        }
        return { error: 'Unexpected signin response.' };
    };

    const handleSignup = async ({ name, email, password }) => {
        const res = await signup({ name, email, password });
        if (res?.error) return { error: res.error };
        return {};
    };

    const handleSignout = async () => {
        await signout();
        clearAuth();
    };

    const value = useMemo(() => ({
        user,
        token,
        isAuthenticated: Boolean(user),
        isAdmin: user?.role === 'admin',
        handleSignin,
        handleSignup,
        handleSignout
    }), [user, token]);

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
