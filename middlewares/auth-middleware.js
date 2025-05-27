import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);

// MIDDLEWARES

// @ desc   Check if user is logged in

const protect = async (req, res, next) => {
  // 1- Check if token exist

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not Authorized: Token is missing" });
  }

  // 2- Verify token (Change in token - Expired token)

  const decodedToken = verifyToken(token);

  // 3- Check if User exists

  const user = await doctorModel.findById(decodedToken.userId);

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "User for this token not found" });
  }

  // Add user to request object
  req.user = user;

  next();
};

// @desc Authorization (User Permissions)

const allowedTo =
  (...roles) =>
  async (req, res, next) => {
    // 1- Access roles
    // 2- Access registered user (req.user.role)
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ success: false, message: "Not allowed to access this route" });
    }

    next();
  };

export { protect, allowedTo };
