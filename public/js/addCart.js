const addCart = async function(id, quantity) {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/carts/add/',
      data: { id, quantity }
    });

    document.getElementById('cart-quantity').innerText = `(${res.data.quantity})`;
  } catch (err) {
    console.error('❌ Error adding to cart:', err);
    alert('Something went wrong when adding the tour to the cart.');
  }
};