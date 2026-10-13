const STORAGE_PREFIX = "saasflow_";

export const storageService = {
  get(key, fallback = null) {
    try {
      const storedValue = localStorage.getItem(
        `${STORAGE_PREFIX}${key}`
      );

      if (storedValue === null) {
        return fallback;
      }

      return JSON.parse(storedValue);
    } catch (error) {
      console.error(`Failed to read ${key}`, error);
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(
        `${STORAGE_PREFIX}${key}`,
        JSON.stringify(value)
      );

      return true;
    } catch (error) {
      console.error(`Failed to save ${key}`, error);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(
        `${STORAGE_PREFIX}${key}`
      );

      return true;
    } catch (error) {
      console.error(`Failed to remove ${key}`, error);
      return false;
    }
  }
};