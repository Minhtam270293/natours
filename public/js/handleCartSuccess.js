const handleCartSuccess = async function(e) {
  e.preventDefault();

  // Replace with your Stripe public key
  const stripe = Stripe('pk_test_51RMpw8CeCCNSht8ZWKiifZeEGrxVYfYZy8fWNVHhVaUe7SWOv6bUP91gFPAm4bbpAeItvXbPW0yn62SGxTOVBT6H00j266mija');

  // Call your backend to create the session using Axios
  const response = await axios.post('/api/v1/users/checkout');

  // Axios automatically parses JSON, so use response.data
  const sessionId = response.data.id;

  // Redirect to Stripe Checkout
  const result = await stripe.redirectToCheckout({ sessionId });
  if (result.error) {
    alert(result.error.message);
  }
}
