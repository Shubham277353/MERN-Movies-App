import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false
    },
    watchedMovies: [{
      movieId: {
        type: String,
        required: true
      },
      title: String,          // Added for easier display
      poster_path: String,    // Added for movie poster
      addedAt: {
        type: Date,
        default: Date.now
      },
      userRating: {           // Optional: for personal ratings
        type: Number,
        min: 1,
        max: 5,
        default: null
      },
      review: {               // Optional: personal notes
        type: String,
        maxlength: 500
      }
    }]
  },
  { 
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function(doc, ret) {
        delete ret.password;  // Never send password in responses
        return ret;
      }
    }
  }
);

// Index for faster watched movies queries
userSchema.index({ 'watchedMovies.movieId': 1 });
userSchema.index({ 'watchedMovies.addedAt': -1 });

// Virtual for watched movies count
userSchema.virtual('watchedCount').get(function() {
  return this.watchedMovies.length;
});

const User = mongoose.model("User", userSchema);
export default User;