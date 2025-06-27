const editPromo = async (data, promoCode) => {
  try {
    
    const url = `/api/v1/promos/${promoCode}`;
    const res = await axios({
      method: 'PATCH',
      url,
      data
    });

    if (res.data.status === 'success') {
      showAlert('success', `Promo info edited successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};