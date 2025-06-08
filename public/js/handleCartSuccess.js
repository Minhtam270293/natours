const handleCartSuccess = async function(e) {
  e.preventDefault();

  const stripe = Stripe('pk_test_51RMpwICz2yvqbafcMv2DbF0LRiTWyQToTE32i16rSbSHtAczYzcR0hNSpS71fu8zXlHwQ97JDNZ4j8Qbuj3R1tQG000tRmKKhJ');

  const response = await axios.post('/api/v1/users/checkout');

  const sessionId = response.data.id;

  const result = await stripe.redirectToCheckout({ sessionId });
  if (result.error) {
    alert(result.error.message);
  }
}
