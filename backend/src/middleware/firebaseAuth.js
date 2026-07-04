const { verifyIdToken } = require('../utils/firebaseTokenVerifier');

/**
 * Express middleware to authenticate requests using Firebase ID Tokens.
 * Expects header format: Authorization: Bearer <Firebase_ID_Token>
 */
const firebaseAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized. Missing or invalid Authorization header.',
    });
  }

  const token = authHeader.split(' ')[1];
  const projectId = process.env.FIREBASE_PROJECT_ID;

  if (!projectId) {
    console.error('[firebaseAuth] Error: FIREBASE_PROJECT_ID is not configured in backend env.');
    return res.status(500).json({
      success: false,
      message: 'Internal server configuration error.',
    });
  }

  try {
    const decodedToken = await verifyIdToken(token, projectId);
    
    // Attach user details to the request object
    req.uid = decodedToken.sub;
    req.user = decodedToken;

    next();
  } catch (error) {
    console.warn(`[firebaseAuth] Auth failed: ${error.message}`);
    return res.status(401).json({
      success: false,
      message: `Unauthorized. ${error.message}`,
    });
  }
};

module.exports = { firebaseAuth };
