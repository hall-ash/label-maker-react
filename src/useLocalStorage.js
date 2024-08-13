// stores data in localStorage
// runs whenever the key or item are changed
// if item is null, removes item from localStorage
import { useState, useEffect } from 'react';

const useLocalStorage = (key) => {
  const value = localStorage.getItem(key);

  const [item, setItem] = useState(value);

  useEffect(() => {
    const storeItemInLocalStorage = () => {
      if (item) localStorage.setItem(key, item);
      else localStorage.removeItem(key);
    }
    storeItemInLocalStorage();
  }, [key, item])

  return [item, setItem];
}

export default useLocalStorage;