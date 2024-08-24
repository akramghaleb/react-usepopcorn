import { useEffect, useRef, useState } from "react";
import Loader from "../Helpers/Loader";
import ErrorMessage from "../Helpers/ErrorMessage";
import StarRating from "../Helpers/StarRating";

const KEY = '33fa474c'



export default function MovieDetails({
    selectedId,
    onCloseMovie,
    onAddWatched,
    watched }) {
    const [movie, setMovie] = useState({})
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("")
    const [userRating, setUserRating] = useState("")

    const countRef = useRef(0)

    useEffect(function () {
        if (userRating) {
            countRef.current = countRef.current + 1;
        }
    }, [userRating])

    const isWatched = watched.map(movie => movie.imdbID)
        .includes(selectedId)

    const watchedUserRating = watched.find(movie => movie.imdbID === selectedId)?.userRating


    const {
        Title: title,
        Year: year,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre
    } = movie

    // if (imdbRating > 8) [isTop, setIsTop] = useState(true)

    // if (imdbRating > 8) return <p>Greatest ever!</p>

    // const [isTop, setIsTop] = useState(imdbRating > 8)

    // useEffect(() => {
    //   setIsTop(imdbRating > 8)
    // }, [imdbRating])

    const isTop = imdbRating > 8;
    console.log(isTop)

    useEffect(() => {
        function callback(e) {
            if (e.code === "Escape") {
                onCloseMovie()
                // console.log("CLOSING")
            }
        }
        document.addEventListener('keydown', callback)

        return function () {
            document.removeEventListener('keydown', callback)
        }
    }, [onCloseMovie])

    useEffect(() => {
        async function getMovieDetails() {
            try {
                setIsLoading(true)
                setError("")
                const res = await fetch(
                    `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)

                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`)
                }

                const data = await res.json()
                if (data.Response === "True") {
                    setMovie(data)
                } else {
                    throw new Error(`Movie not found`)
                }
            } catch (e) {
                console.error(e.message)
                setError(e.message)
            } finally {
                setIsLoading(false)
            }

        }
        getMovieDetails()
    }, [selectedId]);

    useEffect(() => {
        if (!title) return;
        document.title = `Movie | ${title}`

        return function () {
            document.title = `UsePopcorn`
        }
    }, [title])

    // const [averageRating, setAverageRating] = useState(0)

    function handleAdd() {
        const newWatchMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(' ').at(0)),
            userRating,
            countRatingDecisions: countRef.current,
        }

        onAddWatched(newWatchMovie)
        onCloseMovie()

        // setAverageRating(Number(imdbRating))
        // setAverageRating((avgRating) => (avgRating + userRating) / 2)
    }

    return <div className="details">
        {isLoading && <Loader />}
        {error && <ErrorMessage message={error} />}
        {!error && !isLoading && (
            <>
                <header>
                    <button className="btn-back" onClick={onCloseMovie}>
                        &larr;
                    </button>
                    <img src={poster} alt={`Poster of ${movie} movie`} />
                    <div className="details-overview">
                        <h2>{title}</h2>
                        <p>
                            {released} &bull; {runtime}
                        </p>
                        <p>{genre}</p>
                        <p><span>⭐</span>
                            {imdbRating} IMDB Rating
                        </p>
                    </div>
                </header>

                {/* <p>{averageRating}</p> */}

                <section>
                    <div className="rating">
                        {!isWatched ?
                            (
                                <>
                                    <StarRating maxRating={10} size={24}
                                        onSetRating={setUserRating} />

                                    {userRating > 0 && <button className="btn-add" onClick={handleAdd} >
                                        + Add to list
                                    </button>}
                                </>
                            ) :
                            <p>You rated this movie {watchedUserRating} <span>⭐</span></p>
                        }
                    </div>

                    <p>
                        <em>{plot}</em>
                    </p>
                    <p>Starring {actors}</p>
                    <p>Director by {director}</p>
                </section>
            </>
        )
        }
    </div >
}