
import crypto from 'node:crypto';

export function requireAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = process.env.ADMIN_TOKEN;

  if (!token) {
    return res.status(500).json({
      message: 'Admin authentication is not configured.'
    });
  }

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication required.'
    });
  }

  const suppliedToken = authHeader.slice(7);

  const expected = Buffer.from(token);
  const supplied = Buffer.from(suppliedToken);

  if (
    expected.length !== supplied.length ||
    !crypto.timingSafeEqual(expected, supplied)
  ) {
    return res.status(401).json({
      message: 'Invalid admin token.'
    });
  }

  next();
}
