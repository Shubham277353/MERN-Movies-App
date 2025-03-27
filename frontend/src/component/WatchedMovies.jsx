import { useGetWatchedMoviesQuery, useRemoveFromWatchedMutation } from '../../src/redux/api/users';
import MovieCard from '../Movies/MovieCard';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import EmptyState from '../Common/EmptyState';

const WatchedMovies = () => {
  const { 
    data: watchedMovies, 
    isLoading, 
    isError,
    refetch 
  } = useGetWatchedMoviesQuery();
  
  const [removeFromWatched, { isLoading: isRemoving }] = useRemoveFromWatchedMutation();

  const handleRemove = async (movieId) => {
    try {
      await removeFromWatched(movieId).unwrap();
      toast.success('Movie removed from watched list');
      refetch();
    } catch (error) {
      toast.error('Failed to remove movie');
      console.error('Remove error:', error);
    }
  };

  if (isLoading) return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Your Watched Movies</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton height={300} />
            <Skeleton width={100} />
          </div>
        ))}
      </div>
    </div>
  );

  if (isError) return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Your Watched Movies</h1>
      <div className="alert alert-error">
        Error loading watched movies. 
        <button onClick={refetch} className="ml-2 underline">
          Try again
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Your Watched Movies</h1>
      
      {watchedMovies?.length === 0 ? (
        <EmptyState 
          message="You haven't marked any movies as watched yet"
          actionText="Browse Movies"
          actionLink="/movies"
        />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {watchedMovies?.map((movie) => (
            <div key={movie._id} className="relative group">
              <MovieCard 
                movie={movie} 
                showRemoveButton={false}
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleRemove(movie._id)}
                  disabled={isRemoving}
                  className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                  title="Remove from watched"
                  aria-label={`Remove ${movie.title} from watched`}
                >
                  {isRemoving ? '...' : '×'}
                </button>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                Watched: {new Date(movie.watchedAt).toLocaleDateString()}
                {movie.userRating && (
                  <span className="ml-2 text-yellow-500">
                    ★ {movie.userRating}/10
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchedMovies;