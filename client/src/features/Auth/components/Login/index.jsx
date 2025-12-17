import React from 'react';
import PropTypes from 'prop-types';
import LoginForm from '../LoginForm';
import { useDispatch } from 'react-redux';
import { login } from 'features/Auth/userSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSnackbar } from 'notistack';

Login.propTypes = {
  closeDialog: PropTypes.func,
};

function Login(props) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (values) => {
    try {
      const resultAction = await dispatch(login(values));
      const user = unwrapResult(resultAction);

      const { closeDialog } = props;
      if (closeDialog) {
        closeDialog();
      }

      console.log('Current user: ', user);
      enqueueSnackbar('Login successfully', { variant: 'success' });
    } catch (error) {
      console.log('Login failed', error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  return (
    <div>
      <LoginForm onSubmit={handleSubmit} />
    </div>
  );
}

export default Login;
