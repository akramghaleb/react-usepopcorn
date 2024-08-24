import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Logo from "./NavBar/Logo";
import Search from "./NavBar/Search";
import NumResults from "./NavBar/NumResults";
import Box from "./Helpers/Box";
import MovieList from "./Main/MovieList";
import Loader from "./Helpers/Loader";
import ErrorMessage from "./Helpers/ErrorMessage";
import MovieDetails from "./Main/MovieDetails";
import WatchedSummary from "./Main/WatchedSummary";
import WatchedList from "./Main/WatchedList";
import Main from "./Main";
import { useMovies } from "./CustomHooks/useMovies";
import useLocalStorageState from "./CustomHooks/useLocalStorageState";



// ----------------------------------------------------------
export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null)
  const { movies, isLoading, error } = useMovies(query)

  const [watched, setWatched] = useLocalStorageState([], 'watched')

  // const [watched, setWatched] = useState([]);
  // const [watched, setWatched] = useState(() => {
  //   const storedValue = localStorage.getItem('watched');
  //   return storedValue ? JSON.parse(storedValue) : [];
  // });

  function handleSelectMovie(id) {
    setSelectedId(selectedId => id === selectedId ? null : id);
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  function handleAddWatched(movie) {
    setWatched(prevWatched => [...prevWatched, movie])

    // localStorage.setItem('watched',
    //   JSON.stringify([...watched, movie]))
  }

  function handleDeleteWatched(id) {
    setWatched(prevWatched =>
      prevWatched.filter(movie => movie.imdbID !== id))
  }

  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {!isLoading && !error &&
            <MovieList movies={movies}
              onSelectMovie={handleSelectMovie} />}
          {isLoading && <Loader />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {
            selectedId ?
              <MovieDetails selectedId={selectedId}
                onCloseMovie={handleCloseMovie}
                onAddWatched={handleAddWatched}
                watched={watched} /> :
              <>
                <WatchedSummary watched={watched} />
                <WatchedList watched={watched}
                  onDeleteWatched={handleDeleteWatched} />
              </>}
        </Box>
      </Main>
    </>
  );
}