/* eslint-disable */

// import '@babel/polyfill';
// import { displayMap } from './mapbox';
// import { login, logout } from './login';
// import { updateSettings } from './updateSettings';

// DOM ELEMENTS
// const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form--login');
const logOutBtn = document.querySelector('.nav__el--logout');
const signupForm = document.querySelector('.form--signup');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const addToCartButton = document.querySelector('.add-to-cart');
const checkoutForm = document.querySelector('.form--checkout')
const userEditForm = document.querySelector('.form-user-edit');
const promoEditForm = document.querySelector('.form-promo-edit')
const deleteUserBtns = document.querySelectorAll('.btn--delete-user');

// DELEGATION

// if (mapBox) {
//   const locations = JSON.parse(mapBox.dataset.locations);
//   displayMap(locations);
// }

 if (addToCartButton) {
    addToCartButton.addEventListener('click', function () {
      const tourId = this.dataset.id;
      addCart(tourId, 1);
      // console.log(tourId);
    });
  };

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });

if (logOutBtn) logOutBtn.addEventListener('click', logout);

if (signupForm)
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    signup(name, email, password, passwordConfirm);
  });

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);


    updateSettings(form, 'data');
  });

if (promoEditForm)
  promoEditForm.addEventListener('submit', e => {
    e.preventDefault();
    const data = {
      discountPercent: document.getElementById('discountPercent').value,
      title: document.getElementById('title').value,
      totalUses: document.getElementById('totalUses').value
    };
    const promoCode = document.getElementById('promoCodeToEdit').value;
    editPromo(data, promoCode);
  });

if (userEditForm)
  userEditForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('role', document.getElementById('role').value);
    form.append('photo', document.getElementById('photo').files[0]);
    const userToEditId = document.getElementById('userToEditId').value;
    editUser(form, userToEditId);
  });

if (deleteUserBtns) {
  deleteUserBtns.forEach(btn => {
    btn.addEventListener('click', async function (e) {
      const userId = this.dataset.userid;
      console.log(userId);
    if (confirm('Are you sure you want to delete this user?')) {
      await deleteUser(userId);
      this.closest('tr').remove();
      }
    });
  });
};

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (checkoutForm)
  checkoutForm.addEventListener('submit', function(e) {
    if (typeof isLoggedIn !== 'undefined' && !isLoggedIn) {
      e.preventDefault();
      alert('Please log in to proceed with payment');
      return;
    }
    handleCartSuccess(e);
  });