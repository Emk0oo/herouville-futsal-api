const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_API_SECRET_KEY);

const BASE_URL = process.env.BASE_URL;

router.post('/create-checkout-session', async (req, res) => {
  const { cartItems } = req.body;

  // Default fallback image URL
  const fallbackImageUrl = `${BASE_URL}/fallback.jpg`;

  // Log cartItems for debugging
  console.log('Cart Items:', cartItems);

  const lineItems = cartItems.map((item) => ({
    price_data: {
      currency: 'eur',
      product_data: {
        name: item.title,
        description: item.description,
        images: [`${BASE_URL}${item.imageURL}` || fallbackImageUrl], // Convert relative URL to absolute URL
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${BASE_URL}/success`,
      cancel_url: `${BASE_URL}/cancel`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

module.exports = router;
