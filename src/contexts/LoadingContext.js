import { createContext, useContext, useState } from 'react'

const LoadingContext = createContext();

export function useLoading() {
  return useContext(LoadingContext);
}

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const updateLoading = (val) => {
    setLoading(val);
  };

  const context = {
    loading,
    updateLoading
  } 

  return <LoadingContext.Provider value={context}>{children}</LoadingContext.Provider>
}
