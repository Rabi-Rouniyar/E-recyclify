import passport from 'passport';

// Protect routes - requires a valid JWT
export const protect = passport.authenticate('jwt', { session: false });

// Role authorization
export const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user is set by Passport's jwt strategy
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user ? req.user.role : 'Unknown'}) is not authorized to access this resource`,
      });
    }
    next();
  };
};
