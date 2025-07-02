const createPromo = async (data) => {
  try {
    const url = '/api/v1/promos';
    const res = await axios({
      method: 'POST',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Promo created successfully!');
      setTimeout(() => {
        window.location.assign('/promos');
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};