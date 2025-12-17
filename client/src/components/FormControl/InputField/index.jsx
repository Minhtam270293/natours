import React from 'react';
import PropTypes from 'prop-types';
import TextField from '@mui/material/TextField';
import { Controller } from 'react-hook-form';

InputField.propTypes = {
  form: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,

  label: PropTypes.string,
  disable: PropTypes.bool,
};

function InputField(props) {
  const { form, name, label, disable } = props;
  const { formState } = form;
  const { errors } = formState;
  const hasError = !!errors?.[name];

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <TextField
          {...field}
          margin="normal"
          variant="outlined"
          fullWidth
          label={label}
          disabled={disable}
          error={!!hasError}
          helperText={hasError ? errors[name]?.message : ''}
        />
      )}
    />
  );
}

export default InputField;
