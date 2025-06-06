const deleteUser = async (id) => {
  try {
    
    const url = `/api/v1/users/${id}`;

    const res = await axios({
      method: 'DELETE',
      url,
    });

    if (res.status === 204) {
      showAlert('success', `Delete user successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};