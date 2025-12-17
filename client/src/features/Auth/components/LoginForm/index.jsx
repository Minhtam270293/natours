import React from 'react';
import PropTypes from 'prop-types';
import PasswordField from 'components/FormControl/PasswordField';
import InputField from 'components/FormControl/InputField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Typography, Button, useTheme, LinearProgress } from '@mui/material';

LoginForm.propTypes = {
  onSubmit: PropTypes.func,
};

function LoginForm(props) {
  const schema = Yup.object({
    email: Yup.string()
      .required('Please enter your email')
      .email('Please enter a valid email address'),
    password: Yup.string()
      .required('Please enter your password')
      .min(8, 'Password must have at least 8 characters'),
  });

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: yupResolver(schema),
  });

  const handleSubmit = async (values) => {
    const { onSubmit } = props;

    if (onSubmit) {
      await onSubmit(values);
    }
  };

  const theme = useTheme();

  const rootSx = {
    paddingTop: theme.spacing(4),
  };
  const titleSx = {
    margin: theme.spacing(2, 0, 3, 0),
    textAlign: 'center',
  };
  const submitSx = {
    margin: theme.spacing(3, 0, 2, 0),
  };

  const { isSubmitting } = form.formState;

  return (
    <div sx={rootSx}>
      {isSubmitting && <LinearProgress />}

      <Typography sx={titleSx} component="h1" variant="h4">
        Login
      </Typography>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <InputField name="email" label="Email" form={form} />
        <PasswordField name="password" label="Password" form={form} />
        <Button
          disabled={isSubmitting}
          type="submit"
          variant="contained"
          color="primary"
          sx={submitSx}
          fullWidth
        >
          Login
        </Button>
      </form>
    </div>
  );
}

export default LoginForm;
