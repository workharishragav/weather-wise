const User = require('../models/User');
const generateToken = require('../utils/generateToken');

/**
 * POST /api/auth/register
 * Creates a new user and returns a JWT.
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please provide name, email and password');
    }

    const existingUser = await User.findOne({ email: String(email).toLowerCase() });
    if (existingUser) {
      res.status(409);
      throw new Error('A user with this email already exists');
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id, user.role);

    // Flat shape (_id/name/email/role/token as direct siblings of `data`)
    // matches the reference document's literal Postman example for this
    // endpoint. `role` is an additive field beyond that example -- needed
    // for role-based route guarding described elsewhere in the reference.
    res.status(201).json({
      success: true,
      data: { _id: user._id, name: user.name, email: user.email, role: user.role, token }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/auth/login
 * Verifies credentials and returns a JWT.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide email and password');
    }

    const user = await User.findOne({ email: String(email).toLowerCase() }).select('+password');
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const token = generateToken(user._id, user.role);

    // Flat shape matches the reference document's literal Postman example
    // for this endpoint (same shape as register, see comment there).
    res.status(200).json({
      success: true,
      data: { _id: user._id, name: user.name, email: user.email, role: user.role, token }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
