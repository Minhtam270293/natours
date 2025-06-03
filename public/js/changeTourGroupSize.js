document.querySelectorAll('.group-size-form').forEach(form => {
  const id = form.dataset.id;
  const input = form.querySelector('input[name="groupSize"]');
  const decreaseBtn = form.querySelector('.decrease');
  const increaseBtn = form.querySelector('.increase');

  const updateGroupSize = async (newSize) => {
    try {
      const res = await axios.post('/api/v1/carts/update', {
        id,
        orderSize: newSize
      });

      const data = res.data;

      // Update input value
      input.value = newSize;

      // Update item price in the row
      const priceCell = form.parentElement.nextElementSibling;
      if (priceCell) {
        priceCell.textContent = `$${data.updatedItemTotal}`;
      }

      // Update summary
      const summary = document.querySelector('.data-summary');
      if (summary) {
        summary.innerHTML = `
          <p>Subtotal: $${data.subtotal}</p>
          <p>Coupon: $${data.discount}</p>
          <p class="data-total">Grand Total: $${data.total}</p>
        `;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Error updating group size';
      alert(msg);
      console.error(err);
    }
  };

  decreaseBtn.addEventListener('click', () => {
    let current = parseInt(input.value);
    if (current > 1) updateGroupSize(current - 1);
  });

  increaseBtn.addEventListener('click', () => {
    let current = parseInt(input.value);
    updateGroupSize(current + 1);
  });
});
