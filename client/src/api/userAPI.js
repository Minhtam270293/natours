import axiosClient from './axiosClient';

const userAPI = {
  signUp(data) {
    const url = '/api/v1/users/signup';
    return axiosClient.post(url, data);
  },

  login(data) {
    const url = '/api/v1/users/login';
    return axiosClient.post(url, data);
  },
};

export default userAPI;
