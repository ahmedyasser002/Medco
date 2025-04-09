import jwt from 'jsonwebtoken'

// admin authentication middleware
const authUser = (req, res, next) => {
    try {
        const { token } = req.headers;

        if (!token) {
            return res.status(403).json({ success: false, message: "Not Authorized: Token is missing" });
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = tokenDecode.id;
        next();

    } catch (error) {
        // Token is invalid or expired
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(403).json({ success: false, message: "Invalid or expired token" });
        }

        // Other server errors
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

export default authUser;
