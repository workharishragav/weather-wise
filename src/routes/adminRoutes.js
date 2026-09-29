const express = require('express');
const {
  listUsers,
  getUser,
  deleteUser,
  suspendUser
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

// Every admin route requires a valid JWT AND the admin role.
router.use(protect, adminOnly);

router.get('/users', listUsers);
router.get('/users/:id', getUser);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/suspend', suspendUser);

module.exports = router;
