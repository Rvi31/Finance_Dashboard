import { createContext, useContext, useReducer, useEffect } from "react";
import { initialTransactions } from "../data/transactions";

const AppContext = createContext(null);

function reducer(state, action) {
  switch (action.type) {
    case "SET_ROLE":
      return { ...state, role: action.payload };
    case "ADD_TRANSACTION":
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case "EDIT_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.map((t) =>
          t.id === action.payload.id ? action.payload : t,
        ),
      };
    case "DELETE_TRANSACTION":
      return {
        ...state,
        transactions: state.transactions.filter((t) => t.id !== action.payload),
      };
    default:
      return state;
  }
}

function loadState() {
  try {
    const txns = localStorage.getItem("fintrack_transactions");
    const role = localStorage.getItem("fintrack_role");
    return {
      transactions: txns ? JSON.parse(txns) : initialTransactions,
      role: role || "admin",
    };
  } catch {
    return { transactions: initialTransactions, role: "admin" };
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    localStorage.setItem(
      "fintrack_transactions",
      JSON.stringify(state.transactions),
    );
    localStorage.setItem("fintrack_role", state.role);
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
