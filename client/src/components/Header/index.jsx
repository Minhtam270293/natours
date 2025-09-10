import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './style.scss';

function Header(props) {
  const { user, quantity } = props;

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
        {user ? (
          <>
            <Link className="nav__el nav__el--logout" to="#">
              Log out
            </Link>
            <Link className="nav__el" to="/me">
              <img
                className="nav__user-img"
                src={`/img/users/${user.photo}`}
                alt={`Photo of ${user.name}`}
              />
              <span>{user.name.split(' ')[0]}</span>
            </Link>
          </>
        ) : (
          <>
            <a className="nav__el" href="/login">
              Log in
            </a>
            <a className="nav__el nav__el--cta" href="/signup">
              Sign up
            </a>
          </>
        )}
        <a className="nav__el nav__cart" href="/cart">
          <img className="icon--cart" src="/img/cart.svg" alt="Cart" />
          <span id="cart-quantity">({quantity || 0})</span>
        </a>
      </nav>
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
