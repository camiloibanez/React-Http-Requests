import React, { useState, useEffect, useCallback } from 'react';

import MoviesList from './components/MoviesList';
import AddMovie from './components/AddMovie';
import Button from './components/Button';
import './App.css';

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const swEndpoint = 'https://swapi.dev/api/films/';
  const fbEndpoint = 'https://react-http-24436-default-rtdb.firebaseio.com/movies.json';

  const fetchMoviesHandler = useCallback(async (endpoint, flag) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint);
      
      if(!response.ok) {
        throw new Error('Something went wrong');
      }

      const data = await response.json();

      if (flag === 'sw') {
        const transformedMovies = data.results.map(movieData => {
          return {
            id: movieData.episode_id,
            title: movieData.title,
            openingText: movieData.opening_crawl,
            releaseDate: movieData.release_date
          };
        });
        setMovies(transformedMovies);  
      } else if (flag === 'fb') {
        const loadedMovies = [];

        for (const key in data ) {
          loadedMovies.push({
            id: key,
            title: data[key].title,
            openingText: data[key].openingText,
            releaseDate: data[key].releaseDate
          })
        }
        setMovies(loadedMovies);
      }
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);  
  }, []);

  useEffect(() => {
    fetchMoviesHandler(swEndpoint, 'sw');
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    setError(null);
    try {
      const response = await fetch('https://react-http-24436-default-rtdb.firebaseio.com/movies.json', {
        method: 'POST',
        body: JSON.stringify(movie),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if(!response.ok) {
        throw new Error('Something went wrong');
      }

      const data = await response.json();
      console.log(data);
    } catch (error) {
      setError(error.message);
    }
  }

  let content = <p>Found no movies</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  } 
  if (error) {
    content = <p>{error}</p>;
  }
  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section className="actions">
        <Button onClick={fetchMoviesHandler} endpoint={swEndpoint} flag='sw'>Fetch Star Wars Movies</Button>
        <Button onClick={fetchMoviesHandler} endpoint={fbEndpoint} flag='fb'>Fetch Movies</Button>
      </section>
      <section>
        {content}
      </section>
    </React.Fragment>
  );
}

export default App;
