import React from 'react';
import PropTypes from 'prop-types';
import RegisterForm from '../RegisterForm';
import { useDispatch } from 'react-redux';
import { signUp } from 'features/Auth/userSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { useSnackbar } from 'notistack';

Register.propTypes = {
  closeDialog: PropTypes.func,
};

function Register(props) {
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (values) => {
    try {
      const resultAction = await dispatch(signUp(values));
      const user = unwrapResult(resultAction);

      const { closeDialog } = props;
      if (closeDialog) {
        closeDialog();
      }

      console.log('New user: ', user);
      enqueueSnackbar('Sign up successfully', { variant: 'success' });
    } catch (error) {
      console.log('Sign up failed', error);
      enqueueSnackbar(error.message, { variant: 'error' });
    }
  };

  return (
    <div>
      <RegisterForm onSubmit={handleSubmit} />
    </div>
  );
}

export default Register;
