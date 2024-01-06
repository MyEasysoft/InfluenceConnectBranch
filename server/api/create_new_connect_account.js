

module.exports = (req, res) => {

    const stripe = require('stripe')('sk_test_51NJBVGLV4ZuZ9s71EDnLoszscUw6i7b57s4UDvYmyRJsKyPAQ3VUxSBuLKGnZIOLKLTIYgJpYLaBH997gqK46FLD00FWx5iKXK');

    const account = stripe.accounts.create({
      type: 'custom',
      country: 'US',
      email: 'jenny.rosen@example.com',
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
    });

    console.log("Running ------------------------------------------------ ");

}

