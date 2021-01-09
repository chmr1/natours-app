/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
const Stripe = require('stripe');

const stripe = Stripe(
  'pk_test_51I5bDJGoLbaErS5OiP2NuyDCcf2GKJn8grvPbczt6dE0CTtT6tUrguh3Hf99x0ICFJ5ITodfcJkWIyai63ekONiR00zcBM6dkN'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const session = await axios({
      method: 'GET',
      url: `/api/v1/bookings/checkout-session/${tourId}`,
    });

    // 2) Create checkout form + change credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    showAlert('error', err);
  }
};
