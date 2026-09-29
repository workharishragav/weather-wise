const mongoose = require('mongoose');
const User = require('../models/User');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * GET /api/admin/users
 * Lists every registered user. Password hashes are never included:
 * the User schema marks `password` as `select: false`, so a plain
 * find() already excludes it at the query level.
 */
const listUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users/:id
 * Returns a single user (safe fields only, same reasoning as above).
 */
const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400);
      throw new Error('Invalid user id');
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/admin/users/:id
 * Permanently removes a user account. An admin cannot delete their own
 * account through this endpoint, which would either strand the caller
 * mid-session or, if they were the only admin, leave the system with no
 * administrator at all.
 */
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400);
      throw new Error('Invalid user id');
    }

    if (req.user._id.toString() === id) {
      res.status(400);
      throw new Error('Admins cannot delete their own account through this endpoint');
    }

    const user = await User.findByIdAndDelete(id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/admin/users/:id/suspend
 * Toggles a user's suspended state. Body: { "suspended": true|false }
 * (defaults to true, i.e. calling this with no body suspends the account).
 * A suspended user is rejected at login and by the `protect` middleware
 * on every subsequent request, even with a still-valid JWT.
 *
 * Uses findByIdAndUpdate rather than load-then-save so the (unselected)
 * password field is never pulled into memory or re-validated.
 */
const suspendUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      res.status(400);
      throw new Error('Invalid user id');
    }

    if (req.user._id.toString() === id) {
      res.status(400);
      throw new Error('Admins cannot suspend their own account');
    }

    const suspended = typeof req.body.suspended === 'boolean' ? req.body.suspended : true;

    const user = await User.findByIdAndUpdate(
      id,
      { isSuspended: suspended },
      { new: true, runValidators: true }
    );

    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

module.exports = { listUsers, getUser, deleteUser, suspendUser };
