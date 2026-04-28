import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { IUsuario } from '../ts/IUsuario';

interface IUsuarioLocalState {
  favorites: Record<string, boolean>;
  selectedIds: string[];
  localPhones: Record<string, string>;
}

type Action =
  | { type: 'TOGGLE_FAVORITE'; userId: string }
  | { type: 'ADD_MANY_FAVORITES'; userIds: string[] }
  | { type: 'TOGGLE_SELECTED_ORDERED'; userId: string; orderedIUsuarios: IUsuario[] }
  | { type: 'SELECT_ALL'; orderedIUsuarios: IUsuario[] }
  | { type: 'UPDATE_LOCAL_PHONE'; userId: string; phone: string }
  | { type: 'CLEAR_SELECTION' };

interface IUsuarioContextValue extends IUsuarioLocalState {
  toggleFavorite: (userId: string) => void;
  addManyFavorites: (userIds: string[]) => void;
  toggleSelectedOrdered: (userId: string, orderedIUsuarios: IUsuario[]) => void;
  selectAll: (orderedIUsuarios: IUsuario[]) => void;
  updateLocalPhone: (userId: string, phone: string) => void;
  clearSelection: () => void;
}

const initialState: IUsuarioLocalState = {
  favorites: {},
  selectedIds: [],
  localPhones: {},
};

function reducer(state: IUsuarioLocalState, action: Action): IUsuarioLocalState {
  switch (action.type) {
    case 'TOGGLE_FAVORITE': {
      const isFav = state.favorites[action.userId];
      return {
        ...state,
        favorites: { ...state.favorites, [action.userId]: !isFav },
      };
    }
    case 'ADD_MANY_FAVORITES': {
      const newFavs = { ...state.favorites };
      action.userIds.forEach((id) => { newFavs[id] = true; });
      return { ...state, favorites: newFavs };
    }
    case 'TOGGLE_SELECTED_ORDERED': {
      const { userId, orderedIUsuarios } = action;
      const userIndex = orderedIUsuarios.findIndex((u) => u.login.uuid === userId);
      if (userIndex === -1) return state;

      const isSelected = state.selectedIds.includes(userId);

      if (isSelected) {
        // Solo se puede deseleccionar si no hay usuarios seleccionados después de este en el orden
        const subsequentSelected = orderedIUsuarios
          .slice(userIndex + 1)
          .some((u) => state.selectedIds.includes(u.login.uuid));
        if (subsequentSelected) return state;
        return {
          ...state,
          selectedIds: state.selectedIds.filter((id) => id !== userId),
        };
      } else {
        // Solo se puede seleccionar si el anterior en el orden ya está seleccionado (o es el primero)
        if (userIndex > 0) {
          const previousIUsuario = orderedIUsuarios[userIndex - 1];
          if (!state.selectedIds.includes(previousIUsuario.login.uuid)) return state;
        }
        return { ...state, selectedIds: [...state.selectedIds, userId] };
      }
    }
    case 'SELECT_ALL': {
      const allIds = action.orderedIUsuarios.map((u) => u.login.uuid);
      return { ...state, selectedIds: allIds };
    }
    case 'UPDATE_LOCAL_PHONE': {
      return {
        ...state,
        localPhones: { ...state.localPhones, [action.userId]: action.phone },
      };
    }
    case 'CLEAR_SELECTION': {
      return { ...state, selectedIds: [] };
    }
    default:
      return state;
  }
}

const IUsuarioContext = createContext<IUsuarioContextValue | null>(null);

export function IUsuarioProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const toggleFavorite = (userId: string) =>
    dispatch({ type: 'TOGGLE_FAVORITE', userId });

  const addManyFavorites = (userIds: string[]) =>
    dispatch({ type: 'ADD_MANY_FAVORITES', userIds });

  const toggleSelectedOrdered = (userId: string, orderedIUsuarios: IUsuario[]) =>
    dispatch({ type: 'TOGGLE_SELECTED_ORDERED', userId, orderedIUsuarios });

  const selectAll = (orderedIUsuarios: IUsuario[]) =>
    dispatch({ type: 'SELECT_ALL', orderedIUsuarios });

  const updateLocalPhone = (userId: string, phone: string) =>
    dispatch({ type: 'UPDATE_LOCAL_PHONE', userId, phone });

  const clearSelection = () => dispatch({ type: 'CLEAR_SELECTION' });

  return (
    <IUsuarioContext.Provider
      value={{
        ...state,
        toggleFavorite,
        addManyFavorites,
        toggleSelectedOrdered,
        selectAll,
        updateLocalPhone,
        clearSelection,
      }}
    >
      {children}
    </IUsuarioContext.Provider>
  );
}

export function useIUsuarioContext(): IUsuarioContextValue {
  const ctx = useContext(IUsuarioContext);
  if (!ctx) throw new Error('useIUsuarioContext must be used inside IUsuarioProvider');
  return ctx;
}
