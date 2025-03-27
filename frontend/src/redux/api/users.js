import { apiSlice } from "./apiSlice";
import { USERS_URL } from "../constants";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Auth endpoints
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: "POST",
      }),
    }),

    // Watched Movies endpoints
// In your users API slice
addToWatched: builder.mutation({
  query: (movieId) => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error("No token available");
    
    return {
      url: `${USERS_URL}/watched/${movieId}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    }
  },
  invalidatesTags: ['Watched']
}),
    removeFromWatched: builder.mutation({
      query: (movieId) => ({
        url: `${USERS_URL}/watched/${movieId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['WatchedMovies']
    }),
    getWatchedMovies: builder.query({
      query: () => `${USERS_URL}/watched`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ _id }) => ({ type: 'WatchedMovies', id: _id })),
              { type: 'WatchedMovies', id: 'LIST' }
            ]
          : [{ type: 'WatchedMovies', id: 'LIST' }]
    }),

    // Profile endpoints
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: "PUT",
        body: data,
      }),
    }),
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['User']
    }),
  }),
});

// Export all hooks
export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useProfileMutation,
  useGetUsersQuery,
  useAddToWatchedMutation,
  useRemoveFromWatchedMutation,
  useGetWatchedMoviesQuery
} = userApiSlice;