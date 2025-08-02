import axiosClient from './axiosClient';

const tourAPI = {
  getAll(params) {
    const url = '/api/v1/tours';
    axiosClient.get(url, { params });
  },

  get(id) {
    const url = `/api/v1/tours/${id}`;
    axiosClient.get(url);
  },

  add(data) {
    const url = `/api/v1/tours/${data.id}`;
    axiosClient.post(url, data);
  },

  update(data) {
    const url = `/api/v1/tours/${data.id}`;
    axiosClient.patch(url, data);
  },

  remove(id) {
    const url = `/api/v1/tours/${id}`;
    axiosClient.delete(url);
  },
};

export default tourAPI;
