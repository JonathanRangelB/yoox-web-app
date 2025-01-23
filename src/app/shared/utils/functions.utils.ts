import { User } from '../interfaces/userData.interface';

/**
 * Function to remove empty values from an object recursively
 */
export function removeEmptyValues(obj: any): any {
  return Object.entries(obj)
    .filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        value !== '' &&
        value !== 'undefined' &&
        value !== 'null'
    )
    .reduce((acc, [key, value]) => {
      acc[key] =
        value instanceof Object &&
        !Array.isArray(value) &&
        !(value instanceof Date)
          ? removeEmptyValues(value)
          : value;
      return acc;
    }, {} as any);
}

/** Function that gets the currently logged user from localStorage */
export function getUserFromLocalStorage(): User | null {
  const user = localStorage.getItem('user');
  if (!user) {
    console.warn('No se encontraron los datos del usuario en localStorage');
    return null;
  }
  try {
    return JSON.parse(user) as User;
  } catch (error) {
    console.error('Error parsing user data from localStorage', error);
    return null;
  }
}
