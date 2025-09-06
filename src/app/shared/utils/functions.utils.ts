import { TokenUserData } from '../interfaces/userData.interface';

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
export function getUserFromLocalStorage(): TokenUserData | null {
  const user = localStorage.getItem('user');
  if (!user) {
    console.warn('No se encontraron los datos del usuario en localStorage');
    return null;
  }
  try {
    return JSON.parse(user) as TokenUserData;
  } catch (error) {
    console.error('Error parsing user data from localStorage', error);
    return null;
  }
}

/**
 * @param input - Nombre a convertir a titlecase
 * @returns string - Nombre convertido a titlecase y separado por espacios
 */
export function toTitleCaseAndSplit(input: string): string {
  if (!input) {
    return input;
  }

  const words = input.split(' ').filter((word) => word.trim() !== '');
  if (words.length === 0) {
    return input;
  }

  const titleCasedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );
  return titleCasedWords.slice(0, 2).join(' ');
}
