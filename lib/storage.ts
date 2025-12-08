// /lib/storage.ts
// Simple localStorage wrapper for records.
// Works only in the browser. Methods are async to match your earlier usage.

export const storage = {
  /**
   * List keys that start with prefix.
   * Returns { keys: string[] }
   */
  list: async (prefix: string) => {
    if (typeof window === "undefined" || !window.localStorage) {
      throw new Error("localStorage not available");
    }
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) keys.push(k);
    }
    return { keys };
  },

  /**
   * Get value for a key. Returns { value: string | null }.
   */
  get: async (key: string) => {
    if (typeof window === "undefined" || !window.localStorage) {
      throw new Error("localStorage not available");
    }
    const value = localStorage.getItem(key);
    return { value };
  },

  /**
   * Set value for a key.
   */
  set: async (key: string, value: string) => {
    if (typeof window === "undefined" || !window.localStorage) {
      throw new Error("localStorage not available");
    }
    localStorage.setItem(key, value);
  },

  /**
   * Remove a key.
   */
  remove: async (key: string) => {
    if (typeof window === "undefined" || !window.localStorage) {
      throw new Error("localStorage not available");
    }
    localStorage.removeItem(key);
  },

  /**
   * Clear all keys that start with prefix.
   */
  clearPrefix: async (prefix: string) => {
    if (typeof window === "undefined" || !window.localStorage) {
      throw new Error("localStorage not available");
    }
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(prefix)) toRemove.push(k);
    }
    for (const k of toRemove) localStorage.removeItem(k);
  },
};
