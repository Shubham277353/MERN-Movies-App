import { createSlice } from "@reduxjs/toolkit";

const moviesSlice = createSlice({
  name: "movies",
  initialState: {
    moviesFilter: {
      searchTerm: "",
      selectedGenre: "",
      selectedYear: "",
      selectedSort: "",  // ✅ Changed from [] to ""
    },
    filteredMovies: [],
    movieYears: [],
    uniqueYear: [],
  },

  reducers: {
    setMoviesFilter: (state, action) => {
      Object.assign(state.moviesFilter, action.payload);  // ✅ Improved merging
    },

    setFilteredMovies: (state, action) => {
      state.filteredMovies = action.payload;
    },

    setMovieYears: (state, action) => {
      state.movieYears = action.payload;
    },

    setUniqueYears: (state, action) => {
      state.uniqueYear = action.payload;
    },
  },
});

export const {
  setMoviesFilter,
  setFilteredMovies,
  setMovieYears,
  setUniqueYears,
} = moviesSlice.actions;

export default moviesSlice.reducer;
