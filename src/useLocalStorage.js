// stores data in localStorage
// runs whenever the key or item are changed
// if item is null, removes item from localStorage
import { useState, useEffect } from 'react';

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


// const useLocalStorage = (key) => {
//   // Retrieve value from localStorage
//   const storedValue = localStorage.getItem(key);

//   // Parse the stored value only if it's valid JSON
//   let value;
//   try {
//     value = storedValue ? JSON.parse(storedValue) : null; // Handle null or missing key
//   } catch (e) {
//     console.error(`Error parsing JSON from localStorage for key "${key}":`, e);
//     value = null; // If parsing fails, set value to null
//   }

//   const [item, setItem] = useState(value);

//   useEffect(() => {
//     const storeItemInLocalStorage = () => {
//       if (item && Object.keys(item).length > 0) {
//         localStorage.setItem(key, JSON.stringify(item)); // Convert to JSON string before storing
//       } else {
//         localStorage.removeItem(key); // Remove item if value is empty
//       }
//     };
//     storeItemInLocalStorage();
//   }, [key, item]);

//   return [item, setItem];
// };

// const useLocalStorage = (key) => {
//   // Retrieve value from localStorage
//   const storedValue = localStorage.getItem(key);

//   // Parse the stored value only if it's valid JSON
//   let value;
//   try {
//     value = storedValue ? JSON.parse(storedValue) : null; // Handle null or missing key
//   } catch (e) {
//     console.error(`Error parsing JSON from localStorage for key "${key}":`, e);
//     value = null; // If parsing fails, set value to null
//   }

//   const [item, setItem] = useState(value);

//   useEffect(() => {
//     const storeItemInLocalStorage = () => {
//       if (item !== null && item !== undefined) {
//         localStorage.setItem(key, JSON.stringify(item)); // Convert to JSON string before storing
//       } else {
//         localStorage.removeItem(key); // Remove item if value is null or undefined
//       }
//     };
//     storeItemInLocalStorage();
//   }, [key, item]);

//   return [item, setItem];
// };


export default useLocalStorage;

