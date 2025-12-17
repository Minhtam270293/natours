import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './style.scss';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import Register from '../../features/Auth/components/Register';
import Login from 'features/Auth/components/Login';
import { useSelector } from 'react-redux';

function Header(props) {
  const loggedInUser = useSelector((state) => state.user.current);
  const isLoggedIn = !!loggedInUser._id;
  let quantity;
  const [openRegister, setOpenRegister] = useState(false);
  const [openLogin, setOpenLogin] = useState(false);

  const handleRegisterOpen = () => {
    setOpenRegister(true);
  };

  const handleRegisterClose = () => {
    setOpenRegister(false);
  };

  const handleLoginOpen = () => {
    setOpenLogin(true);
  };

  const handleLoginClose = () => {
    setOpenLogin(false);
  };

  return (
    <header className="header">
      <nav className="nav nav--tours">
        <Link className="nav__el" to="/">
          Home
        </Link>
      </nav>
      <div className="header__logo">
        <img src="/img/NodeJS-favicon.png" alt="Natours logo" />
      </div>
      <nav className="nav nav--user">
        {isLoggedIn ? (
          <>
            <Button className="nav__el nav__el--cta" to="#">
              Log out
            </Button>
            <Link className="nav__el" to="/me">
              <img
                className="nav__user-img"
                src={`/img/users/${loggedInUser.photo}`}
                alt={`Photo of ${loggedInUser.name}`}
              />
              <span>{loggedInUser.name.split(' ')[0]}</span>
            </Link>
          </>
        ) : (
          <>
            <Button className="nav__el nav__el--cta" onClick={handleLoginOpen}>
              Log in
            </Button>

            <Button
              className="nav__el nav__el--cta"
              onClick={handleRegisterOpen}
            >
              Sign up
            </Button>
          </>
        )}
        <a className="nav__el nav__cart" href="/cart">
          <img className="icon--cart" src="/img/cart.svg" alt="Cart" />
          <span id="cart-quantity">({quantity || 0})</span>
        </a>
      </nav>

      <Dialog
        open={openRegister}
        onClose={(event, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
          }
          handleRegisterClose();
        }}
      >
        <DialogContent>
          <Register closeDialog={handleRegisterClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRegisterClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openLogin}
        onClose={(event, reason) => {
          if (reason === 'backdropClick' || reason === 'escapeKeyDown') {
            return;
          }
          handleLoginClose();
        }}
      >
        <DialogContent>
          <Login closeDialog={handleLoginClose} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleLoginClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </header>
  );
}

Header.propTypes = {
  user: PropTypes.object,
  quantity: PropTypes.number,
};

Header.defaultProps = {
  user: null,
  quantity: 0,
};

export default Header;
