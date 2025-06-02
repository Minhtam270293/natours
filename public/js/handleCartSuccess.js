document.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/carts/complete'
    });

    if (res.data.status !== 'success') {
      alert('Booking failed: ' + res.data.message);
    } else {
        document.getElementById('cart-quantity').innerText = `(0)`;
    }
  } catch (err) {
    console.error('❌ Error completing booking:', err);
    alert('Something went wrong.');
  }
});
