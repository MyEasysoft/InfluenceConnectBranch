

export const ONBOARD_REQUEST =
  'app/Checkout/ONBOARD_REQUEST';
export const ONBOARD_SUCCESS =
  'app/Checkout/ONBOARD_SUCCESS';
export const ONBOARD_ERROR =
  'app/Checkout/ONBOARD_ERROR';


  const initialState = {
    onboardError: null,
    onboardInProgress: false,
  };


  //Reducers
  export default function reducer(state = initialState, action = {}) {
    const { type, payload } = action;
    switch (type) {
      case ONBOARD_REQUEST:
        return {
          ...state,
          onboardInProgress: true,
          onboardError: null,
          
        };
      case ONBOARD_SUCCESS:
        return { ...state ,
            onboardInProgress: false,
          
        };
      case ONBOARD_ERROR:
        console.error(payload); // eslint-disable-line no-console
        return {
          ...state,
          onboardInProgress: false,
          onboardError: payload,
        };
  
      default:
        return state;
    }
  }


  //------------------Action creators
  export const onboardRequest = ()=>({type:ONBOARD_REQUEST});
  export const onboardSuccess = (response)=>({
    type:ONBOARD_SUCCESS,
    payload:response,
});
  export const onboardError = (error)=>({ 
    type:ONBOARD_ERROR,
    payload:error,
    error:true,
});


export const callPayPalOnboardingApi = params=>(dispatch,getState,sdk)=>{
    dispatch(onboardRequest());

   const token = fetch('https://api.sandbox.paypal.com/v1/oauth2/token', { 
      method: 'POST',
      headers: { 
           'Accept': 'application/json', 
           'Accept-Language': 'en_US',
           'Content-Type': 'application/x-www-form-urlencoded',
           'Authorization': 'Basic ' + btoa('ATeHfKvMruOnfJguf01jgcri7ddl1uXkLe27ow4Q7Vi1GfP9NDY-T-gHipcN6L8-848wq3frT7YQX2Jo:ECgFYWCc3m7uwYsrhHNGoIvwGnDGFaIk29ubTryIT-iUuCsD4lBx9eJRcTdgmVGW5CFkyR_GkmzEjHkh')
      },
      body: 'grant_type=client_credentials'
  
  }).then(response => response.json())
    .then(async (data) => {
      
      makePayments(data.access_token);
  }).catch(function (error) {
      let edata = error.message;
      console.log('Error:', edata);
  })
}


const getFormLink = (token)=>{
  try {
    console.log('token:', token);
    const response =  fetch("https://api-m.sandbox.paypal.com/v2/customer/partner-referrals", {
  //const response =  fetch("https://api-m.sandbox.paypal.com/v3/customer/managed-accounts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer '+ token,
      },
      // use the "body" param to optionally pass additional order information
      // like product ids and quantities
      body: JSON.stringify({
        
            "tracking_id": "TRACKING-ID",
            "operations": [{
                "operation": "API_INTEGRATION",
                "api_integration_preference": {
                    "rest_api_integration": {
                        "integration_method": "PAYPAL",
                        "integration_type": "THIRD_PARTY",
                        "third_party_details": {
                            "features": [
                                "PAYMENT",
                                "REFUND"
                            ]
                        }
                    }
                }
            }],
            "products": [
                "EXPRESS_CHECKOUT"
            ],
            "legal_consents": [{
                "type": "SHARE_DATA_CONSENT",
                "granted": true
            }]
            
      }),
    }).then(res=>{
      const orderData =  res.json();
      console.log('orderData:', orderData);
      if (orderData.id) {
          //dispatch(onboardSuccess(res));
        //return orderData.id;
      } else {
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);
          
        throw new Error(errorMessage);
      }
    })

    
  } catch (error) {
    console.error(error);
    setMessage(`Could not initiate PayPal Checkout...${error}`);
  }
}

export const makePayouts = params =>(dispatch,getState,sdk)=>{
    const token = fetch('https://api.sandbox.paypal.com/v1/oauth2/token', { 
      method: 'POST',
      headers: { 
          'Accept': 'application/json', 
          'Accept-Language': 'en_US',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa('ATeHfKvMruOnfJguf01jgcri7ddl1uXkLe27ow4Q7Vi1GfP9NDY-T-gHipcN6L8-848wq3frT7YQX2Jo:ECgFYWCc3m7uwYsrhHNGoIvwGnDGFaIk29ubTryIT-iUuCsD4lBx9eJRcTdgmVGW5CFkyR_GkmzEjHkh')
      },
      body: 'grant_type=client_credentials'

  }).then(response => response.json())
    .then(async (data) => {
      
      makePayments(data.access_token);
  }).catch(function (error) {
      let edata = error.message;
      console.log('Error:', edata);
  })
}



const makePayments = (token)=>{
  try {
    console.log('Sending Payouts ---------------------------------------- token:', token);
    const response =  fetch("https://api-m.sandbox.paypal.com/v1/payments/payouts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: 'Bearer '+ token,
      },
      // use the "body" param to optionally pass additional order information
      // like product ids and quantities
      body: JSON.stringify({
       
          "sender_batch_header": {
            "sender_batch_id": "2014021127",
            "recipient_type": "EMAIL",
            "email_subject": "You have money!",
            "email_message": "You received a payment. Thanks for using our service!"
          },
          "items": [
           
            {
              "recipient_type": "PAYPAL_ID",
              "amount": {
                  "value": "10003.00",
                  "currency": "USD"
              },
              "note": "Thanks for your patronage!",
              "sender_item_id": "201403140001",
              "receiver": "NVBDJMUCGSUPN",
              "notification_language": "en-US"
          },
          
          {
              "recipient_type": "PAYPAL_ID",
              "amount": {
                  "value": "9050.00",
                  "currency": "USD"
              },
              "note": "Thanks for your patronage!",
              "sender_item_id": "201403140003",
              "receiver": "F5P9SLL3BDTYJ"
          }


          ]
        
      }),
    }).then(res=>{
      const orderData =  res.json();
      console.log('orderData:', orderData);
      if (orderData.id) {
          //dispatch(onboardSuccess(res));
        //return orderData.id;
        console.log('orderData:;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;   ', orderData.id);
      } else {
        const errorDetail = orderData?.details?.[0];
        const errorMessage = errorDetail
          ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
          : JSON.stringify(orderData);
          
        throw new Error(errorMessage);
      }
    })

    
  } catch (error) {
    console.error(error);
    setMessage(`Could not initiate PayPal Checkout...${error}`);
  }
}
