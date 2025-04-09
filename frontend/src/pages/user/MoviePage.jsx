import React, { useEffect, useState } from 'react'
import MovieCarousel from '../../components/Carousel'
import PaginatedMovieList from '../../components/PaginatedMovieList'
import { Spin } from 'antd'
import api from '../../utils/api'
// Example: src/data/movies.js
const moviesData = [
  {
    id: 'oppenheimer',
    img: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    title: 'Oppenheimer',
    categories: ['Drama', 'History'],
    rate: 8.4
  },
  {
    id: 'godzillaxkong',
    img: 'https://image.tmdb.org/t/p/w500/tMefBSflR6PGQLv7WvFPpKLZkyk.jpg',
    title: 'Godzilla x Kong: The New Empire',
    categories: ['Action', 'Science Fiction', 'Adventure'],
    rate: 6.4
  },
  {
    id: 'kungfupanda4',
    img: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
    title: 'Kung Fu Panda 4',
    categories: ['Animation', 'Action', 'Family', 'Comedy'],
    rate: 6.4
  },
  {
    id: 'spiderman_across',
    img: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    title: 'Spider-Man: Across the Spider-Verse',
    categories: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    rate: 8.6
  },
  {
    id: 'barbie',
    img: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
    title: 'Barbie',
    categories: ['Comedy', 'Adventure', 'Fantasy'],
    rate: 6.8
  },
  {
    id: 'wonka',
    img: 'https://image.tmdb.org/t/p/w500/vBZ0qvaRxqEhZwl6LWmruJqWE8Z.jpg',
    title: 'Wonka',
    categories: ['Comedy', 'Family', 'Fantasy'],
    rate: 7.0
  },
  {
    id: 'poor_things',
    img: 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
    title: 'Poor Things',
    categories: ['Science Fiction', 'Romance', 'Comedy', 'Drama'],
    rate: 8.3
  }
]


