/* eslint-disable */
import '@babel/polyfill';
import axios from 'axios';

import { displayMap } from './mapBox';
import { login, logout } from './login';
import { updateSettings } from './updateSettings';
import { showAlert } from './alert';

var stripe = Stripe(
  'pk_test_51I5bDJGoLbaErS5OiP2NuyDCcf2GKJn8grvPbczt6dE0CTtT6tUrguh3Hf99x0ICFJ5ITodfcJkWIyai63ekONiR00zcBM6dkN'
);

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-settings');
const bookBtn = document.getElementById('book-tour');

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logOutBtn) {
  logOutBtn.addEventListener('click', logout);
}

if (userDataForm) {
  userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'Data');
  });
}

if (userPasswordForm) {
  userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    document.querySelector('.btn-save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'Password'
    );

    document.querySelector('.btn-save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });
}

if (bookBtn) {
  bookBtn.addEventListener('click', async (e) => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    try {
      // 1) Get checkout session from API
      const session = await axios(
        `/api/v1/bookings/checkout-session/${tourId}`
      );

      // 2) Create checkout form + change credit card
      await stripe.redirectToCheckout({
        sessionId: session.data.session.id,
      });
    } catch (err) {
      showAlert('error', err);
    }
  });
}
