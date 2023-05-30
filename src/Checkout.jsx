import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState, useEffect } from "react";
import { gloabalAxiosWithInterceptor as axios } from "./axios";
import CheckoutForm from "./CheckoutForm";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe(
  "pk_test_51KJEN6SB6ePdcq7ghRrFN9XbagFQpCcIXkexQfD4VUbivOxRWkT1PnnTwvxACAMWCjk8nMlZLFioV55YayGthvG500cgUTyyEv"
);

const Checkout = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [secret, setSecret] = useState(null);
  const options = {
    clientSecret: secret,
  };

  useEffect(() => {
    const fetchSecret = async () => {
      const config = {
        url: "http://localhost:3001/payment",
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
      };
      const response = await axios.request(config);
      const secretFromServer = response.data.clientSecret;
      setSecret(secretFromServer);
      setIsLoading(false);
    };
    fetchSecret();
  }, []);

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};

export default Checkout;
