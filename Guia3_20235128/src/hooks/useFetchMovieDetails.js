import { useEffect, useState } from "react";
import { API_KEY} from "./useFetchMovies.js"; //importa la clave API desde el otro hook

/**
 * Hook personalizado para obterner los detalles de una pelicula desde la API de OMDB.
 * @param {string} selectedId - ID unico de la pelicula seleccionada
 * @returns {Object} - retorna objeto con:
 * - movie: detlles de la pelicula
 * - isLoading: retorna el estado de carga de la solicitud
 * - error: mensaje en caso de fallo
 */

export function useFetchMovieDetails(selectedId) {
    // estado para almacenar los detalles de la pelicula
    const [movie, setMovie] = useState({});

    // estado par indicar si esta cargando
    const [isLoading, setIsLoading] = useState(false);

    // estado de error
    const [error, setError] = useState("");

    useEffect(() => {
        // si no hay un ID seleccionado, limpiar el estado
        if (!selectedId) {
            setMovie({})
            setError("")
            return;
        }

        /**
         * Funcion asincronica que obtiene los detalles de una pelicula
         * @param {string} selectedId
         */
        async function fetchMovieDetails(selectedId) {
            try {
                setIsLoading(true); //activa el estado de carga
                setError(null); // reinicia errores previos

                //peticion de la API de OMDb con la clave de acceso y el Id de la pelicula
                const response = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${selectedId}`);

                //verifica si la respuesta http es correcta
                if (!response.ok) throw new Error("Error al cargar detalles de la pelicula")

                const data = await response.json();

                //guardar los detalles de la pelicula en el estado
                setMovie(data);
            } catch (err) {
                //manejo de errores: guardar el mensaje y limpiar el estado
                setError(err.message);
                setMovie({});
            } finally {
                setIsLoading(false); //finaliza el estado de carga
            }
        }

        //lamar la funcion
        fetchMovieDetails(selectedId);
    }, [selectedId]);
    return {movie, isLoading, error};
}