import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, quotesAPI, clientsAPI } from '../services/api';

const AppContext = createContext();

const initialState = {
    user: null,
    isAdmin: false,
    clients: [],
    quotes: [],
    currentQuote: null,
    metalPrices: [],
    loading: false,
    notifications: []
};

function appReducer(state, action) {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                isAdmin: action.payload?.role === 'admin'
            };
        case 'SET_CLIENTS':
            return { ...state, clients: action.payload };
        case 'SET_QUOTES':
            return { ...state, quotes: action.payload };
        case 'SET_CURRENT_QUOTE':
            return { ...state, currentQuote: action.payload };
        case 'SET_METAL_PRICES':
            return { ...state, metalPrices: action.payload };
        case 'SET_LOADING':
            return { ...state, loading: action.payload };
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [...state.notifications, action.payload]
            };
        case 'REMOVE_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.filter(n => n.id !== action.payload)
            };
        default:
            return state;
    }
}

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    useEffect(() => {
        // Check for existing session
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        if (token && user) {
            dispatch({ type: 'SET_USER', payload: JSON.parse(user) });
            loadInitialData();
        }
    }, []);

    const loadInitialData = async (background = false) => {
        try {
            if (!background) dispatch({ type: 'SET_LOADING', payload: true });

            // We might not be able to load everything if not logged in, but this is called after login check
            const [clientsResponse, quotesResponse, metalResponse] = await Promise.all([
                clientsAPI.getAll().catch(() => ({ data: { clients: [] } })),
                quotesAPI.getAll().catch(() => ({ data: { quotes: [] } })),
                quotesAPI.getMetalPrices().catch(() => ({ data: { metalPrices: [] } }))
            ]);

            dispatch({ type: 'SET_CLIENTS', payload: clientsResponse.data.clients });
            dispatch({ type: 'SET_QUOTES', payload: quotesResponse.data.quotes });
            dispatch({ type: 'SET_METAL_PRICES', payload: metalResponse.data.metalPrices });
        } catch (error) {
            console.error('Failed to load initial data', error);
        } finally {
            if (!background) dispatch({ type: 'SET_LOADING', payload: false });
        }
    };

    const login = async (email, password) => {
        try {
            const response = await authAPI.login(email, password);
            const { user, token } = response.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            dispatch({ type: 'SET_USER', payload: user });
            await loadInitialData();

            showNotification('Login successful!', 'success');
            return true;
        } catch (error) {
            showNotification('Login failed', 'error');
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        dispatch({ type: 'SET_USER', payload: null });
        dispatch({ type: 'SET_CLIENTS', payload: [] });
        dispatch({ type: 'SET_QUOTES', payload: [] });
        window.location.href = '/login';
    };

    const showNotification = (message, type = 'info') => {
        const id = Date.now();
        dispatch({
            type: 'ADD_NOTIFICATION',
            payload: { id, message, type }
        });

        setTimeout(() => {
            dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
        }, 5000);
    };

    return (
        <AppContext.Provider value={{
            ...state,
            dispatch,
            login,
            logout,
            showNotification,
            loadInitialData
        }}>
            {children}
        </AppContext.Provider>
    );
}

export const useApp = () => useContext(AppContext);
