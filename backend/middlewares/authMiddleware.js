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
  // 1. Get token from header, cookies, or body
  let token = req.headers.authorization?.split(' ')[1] || 
              req.cookies?.jwt || 
              req.body?.token;

  if (!token) {
    console.error("No token provided in request:", {
      headers: req.headers,
      cookies: req.cookies,
      body: req.body
    });
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided"
    });
  }

  try {
    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 3. Get user
    req.user = await User.findById(decoded.userId).select('-password');
    
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }
    
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Not authorized, token failed",
      error: error.message
    });
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
