
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
    try {
        const response =  fetch("https://api-m.sandbox.paypal.com/v2/customer/partner-referrals", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer ACCESS-TOKEN",
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
                    "PAYMENT-TYPE"
                ],
                "legal_consents": [{
                    "type": "SHARE_DATA_CONSENT",
                    "granted": true
                }]
                
          }),
        });

        const orderData =  response.json();

        if (orderData.id) {
            dispatch(onboardSuccess(response));
          //return orderData.id;
        } else {
          const errorDetail = orderData?.details?.[0];
          const errorMessage = errorDetail
            ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
            : JSON.stringify(orderData);
            dispatch(onboardError(errorMessage));
          throw new Error(errorMessage);
        }
      } catch (error) {
        console.error(error);
        setMessage(`Could not initiate PayPal Checkout...${error}`);
      }
}