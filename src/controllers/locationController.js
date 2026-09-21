const Location = require('../models/Location');

/**
 * POST /api/locations
 * Adds a favorite city for the authenticated user.
 */
const addLocation = async (req, res, next) => {
  try {
    const { city, country } = req.body;

    if (!city || !country) {
      res.status(400);
      throw new Error('Please provide city and country');
    }

    const location = await Location.create({ city, country, user: req.user._id });

    res.status(201).json({ success: true, data: location });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409);
      error.message = 'This city is already in your favorites';
    }
    next(error);
  }
};

/**
 * GET /api/locations
 * Returns all favorite locations belonging to the authenticated user.
 */
const getLocations = async (req, res, next) => {
  try {
    const locations = await Location.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: locations.length, data: locations });
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/locations/:id
 * Updates a favorite location owned by the authenticated user.
 */
const updateLocation = async (req, res, next) => {
  try {
    const { city, country } = req.body;

    const location = await Location.findOne({ _id: req.params.id, user: req.user._id });
    if (!location) {
      res.status(404);
      throw new Error('Favorite location not found');
    }

    if (city) location.city = city;
    if (country) location.country = country;
    await location.save();

    res.status(200).json({ success: true, data: location });
  } catch (error) {
    if (error.code === 11000) {
      res.status(409);
      error.message = 'This city is already in your favorites';
    }
    next(error);
  }
};

/**
 * DELETE /api/locations/:id
 * Removes a favorite location owned by the authenticated user.
 */
const deleteLocation = async (req, res, next) => {
  try {
    const location = await Location.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!location) {
      res.status(404);
      throw new Error('Favorite location not found');
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = { addLocation, getLocations, updateLocation, deleteLocation };
