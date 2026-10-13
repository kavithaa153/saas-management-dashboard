
import {
  createContext,
  useContext,
  useEffect,
  useReducer
} from "react";

import { storageService } from "../services/storageService";
import { initialState } from "../data/initialState";

const AppContext = createContext(null);
const STORAGE_KEY = "application";

function appReducer(state, action) {
  switch (action.type) {
    case "SET_APPLICATION":
      return action.payload;

    case "SET_USERS":
      return {
        ...state,
        users: action.payload
      };

    case "SET_PLANS":
      return {
        ...state,
        plans: action.payload
      };

    case "SET_SUBSCRIPTIONS":
      return {
        ...state,
        subscriptions: action.payload
      };

    case "SET_NOTIFICATIONS":
      return {
        ...state,
        notifications: action.payload
      };

    case "ADD_NOTIFICATION":
      return {
        ...state,
        notifications: [
          action.payload,
          ...(state.notifications || [])
        ]
      };

    case "MARK_NOTIFICATION_READ":
      return {
        ...state,
        notifications: (state.notifications || []).map(
          (notification) =>
            notification.id === action.payload
              ? { ...notification, read: true }
              : notification
        )
      };

    case "MARK_ALL_NOTIFICATIONS_READ":
      return {
        ...state,
        notifications: (state.notifications || []).map(
          (notification) => ({
            ...notification,
            read: true
          })
        )
      };

    case "REMOVE_NOTIFICATION":
      return {
        ...state,
        notifications: (state.notifications || []).filter(
          (notification) =>
            notification.id !== action.payload
        )
      };

    case "CLEAR_NOTIFICATIONS":
      return {
        ...state,
        notifications: []
      };

    case "SET_PREFERENCES":
      return {
        ...state,
        preferences: {
          ...(state.preferences || {}),
          ...(action.payload || {})
        }
      };

    default:
      return state;
  }
}

function getInitialState() {
  const storedApplication = storageService.get(
    STORAGE_KEY,
    null
  );

  const baseState = storedApplication || initialState;

  return {
    ...initialState,
    ...baseState,
    preferences: {
      ...(initialState.preferences || {}),
      ...(baseState.preferences || {}),
      theme:
        baseState.preferences?.theme === "dark"
          ? "dark"
          : "light"
    }
  };
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(
    appReducer,
    undefined,
    getInitialState
  );

  useEffect(() => {
    storageService.set(STORAGE_KEY, state);
  }, [state]);

  useEffect(() => {
    const theme = state.preferences?.theme || "light";

    document.documentElement.setAttribute(
      "data-theme",
      theme
    );
  }, [state.preferences?.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error(
      "useApp must be used inside AppProvider"
    );
  }

  return context;
}
