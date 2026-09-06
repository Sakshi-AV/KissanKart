const Storage = require('../services/storage');

// @desc    Add review for a product
// @route   POST /api/reviews
const createReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;

    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: 'Please provide productId, rating (1-5), and a review comment.'
      });
    }

    const product = await Storage.findProductById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const review = await Storage.createReview({
      productId,
      customerId: req.user._id,
      customerName: req.user.name,
      rating: Number(rating),
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Thank you! Your review has been published.',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to submit review.' });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:id
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Storage.getReviewsByProduct(req.params.id);
    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch reviews.' });
  }
};

module.exports = {
  createReview,
  getProductReviews
};
