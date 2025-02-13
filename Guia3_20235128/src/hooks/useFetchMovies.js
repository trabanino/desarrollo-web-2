import { useEffect, useState } from "react";

//clave api de omdb
export const API_KEY = "df3c7b57";

/**
 * Hook personalizado para obtener peliculas desde la API de OMDB.
 * @param {string} query - termino de busqueda ingresado por el usuario
 * @returns {Object} - retorna un objeto con:
 * - movies: lista de peliculas encontradas
 * - isLoading: estado de carga de la solicitud.
 * - error: mensaje de error en caso de fallo.
 */

export function useFetchMovies(query) {
    //estado para almacenar las peliculas obtenidas
    const [movies, setMovies] = useState([]);

    //estado para indicar si la solicitud esta en curso
    const [isLoading, setIsLoading] = useState(false)

    //estado para manejar errores
    const [error, setError] = useState("")

    useEffect(() => {
        //si la busqueda tiene al menos 3 caracteres, limpiar resultados y error
        if (query.length < 3) {
            setMovies([])
            setError("")
            return;
        }
        /**
         * Funcion asincronica que obtiene las peliculas de la API.
         */
        async function fetchMovies() {
            try {
                setIsLoading(true); //inicia el estado de carga
                setError(null) //reiniciar erroe

                //peticion a la api de omdb
                const response = await
                    fetch(`https://omdbapi.com/?apikey=${API_KEY}&s=${query}`);

                //verifica si la respuesta http es correcta
                if (!response.ok)
                    throw new Error("Error al cargar peliculas")

                const data = await response.json();

                //si la api responde con un error, lanzar una excepcion
                if (data.Response === "False")
                    throw new Error("No se encontraron resultados")

                //guardar las peliculas obtenidas desdes la api
                setMovies(data.Search);
            } catch (err) {
                //manejo de errores: guarda el mensaje de error y limpia la lista
                setError(err.message)
                setMovies([])
            } finally {
                setIsLoading(false) //finaliza el estado de carga
            }
        }

        //llama la funcion para obtener los datos
        fetchMovies()
    }, [query]); //se ejecuta cada vez q cambia la consulta (query)

    // retornar los valores necesarios para su uso en computadoras
    return {movies, isLoading, error}
}