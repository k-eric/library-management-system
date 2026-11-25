import { createContext, useContext, useReducer, useEffect } from 'react';

const STORAGE_KEY = 'library_reading_list';

const ReadingListContext = createContext(null);

function loadInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readingListReducer(state, action) {
  switch (action.type) {
    case 'ADD_BOOK': {
      const book = action.payload;
      if (!book || state.some((item) => item.id === book.id)) {
        return state;
      }
      return [...state, book];
    }
    case 'REMOVE_BOOK': {
      const id = action.payload;
      return state.filter((item) => item.id !== id);
    }
    case 'CLEAR_LIST': {
      return [];
    }
    default:
      return state;
  }
}

export function ReadingListProvider({ children }) {
  const [items, dispatch] = useReducer(readingListReducer, [], loadInitialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage quota errors
    }
  }, [items]);

  const addBook = (book) => dispatch({ type: 'ADD_BOOK', payload: book });
  const removeBook = (bookId) => dispatch({ type: 'REMOVE_BOOK', payload: bookId });
  const clearList = () => dispatch({ type: 'CLEAR_LIST' });
  const isInReadingList = (bookId) => items.some((item) => item.id === bookId);

  return (
    <ReadingListContext.Provider
      value={{
        items,
        count: items.length,
        dispatch,
        addBook,
        removeBook,
        clearList,
        isInReadingList,
      }}
    >
      {children}
    </ReadingListContext.Provider>
  );
}

export function useReadingList() {
  const context = useContext(ReadingListContext);
  if (!context) {
    throw new Error('useReadingList must be used within a ReadingListProvider');
  }
  return context;
}