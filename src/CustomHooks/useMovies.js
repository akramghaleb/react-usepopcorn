import { useEffect, useState } from "react";

const KEY = '33fa474c'

export function useMovies(query/*, callback*/) {
    const [movies, setMovies] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("")

    useEffect(function () {
        // callback?.();
        const controller = new AbortController();
        async function fetchMovie() {
            try {
                setIsLoading(true)
                setError("")
                const res = await fetch(`http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
                    { signal: controller.signal }
                )

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`)
                }

                const data = await res.json()
                if (data.Response === "True") {
                    setMovies(data.Search)
                    setError("")
                } else {
                    throw new Error(`Movie not found`)
                }
            } catch (e) {

                if (error.name !== "AbortError") {
                    setError(e.message)
                    console.error(e.message)
                }
            } finally {
                setIsLoading(false)
            }
        }

        if (query.length < 3) {
            setMovies([])
            setError("")
            return
        }

        // handleCloseMovie()
        fetchMovie()

        return function () {
            controller.abort()
        }
    }, [query])

    return { movies, isLoading, error }
}