const moviesData2 = [
  {
    id: 'oppenheimer',
    img: 'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    title: 'Oppenheimer',
    categories: ['Drama', 'History'],
    rate: 8.4
  },
  {
    id: 'godzillaxkong',
    img: 'https://image.tmdb.org/t/p/w500/tMefBSflR6PGQLv7WvFPpKLZkyk.jpg',
    title: 'Godzilla x Kong: The New Empire',
    categories: ['Action', 'Science Fiction', 'Adventure'],
    rate: 6.4
  },
  {
    id: 'kungfupanda4',
    img: 'https://image.tmdb.org/t/p/w500/kDp1vUBnMpe8ak4rjgl3cLELqjU.jpg',
    title: 'Kung Fu Panda 4',
    categories: ['Animation', 'Action', 'Family', 'Comedy'],
    rate: 6.4
  },
  {
    id: 'spiderman_across',
    img: 'https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg',
    title: 'Spider-Man: Across the Spider-Verse',
    categories: ['Animation', 'Action', 'Adventure', 'Sci-Fi'],
    rate: 8.6
  },
  {
    id: 'barbie',
    img: 'https://image.tmdb.org/t/p/w500/iuFNMS8U5cb6xfzi51Dbkovj7vM.jpg',
    title: 'Barbie',
    categories: ['Comedy', 'Adventure', 'Fantasy'],
    rate: 6.8
  },
  {
    id: 'wonka',
    img: 'https://image.tmdb.org/t/p/w500/vBZ0qvaRxqEhZwl6LWmruJqWE8Z.jpg',
    title: 'Wonka',
    categories: ['Comedy', 'Family', 'Fantasy'],
    rate: 7.0
  },
  {
    id: 'poor_things',
    img: 'https://image.tmdb.org/t/p/w500/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg',
    title: 'Poor Things',
    categories: ['Science Fiction', 'Romance', 'Comedy', 'Drama'],
    rate: 8.3
  },
  {
    id: 'dune_part_two',
    img: 'https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg',
    title: 'Dune: Part Two',
    categories: ['Science Fiction', 'Adventure'],
    rate: 8.5
  },
  {
    id: 'the_beekeeper',
    img: 'https://image.tmdb.org/t/p/w500/A7EByudX0eOzlkQ2FIbogzyazm2.jpg',
    title: 'The Beekeeper',
    categories: ['Action', 'Thriller'],
    rate: 7.1
  },
  {
    id: 'the_marvels',
    img: 'https://image.tmdb.org/t/p/w500/9GBhzXMFjgcZ3FdR9w3bUMMTps5.jpg',
    title: 'The Marvels',
    categories: ['Action', 'Adventure', 'Science Fiction'],
    rate: 5.9
  },
  {
    id: 'aquaman_and_the_lost_kingdom',
    img: 'https://image.tmdb.org/t/p/w500/7lTnXOy0iNtBAdRP3TZvaKJ77F6.jpg',
    title: 'Aquaman and the Lost Kingdom',
    categories: ['Action', 'Adventure', 'Fantasy'],
    rate: 6.5
  },
  {
    id: 'the_holdovers',
    img: 'https://image.tmdb.org/t/p/w500/VHSzY4kdkGvGKsdNQ1dVlpeC3M.jpg',
    title: 'The Holdovers',
    categories: ['Comedy', 'Drama'],
    rate: 7.9
  },
  {
    id: 'the_iron_claw',
    img: 'https://image.tmdb.org/t/p/w500/nfs7DCYhgrEIgxKYbITHTzKsggf.jpg',
    title: 'The Iron Claw',
    categories: ['Drama'],
    rate: 7.5
  },
  {
    id: 'anyone_but_you',
    img: 'https://image.tmdb.org/t/p/w500/5qHoazZiaLe7oFBok7XlUhg96fZ.jpg',
    title: 'Anyone But You',
    categories: ['Comedy', 'Romance'],
    rate: 6.7
  },
  {
    id: 'migration',
    img: 'https://image.tmdb.org/t/p/w500/2KGxQFV9Wp1MshPBf8BuqWUgVAz.jpg',
    title: 'Migration',
    categories: ['Animation', 'Comedy', 'Family', 'Adventure'],
    rate: 7.1
  },
  {
    id: 'the_hunger_games_the_ballad_of_songbirds_and_snakes',
    img: 'https://image.tmdb.org/t/p/w500/mBaXZ95R2OxueZhvQbcEWy2DqyO.jpg',
    title: 'The Hunger Games: The Ballad of Songbirds & Snakes',
    categories: ['Science Fiction', 'Adventure', 'Drama'],
    rate: 7.2
  },
  {
    id: 'napoleon',
    img: 'https://image.tmdb.org/t/p/w500/jE5o7y9K6pZtWNNMEw3IdpHuncR.jpg',
    title: 'Napoleon',
    categories: ['Drama', 'History', 'War'],
    rate: 6.4
  },
  {
    id: 'five_nights_at_freddys',
    img: 'https://image.tmdb.org/t/p/w500/A4j8S6moJS2zNtRR8oWF08gRnL5.jpg',
    title: 'Five Nights at Freddy\'s',
    categories: ['Horror', 'Thriller'],
    rate: 6.8
  },
  {
    id: 'the_boy_and_the_heron',
    img: 'https://image.tmdb.org/t/p/w500/agmIkv1xDF1KER7FfXyHlPwKXhN.jpg',
    title: 'The Boy and the Heron',
    categories: ['Animation', 'Adventure', 'Fantasy'],
    rate: 7.5
  },
  {
    id: 'saltburn',
    img: 'https://image.tmdb.org/t/p/w500/qjhahNLSZ705B5JP92YMEYPocPz.jpg',
    title: 'Saltburn',
    categories: ['Comedy', 'Drama', 'Thriller'],
    rate: 7.1
  },
  {
    id: 'the_creator',
    img: 'https://image.tmdb.org/t/p/w500/vBZ0qvaRxqEhZwl6LWmruJqWE8Z.jpg',
    title: 'The Creator',
    categories: ['Science Fiction', 'Action', 'Thriller'],
    rate: 7.2
  },
  {
    id: 'killers_of_the_flower_moon',
    img: 'https://image.tmdb.org/t/p/w500/dB6Krk806zeqd0YNy2WqPfho2Pk.jpg',
    title: 'Killers of the Flower Moon',
    categories: ['Drama', 'History', 'Crime'],
    rate: 7.6
  },
  {
    id: 'past_lives',
    img: 'https://image.tmdb.org/t/p/w500/k3waqVXSnvCZWfJYNtdamTgTtTA.jpg',
    title: 'Past Lives',
    categories: ['Drama', 'Romance'],
    rate: 8.0
  },
  {
    id: 'john_wick_4',
    img: 'https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg',
    title: 'John Wick: Chapter 4',
    categories: ['Action', 'Thriller', 'Crime'],
    rate: 7.7
  },
  {
    id: 'the_super_mario_bros_movie',
    img: 'https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg',
    title: 'The Super Mario Bros. Movie',
    categories: ['Animation', 'Adventure', 'Family', 'Comedy'],
    rate: 7.7
  },
  {
    id: 'guardians_of_the_galaxy_vol_3',
    img: 'https://image.tmdb.org/t/p/w500/r2J02Z2OpNTctfOSN1Ydgii51I3.jpg',
    title: 'Guardians of the Galaxy Vol. 3',
    categories: ['Action', 'Adventure', 'Science Fiction', 'Comedy'],
    rate: 8.0
  },
  {
    id: 'elemental',
    img: 'https://image.tmdb.org/t/p/w500/6oH378KUfCEitzJkm07r97L0RsZ.jpg',
    title: 'Elemental',
    categories: ['Animation', 'Adventure', 'Comedy', 'Family', 'Fantasy', 'Romance'],
    rate: 7.4
  },
  {
    id: 'mission_impossible_dead_reckoning_part_one',
    img: 'https://image.tmdb.org/t/p/w500/NNxYkU70HPurnNCSiCjYAmacwm.jpg',
    title: 'Mission: Impossible - Dead Reckoning Part One',
    categories: ['Action', 'Adventure', 'Thriller'],
    rate: 7.6
  }
]
export default function MoviePage () {
    const [movieData, setMovieData] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
  
    useEffect(() => {
      const fetchMovies = async () => {
        setIsLoading(true); // Set loading to true before fetching
  
        try {
          const response = await api.get('/movies');
          setMovieData(response.data);
        } catch (error) {
          console.error('Error fetching movies:', error);
        } finally {
          setIsLoading(false); // Set loading to false after fetching, regardless of success/failure
        }
      };
  
      fetchMovies();
    }, []);
  
    const nowShowingMovies = movieData?.filter(movie => movie.status === 'NOW_SHOWING');
  
    if (isLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Spin size="large" /> {/* Display loading spinner */}
        </div>
      );
    }
  
  return (
    <div className='mb-10 '>
      {/* Now showing */}
      <div className='bg-black pt-20 pb-10 '>
        <h2 className='text-2xl text-white text-center font-bold mb-4'>
          Now Showing
        </h2>
        <div className='flex justify-center items-center w-full '>
          <MovieCarousel movies={nowShowingMovies}  theme="dark"/>
        </div>
      </div>

      {/* Movie list */}
      <div className=' w-full flex flex-col justify-center items-center mt-5'>
        <div className='max-w-[1100px] w-full '>
        

          <PaginatedMovieList moviesData={movieData} itemsPerPage={12}/>
        </div>
      </div>
    </div>
  )
}
