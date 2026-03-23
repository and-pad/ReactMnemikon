import { useEffect } from "react";

/**
 * Custom hook: useSessionStorageState
 *
 * Este hook te permite inicializar varios estados de React
 * leyendo valores desde `sessionStorage`. 
 *
 * - Recibe un arreglo de tuplas: [key, setter, parser]
 *   - `key`: nombre de la clave en sessionStorage
 *   - `setter`: la función para actualizar el estado (ej: setPage, setFilterText)
 *   - `parser` (opcional): función que convierte el string almacenado
 *      en el tipo de dato que necesites (ej: Number, JSON.parse, etc.)
 *
 * Ejemplo de uso:
 * 
 * ```jsx
 * useSessionStorageState([
 *   ["QueryfilterText", setFilterText],
 *   ["QueryrowsPerPage", setRowsPerPage, Number],
 *   ["Querypage", setPage, Number],
 * ]);
 * ```
 *
 * En este ejemplo:
 * - Si en sessionStorage existe "QueryfilterText", se lo pasa a setFilterText.
 * - Si existe "QueryrowsPerPage", lo convierte a número y se lo pasa a setRowsPerPage.
 * - Si existe "Querypage", también lo convierte a número y se lo pasa a setPage.
 */
export function useSessionStorageState(settersMap) {
  useEffect(() => {
    for (const [key, setter, parser] of settersMap) {
      const stored = sessionStorage.getItem(key);        
      // Si hay un valor almacenado para esa key, lo aplicamos al estado
      if (stored !== null) {
        // Usamos el parser si existe, si no, dejamos el string tal cual
        setter(parser ? parser(stored) : stored);
      }
    }
  }, []); // Se ejecuta una sola vez al montar el componente
}
