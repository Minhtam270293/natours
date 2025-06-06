const editUser = async (data, id) => {
  try {
    
    const url = `/api/v1/users/${id}`;

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `Information edited successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};