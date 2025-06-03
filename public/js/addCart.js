const addCart = async function(id, orderSize) {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/carts/add/',
      data: { id, orderSize }
    });

    document.getElementById('cart-quantity').innerText = `(${res.data.quantity})`;
  } catch (err) {
    if (err.response && err.response.status === 400 && err.response.data.message === 'Tour already in cart') {
      alert('This tour is already in your cart.');
    } else {
      console.error('❌ Error adding to cart:', err);
      alert('Something went wrong when adding the tour to the cart.');
    }
  }
};