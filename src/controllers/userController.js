const User = require('../models/User');

/**
 * GET /api/users/profile
 * Returns the authenticated user's own safe profile fields.
 * req.user was already loaded by the `protect` middleware via
 * User.findById(...), which never pulls in the password hash
 * (schema field is `select: false`).
 */
const getProfile = async (req, res, next) => {
  try {
    const { _id, name, email, role } = req.user;
    res.status(200).json({ success: true, data: { id: _id, name, email, role } });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/users/profile
 * Lets the authenticated user update their own name/email only.
 * `role` (and password, which has its own endpoint) can never be
 * changed here -- attempting to send either is rejected outright
 * rather than silently ignored, so a client finds out immediately
 * instead of assuming the change took effect.
 */
const updateProfile = async (req, res, next) => {
  try {
    if (Object.prototype.hasOwnProperty.call(req.body, 'role')) {
      res.status(400);
      throw new Error('Role cannot be changed through the profile endpoint');
    }
    if (Object.prototype.hasOwnProperty.call(req.body, 'password')) {
      res.status(400);
      throw new Error('Use PUT /api/users/password to change your password');
    }

    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.email !== undefined) updates.email = String(req.body.email).toLowerCase();

    if (Object.keys(updates).length === 0) {
      res.status(400);
      throw new Error('Provide at least one of: name, email');
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
      context: 'query'
    });

    res.status(200).json({
      success: true,
      data: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409);
      error.message = 'This email is already in use';
    }
    next(error);
  }
};

/**
 * PUT /api/users/password
 * Body: { currentPassword, newPassword }
 * Verifies the current password before allowing a change, and lets
 * the User model's pre('save') hook re-hash the new one with bcrypt.
 *
 * Note: this architecture uses stateless JWTs with no server-side
 * session/blacklist store, so an older token issued before the
 * password change remains valid until it naturally expires (7 days).
 * Adding token revocation would require new infrastructure (a token
 * version field checked in `protect`, or a denylist) that does not
 * exist elsewhere in this codebase, so it is called out here rather
 * than silently left unimplemented.
 */
const updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      res.status(400);
      throw new Error('Please provide currentPassword and newPassword');
    }
    if (String(newPassword).length < 6) {
      res.status(400);
      throw new Error('Password must be at least 6 characters');
    }

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(401);
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile, updatePassword };
