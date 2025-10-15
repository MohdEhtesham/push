// src/store/ApiContext.js
import React, {createContext, useState, useContext} from 'react';

const ApiContext = createContext();

export function AppProvider({children}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async url => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network response not ok');
      const json = await res.json();
      setData(json);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  return <ApiContext.Provider value={{data, loading, error, fetchData}}>{children}</ApiContext.Provider>;
}

export function useApi() {
  return useContext(ApiContext);
}
