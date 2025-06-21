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
    // Prevent exceeding remaining slots
    const max = parseInt(form.dataset.maxgroupsize) || Infinity;
    const remaining = parseInt(form.dataset.remainingslots) || Infinity;
    // The maximum group size user can select is current + remaining slots
    if (current < max && current - 1 + remaining > 0) {
      // Only allow increase if not exceeding remaining slots
      if (current < remaining) {
        updateGroupSize(current + 1);
      } else {
        alert('No more slots available for this tour.');
      }
    } else {
      alert('Cannot exceed the maximum group size or available slots.');
    }
  });
});

// --- Promo checkbox logic ---
const promoCheckbox = document.getElementById('promo-checkbox');
if (promoCheckbox) {
  promoCheckbox.addEventListener('change', async function () {
    try {
      let res;
      if (promoCheckbox.checked) {
        res = await axios.post('/cart/apply-promo', { promoCode: 'SUMMER50' });
      } else {
        res = await axios.post('/cart/remove-promo', { promoCode: 'SUMMER50' });
      }
      const data = res.data;
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
      alert(err.response?.data?.message || 'Error updating promo');
      promoCheckbox.checked = !promoCheckbox.checked; // revert if error
    }
  });
}
