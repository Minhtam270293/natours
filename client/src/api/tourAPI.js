import axiosClient from './axiosClient';

const tourAPI = {
  getAll(params) {
    const url = '/api/v1/tours';
    return axiosClient.get(url, { params });
  },

  get(id) {
    const url = `/api/v1/tours/${id}`;
    return axiosClient.get(url);
  },

  add(data) {
    const url = `/api/v1/tours/${data.id}`;
    return axiosClient.post(url, data);
  },

  update(data) {
    const url = `/api/v1/tours/${data.id}`;
    return axiosClient.patch(url, data);
  },

  remove(id) {
    const url = `/api/v1/tours/${id}`;
    return axiosClient.delete(url);
  },
};

export default tourAPI;
