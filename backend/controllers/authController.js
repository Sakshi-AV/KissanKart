const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Storage = require('../services/storage');

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'kissan_kart_super_secret_jwt_key_2026_harvest',
    { expiresIn: '7d' }
  );
};

// @desc    Register a new user (Customer or Farmer)
// @route   POST /api/auth/register
const register = async (req, res) => {
  try {
    const { name, email, password, phone, role, farmName, location, farmingType, experience, description, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.'
      });
    }

    const existingUser = await Storage.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const targetRole = ['customer', 'farmer'].includes(role) ? role : 'customer';

    const user = await Storage.createUser({
      name,
      email: email.toLowerCase(),
      passwordHash,
      phone: phone || '',
      role: targetRole,
      address: address || { street: '', city: location || '', state: '', pincode: '' }
    });

    let farmer = null;
    if (targetRole === 'farmer') {
      farmer = await Storage.createFarmer({
        userId: user._id,
        farmName: farmName || `${name}'s Farm`,
        location: location || 'Karnataka, India',
        description: description || 'Fresh farm-to-table organic produce grown with care.',
        farmingType: farmingType || 'Natural Organic',
        experience: experience || '3+ Years',
        verificationStatus: 'verified' // Auto-verified for smooth demo experience, admin can modify
      });
    }

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        address: user.address,
        farmer: farmer || null
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Registration failed. Please check your details and try again.'
    });
  }
};

// @desc    Log in user
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.'
      });
    }

    const userWithPass = await Storage.findUserWithPassword ? 
      await Storage.findUserWithPassword(email) : 
      await Storage.findUserByEmail(email);

    const user = await Storage.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.passwordHash || userWithPass?.passwordHash || '');
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const token = generateToken(user._id, user.role);
    let farmer = null;
    if (user.role === 'farmer') {
      farmer = await Storage.findFarmerByUserId(user._id);
    }

    res.status(200).json({
      success: true,
      message: 'Logged in successfully!',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        address: user.address,
        farmer: farmer || null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Authentication failed. Please try again.'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
const getMe = async (req, res) => {
  try {
    const user = await Storage.findUserById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    let farmer = null;
    if (user.role === 'farmer') {
      farmer = await Storage.findFarmerByUserId(user._id);
    }

    res.status(200).json({
      success: true,
      user: {
        ...user,
        farmer
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error retrieving profile' });
  }
};

// @desc    Update user profile & delivery address
// @route   PUT /api/auth/profile
const updateProfile = async (req, res) => {
  try {
    const { name, phone, profileImage, address } = req.body;
    const updated = await Storage.updateUser(req.user._id, {
      ...(name && { name }),
      ...(phone !== undefined && { phone }),
      ...(profileImage && { profileImage }),
      ...(address && { address })
    });

    let farmer = null;
    if (updated.role === 'farmer') {
      farmer = await Storage.findFarmerByUserId(updated._id);
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      user: {
        ...updated,
        farmer
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update profile' });
  }
};

// @desc    Demo Quick Login (Customer, Farmer, Admin)
// @route   POST /api/auth/demo-login
const demoLogin = async (req, res) => {
  try {
    const { role } = req.body;
    const targetRole = role || 'customer';

    const users = await Storage.listUsers(targetRole);
    if (!users || users.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No demo account found for role: ${targetRole}. Please run database seeder.`
      });
    }

    const demoUser = users[0];
    const token = generateToken(demoUser._id, demoUser.role);
    let farmer = null;
    if (demoUser.role === 'farmer') {
      farmer = await Storage.findFarmerByUserId(demoUser._id);
    }

    res.status(200).json({
      success: true,
      message: `Signed in as Demo ${targetRole.toUpperCase()}`,
      token,
      user: {
        _id: demoUser._id,
        name: demoUser.name,
        email: demoUser.email,
        phone: demoUser.phone,
        role: demoUser.role,
        profileImage: demoUser.profileImage,
        address: demoUser.address,
        farmer
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Demo login failed' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  demoLogin
};
