const jwt = require('jsonwebtoken');

// Verify JWT and attach user to req
const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer '))
    return res.status(401).json({ message: 'Not authenticated. Token missing.' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;   // { id, role, name }
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

// Role-based guard — usage: restrictTo('admin')
const restrictTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return res.status(403).json({ message: 'Access denied for your role.' });
  next();
};

module.exports = { protect, restrictTo };
