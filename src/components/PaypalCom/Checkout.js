import React from 'react';
import { useEffect, useState } from 'react';
import { client_id } from '../../config/configPaypal';
import { useHistory } from "react-router-dom"

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import css from './Checkout.module.css';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { callPayPalOnboardingApi } from './Checkout.duck';
import routeConfiguration from '../../routing/routeConfiguration';
import { pathByRouteName } from '../../util/routes';
const sharetribeSdk = require('sharetribe-flex-sdk');


  

const CheckoutCom = (props) => {
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState("");
    const [orderID, setOrderID] = useState(false);
    
    const {
        currentUserId,
        onContactUserPayPal,
        showPayPalButton,
        price,
        lineItems,
        marketplaceName,
        listingId,
        marketplaceCurrency,
        listingTitle,
        authorId,
        onHandleOnboarding,
        onRedirectToOrderPage,

    } = props;
    const {amount} = price;

    

    const handleSubmit = (e) =>{
        e.preventDefault();
        
        setShow(!show);
    };

    const dataReady = currentUserId !== undefined && authorId !== undefined && listingId !== undefined;

    // creates a paypal order
    const createOrder = (data, actions) => {
        return actions.order.create(
           
            {
                intent: "CAPTURE",
            purchase_units: [
                {
                    reference_id: currentUserId+" "+authorId+" "+listingId, 
                    description: listingTitle,
                    amount: {
                        currency_code: marketplaceCurrency,
                        value: amount.toFixed(2)/100,
                    },
                },
            ],
        }
        ).then((orderID) => {
                setOrderID(orderID);
                console.log(JSON.stringify(orderID)+"    zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");

                //Initiate tramsaction
                return orderID;
            });
    };


    // check Approval
    const onApprove = (data, actions) => {
        return actions.order.capture().then(function (details) {
            const { payer } = details;

           
            setSuccess(true);
           

            // const initialMessageFailedToTransaction = details ? null : orderID;
            // const orderDetailsPath = pathByRouteName('LandingPage', routeConfiguration, {
            //   id: orderId.uuid,
            // });

           

            //history.push(orderDetailsPath);
            //history.push("/s?pub_role=Influencers");
            
           //const re = redirectToSuccess();
            console.log(JSON.stringify(payer)+"    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
            onRedirectToOrderPage();
           
        });
    };

    //capture likely error
    const onError = (data, actions) => {
        setErrorMessage("An Error occured with your payment ");
    };

    useEffect(() => {
        if (success) {
            alert("Payment successful!!");
           
        }
    },[success]);

    return (
        <PayPalScriptProvider options={{ "client-id": client_id }}>
           
                <div className="container">
                   
                    <div>
                        <div >
                            <p className={css.instruction}>Please click the button below to setup your Paypal account or make a payment</p>
                        </div>
                        <div>
                           
                            <button className={css.submitBtn} type="submit" onClick={onContactUserPayPal}>
                                Setup and Order Now
                            </button>
                        </div>
                    </div>


                    <br></br>
                    {showPayPalButton && dataReady ? (
                        <PayPalButtons
                            style={{ layout: "vertical" }}
                            createOrder={createOrder}
                            onApprove={onApprove}
                        />
                    ) : null}
                </div>
               
            
        </PayPalScriptProvider>
    );
}







const mapStateToProps = state => {


// Create new SDK instance
// To obtain a client ID, see Applications in Flex Console
const sdk = sharetribeSdk.createInstance({
    clientId: process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID
  });
  
  // Query first 5 listings
  sdk.listings
    .query({ perPage: 5 })
    .then(res => {
      // Print listing titles
      res.data.data.forEach(listing => {
        console.log(`Listing: ${listing.attributes.title}`)
      });



      sdk.transactions.initiate({
        processAlias: "default-inquiry/release-1",
        transition: "transition/request",
        params: {
          listingId: "653ff9b6-7196-44fa-acbc-1690725a60c9",
          bookingStart: new Date("2023-11-08T00:00:00.000Z"),
          bookingEnd: new Date("2023-12-10T00:00:00.000Z")
        }
      }, {
        expand: true
      }).then(res => {
        // res.data contains the response data
          console.log(JSON.stringify(res) +"         cccccccccccccccccccccccccccccccccccccccccccccccccc");
      });




    })
    .catch(res => {
      // An error occurred
      console.log(`Request failed with status: ${res.status} ${res.statusText}`);
    });
  

  






    
    const { currentUser } = state.user;
    return {
      
      currentUser,
     
    };
  };




















  
  const mapDispatchToProps = dispatch => ({
    onHandleOnboarding: values => dispatch(callPayPalOnboardingApi(values)),
  });
  
  const Checkout = compose(
    connect(
      mapStateToProps,
      mapDispatchToProps
    ),
    injectIntl
  )(CheckoutCom);
  




export default Checkout