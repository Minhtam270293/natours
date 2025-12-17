import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userAPI from 'api/userAPI';
import StorageKeys from 'constants/storage-key';

export const signUp = createAsyncThunk('user/signup', async (payload) => {
  // call API to signup
  const response = await userAPI.signUp(payload);
  const data = response.data;

  // store data to local storage
  localStorage.setItem(StorageKeys.TOKEN, data.token);
  localStorage.setItem(StorageKeys.USER, JSON.stringify(data.data.user));

  // return user data
  return data.data.user;
});

export const login = createAsyncThunk('user/login', async (payload) => {
  // call API to login
  const response = await userAPI.login(payload);
  const data = response.data;

  // store data to local storage
  localStorage.setItem(StorageKeys.TOKEN, data.token);
  localStorage.setItem(StorageKeys.USER, JSON.stringify(data.data.user));

  // return user data
  return data.data.user;
});

const userSlice = createSlice({
  name: 'user',

  initialState: {
    current: JSON.parse(localStorage.getItem(StorageKeys.USER)) || {},
    settings: {},
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signUp.fulfilled, (state, action) => {
      state.current = action.payload;
    });

    builder.addCase(login.fulfilled, (state, action) => {
      state.current = action.payload;
    });
  },
});

const { reducer } = userSlice;

export default reducer;
