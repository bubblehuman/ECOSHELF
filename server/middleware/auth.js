// Need Provider Project Update v2.1
import jwt from 'jsonwebtoken';

/**
 * Express middleware that verifies a JWT from the Authorization header.
 * On success, attaches `req.user = { id, email }` to the request.
 * On failure, responds with 401.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = header.slice(7); // Remove "Bearer "
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email };
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

/**
 * Optional auth middleware — attaches user if token is present, but doesn't
 * reject the request if no token is provided. Useful for routes that behave
 * differently for authenticated vs. anonymous users.
 */
export function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    req.user = null;
    return next();
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, email: payload.email };
  } catch {
    req.user = null;
  }
  next();
}
