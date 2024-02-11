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
import ReviewForm from '../../containers/TransactionPage/ReviewForm/ReviewForm';
import ReviewModal from '../../containers/TransactionPage/ReviewModal/ReviewModal';
import {
    INQUIRY_PROCESS_NAME,
    TX_TRANSITION_ACTOR_CUSTOMER as CUSTOMER,
    TX_TRANSITION_ACTOR_PROVIDER as PROVIDER,
    resolveLatestProcessName,
    getProcess,
    isBookingProcess,
  } from '../../transactions/transaction';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';
import { isScrollingDisabled, manageDisableScrolling } from '../../ducks/ui.duck';
import { initializeCardPaymentData } from '../../ducks/stripe.duck.js';
import { useConfiguration } from '../../context/configurationContext';
import { sendReview, sendReviewNew } from '../../containers/TransactionPage/TransactionPage.duck';




const sharetribeSdk = require('sharetribe-flex-sdk');
// To obtain a client ID, see Applications in Flex Console
const sdk = sharetribeSdk.createInstance({
  clientId: process.env.REACT_APP_SHARETRIBE_SDK_CLIENT_ID
});

//const client_id = process.env.PAYPAL_CLIENT_ID;

const CheckoutCom = (props) => {
    const [show, setShow] = useState(false);
    const [success, setSuccess] = useState(false);
    const [ErrorMessage, setErrorMessage] = useState("");
    const [orderID, setOrderID] = useState(false);
    const [isDisputeModalOpen, setDisputeModalOpen] = useState(false);
    const [disputeSubmitted, setDisputeSubmitted] = useState(false);
    const [isReviewModalOpen, setReviewModalOpen] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    const config = useConfiguration();


    const {
        currentUser,
        initialMessageFailedToTransaction,
        savePaymentMethodFailed,
        fetchMessagesError,
        fetchMessagesInProgress,
        totalMessagePages,
        oldestMessagePageFetched,
        fetchTransactionError,
        history,
        intl,
        messages,
        onManageDisableScrolling,
        onSendMessage,
        onSendReview,
        onShowMoreMessages,
        params,
        scrollingDisabled,
        sendMessageError,
        sendMessageInProgress,
        sendReviewError,
        sendReviewInProgress,
        transaction,
        transactionRole,
        transitionInProgress,
        transitionError,
        onTransition,
        monthlyTimeSlots,
        onFetchTimeSlots,
        nextTransitions,
        callSetInitialValues,
        onInitializeCardPaymentData,
        onFetchTransactionLineItems,
        fetchLineItemsInProgress,
        fetchLineItemsError,
        onAgree,
        onAccept,
        onCancelAgree,
      } = props;


    const processName = "default-inquiry";
    let process = null;
    try {
      process = processName ? getProcess(processName) : null;
    } catch (error) {
      // Process was not recognized!
    }
  
    const isTxOnPaymentPending = tx => {
      return process ? process.getState(tx) === process.states.PENDING_PAYMENT : null;
    };

// Submit review and close the review modal
const onSubmitReview = values => {

    const { reviewRating, reviewContent } = values;
    const rating = Number.parseInt(reviewRating, 10);
    const { states, transitions } = process;

   
    transactionRole === CUSTOMER
        ? {
            reviewAsFirst: transitions.REVIEW_1_BY_CUSTOMER,
            reviewAsSecond: transitions.REVIEW_2_BY_CUSTOMER,
            hasOtherPartyReviewedFirst: process
              .getTransitionsToStates([states.REVIEWED_BY_PROVIDER])
              .includes(transaction.attributes.lastTransition),
          }
        : {
            reviewAsFirst: transitions.REVIEW_1_BY_PROVIDER,
            reviewAsSecond: transitions.REVIEW_2_BY_PROVIDER,
            hasOtherPartyReviewedFirst: process
              .getTransitionsToStates([states.REVIEWED_BY_CUSTOMER])
              .includes(transaction.attributes.lastTransition),
          };
    const params = { reviewRating: rating, reviewContent };

    onSendReview(transaction, null, params, config)
      .then(r => {
        setReviewModalOpen(false);
        setReviewSubmitted(true);
      })
      .catch(e => {
        // Do nothing.
      });
  };


    
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
        onSubmit,

    } = props;
    const {amount} = price;

    

    const handleSubmit = (e) =>{
        e.preventDefault();
        onHandleOnboarding();
        setShow(!show);
    };

    const dataReady = currentUserId !== undefined && authorId !== undefined && listingId !== undefined;

    if(dataReady){
      sdk.transactions.initiate({
        processAlias: "default-inquiry/release-1",
        transition: "transition/inquiry",
         
          params:{ listingId: listingId}
        
      }, {
        expand: true
      }).then(res => {
        // res.data contains the response data
        console.log(`Success: ${listing.attributes.title}`)
      });
    }

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
        <PayPalScriptProvider options={{ "client-id": client_id}}>
           
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
    const {
        fetchTransactionError,
        transitionInProgress,
        transitionError,
        transactionRef,
        fetchMessagesInProgress,
        fetchMessagesError,
        totalMessagePages,
        oldestMessagePageFetched,
        messages,
        initialMessageFailedToTransaction,
        savePaymentMethodFailed,
        sendMessageInProgress,
        sendMessageError,
        sendReviewInProgress,
        sendReviewError,
        monthlyTimeSlots,
        processTransitions,
        lineItems,
        fetchLineItemsInProgress,
        fetchLineItemsError,
      } = state.TransactionPage;
    
    const { currentUser } = state.user;
    const transactions = getMarketplaceEntities(state, transactionRef ? [transactionRef] : []);
    const transaction = transactions.length > 0 ? transactions[0] : null;
  
    return {
      currentUser,
      fetchTransactionError,
      transitionInProgress,
      transitionError,
      scrollingDisabled: isScrollingDisabled(state),
      transaction,
      fetchMessagesInProgress,
      fetchMessagesError,
      totalMessagePages,
      oldestMessagePageFetched,
      messages,
      initialMessageFailedToTransaction,
      savePaymentMethodFailed,
      sendMessageInProgress,
      sendMessageError,
      sendReviewInProgress,
      sendReviewError,
      monthlyTimeSlots,
      nextTransitions: processTransitions,
      lineItems,
      fetchLineItemsInProgress,
      fetchLineItemsError,
    };
  };


  const mapDispatchToProps = dispatch => ({
    onHandleOnboarding: values => dispatch(callPayPalOnboardingApi(values)),
    onSendReview: (tx, transitionOptions, params, config) =>
      dispatch(sendReviewNew(tx, transitionOptions, params, config)),
  });
  
  const Checkout = compose(
    connect(
      mapStateToProps,
      mapDispatchToProps
    ),
    injectIntl
  )(CheckoutCom);
  




export default Checkout