import React from 'react';
import { useEffect, useState } from 'react';
import { client_id } from '../../config/configPaypal';

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import css from './Checkout.module.css';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { callPayPalOnboardingApi } from './Checkout.duck';

const CheckoutCom = (props) => {
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState("");
    const [orderID, setOrderID] = useState(false);
    
    const {
        currentUser,
    } = props;
   


    const handleSubmit = (e) =>{
        e.preventDefault();
        
        setShow(!show);
    };

    const dataReady = currentUser !== undefined;

    // creates a paypal order
    const createOrder = (data, actions) => {
        return actions.order.create(
           
            {
                intent: "CAPTURE",
            purchase_units: [
                {
                    reference_id: currentUser?.id?.uuid, 
                    description: "User test payment",
                    amount: {
                        currency_code: "USD",
                        value: 0.01,
                    },
                },
            ],
        }
        ).then((orderID) => {
                setOrderID(orderID);
                console.log(JSON.stringify(orderID)+"    zzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz");
                return orderID;
            });
    };

    // check Approval
    const onApprove = (data, actions) => {
        return actions.order.capture().then(function (details) {
            const { payer } = details;

            console.log(JSON.stringify(payer)+"    xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx");
           
            setSuccess(true);
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
                           
                            <button className={css.submitBtn} type="submit" onClick={handleSubmit}>
                                Setup test payment
                            </button>
                        </div>
                    </div>


                    <br></br>
                    {dataReady && show ? (
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
    
    const { currentUser } = state.user;
    return {
      
      currentUser,
     
    };
  };
  
  const mapDispatchToProps = dispatch => ({
    onHandleOnboarding: values => dispatch(callPayPalOnboardingApi(values)),
  });
  
  const Checkouts = compose(
    connect(
      mapStateToProps,
      mapDispatchToProps
    ),
    injectIntl
  )(CheckoutCom);
  




export default Checkouts