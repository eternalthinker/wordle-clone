export class LocalStorage {
  private constructor() {}

  public static setItem = (key: string, value: string): void => {
    try {
      window.localStorage.setItem(key, value);
    } catch (e) {
      console.log("Error setting local storage:", e);
    }
  };

  public static getItem = (key: string): string | null => {
    try {
      return window.localStorage.getItem(key);
    } catch (e) {
      console.log("Error retrieving local storage:", e);
    }
    return null;
  };
}
