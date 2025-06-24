import { useState, useEffect } from 'react';

export function useLocalStorage(key, initialValue) {
  // الحصول على القيمة من localStorage أو استخدام القيمة الافتراضية
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // إرجاع دالة مُحدثة تحفظ في localStorage
  const setValue = (value) => {
    try {
      // السماح بالقيم أو الدوال
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}