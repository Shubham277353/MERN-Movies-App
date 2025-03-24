import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "./asyncHandler.js";

// Check if the user is authenticated or not
const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  // Read JWT from the 'jwt' cookie
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized, token failed.");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const protect = asyncHandler(async (req, res, next) => {
  // 1. Get token from either cookie or header
  const token = req.cookies.jwt || 
               (req.headers.authorization?.startsWith('Bearer') 
                ? req.headers.authorization.split(' ')[1] 
                : null);

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Get user from token
    req.user = await User.findById(decoded.userId).select('-password');
    
    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }
    
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

// Check if the user is admin or not
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send("Not authorized as an admin");
  }
};

export { authenticate, authorizeAdmin, protect };
