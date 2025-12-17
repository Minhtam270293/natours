import React from 'react';
import PropTypes from 'prop-types';
import PasswordField from 'components/FormControl/PasswordField';
import InputField from 'components/FormControl/InputField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { Typography, Button, useTheme, LinearProgress } from '@mui/material';

RegisterForm.propTypes = {
  onSubmit: PropTypes.func,
};

function RegisterForm(props) {
  const schema = Yup.object({
    name: Yup.string()
      .required('Please enter your name')
      .min(2, 'Name must have at least 2 characters'),
    email: Yup.string()
      .required('Please enter your email')
      .email('Please enter a valid email address'),
    password: Yup.string()
      .required('Please enter your password')
      .min(8, 'Password must have at least 8 characters'),
    passwordConfirm: Yup.string()
      .required('Please confirm your password')
      .oneOf([Yup.ref('password')], 'Password does not match'),
  });

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      passwordConfirm: '',
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
        Sign up
      </Typography>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <InputField name="name" label="Name" form={form} />
        <InputField name="email" label="Email" form={form} />
        <PasswordField name="password" label="Password" form={form} />
        <PasswordField
          name="passwordConfirm"
          label="Password confirm"
          form={form}
        />
        <Button
          disabled={isSubmitting}
          type="submit"
          variant="contained"
          color="primary"
          sx={submitSx}
          fullWidth
        >
          Sign up
        </Button>
      </form>
    </div>
  );
}

export default RegisterForm;
