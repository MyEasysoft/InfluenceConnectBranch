

const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');
const integrationSdk = sharetribeIntegrationSdk.createInstance({
  clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
  clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
});

module.exports = (req, res) => {

// Create new SDK instance
  console.log("Starting --------------------------------------------");
   // Create new SDK instance
// To obtain a client ID, see Applications in Flex Console

 

  const sdkUtil = sharetribeIntegrationSdk.util;
  let listExist = false;

  const buyerId = req.body.buyerId;
  const authorId =  req.body.authorId;
  const listingId =  req.body.listingId;
  const description =  req.body.description;
  let listingImage = "";
  let completionDurationValue = 0;
  const paymentDate =  req.body.create_time;
  let dueDate = "";
  const totalPayIn = req.body.totalPayIn;
  let payout = parseInt(totalPayIn) /100; 
  let refId = buyerId+authorId+listingId;

  const separateObject = obj => {
    if(listExist)return[];
   
    if(obj === undefined || obj === null)return[];
    const res = [];
    const keys = Object?.keys(obj);
    keys.forEach(key => {
      
      try{
         
          res.push(
            obj[key]
          );

      }catch(error){}
     
    });
    return res;
  };

  const checkIfExist = (obj) => {
   
    if(obj === undefined || obj === null)return[];
    const keys = Object?.keys(obj);
    keys.forEach(key => {
      try{
          if(parseInt(obj[0]) !== undefined && obj[key].refId === refId){
            console.log(obj[key].refId+"   ---------------------------------------     "+refId);
            listExist = true;
          }
      }catch(error){}
    });
   ;
  };

//Update either a Buyer or Author Info
const updateUser = (ListingImage,isSeller)=>{
 
   let userId = isSeller?authorId:buyerId;
  const parameters ={
    id: userId,
    include: ['profileImage'],
    'fields.image': [
      'variants.square-small',
      'variants.square-small2x',
      'variants.square-xsmall',
      'variants.square-xsmall2x',
    ],
    'imageVariant.square-xsmall': sdkUtil.objectQueryString({
      w: 40,
      h: 40,
      fit: 'crop',
    }),
    'imageVariant.square-xsmall2x': sdkUtil.objectQueryString({
      w: 80,
      h: 80,
      fit: 'crop',
    }),
  };
 
  //Get Author profile info including profile image Id
  integrationSdk.users.show(
    parameters
  ).then(async res => {
   
   
    const {firstName, lastName,protectedData, privateData} = res?.data.data.attributes.profile;
    const {role} = protectedData;
    const {paypalMerchantId} = privateData;

    console.log("Step F   ------------------------------------");
    if(role==="Influencer"){
      paypalMerchantId_receiver = paypalMerchantId;
    }


    let profileImage = "";
    try{
      profileImage = res?.data.included[0].attributes.variants["square-small"].url;
    }catch(err){}
    
    const currentListing = res?.data.data.attributes.profile.privateData.listingPaidFor;
    const currentReviews = res?.data.data.attributes.profile.publicData.reviews;
    console.log(JSON.stringify(currentListing)+"    555555555555555555555555555555555555555555 ");
    //console.log(firstName+"  "+lastName+"  "+profileImage+"  "+ListingImage+"  "+isSeller+"    555555555555555555555555555555555555555555 ");
    checkIfExist(currentListing);
    if(listExist){
      console.log("List exist sssssssssssssssssssssssssssssssss");
      return null;
    }
    console.log("Step G   --------------------------------------");
    //await getTokenThenMakePayouts(paypalMerchantId);
    updateUserProfileData(currentListing,firstName,lastName,profileImage,ListingImage,isSeller,currentReviews);
   
  })

  const updateUserProfileData = (currentListings,firstName,lastName,profileImage,listingPhoto,isSeller,currentReviews)=>{
    
    //New listing to be added
    const listingDetails = isSeller? {
      refId:refId,
      listingId:listingId,   //Id of the listing that is being paid for
      amount:payout,      //Amount paid, this can be full payment or part payment 
      datetimeOfPayment:req.body.create_time,
      authorName:firstName+" "+lastName,
      authorId:authorId,
      authorPhoto: profileImage,
      description:description,
      listingPhoto:listingPhoto,
      deliveryDate:"",
      status:"Purchased",
      dueDate:""+dueDate,
      submissionDate:"",
      completed:false,
      seller_reviewContent:"",
      seller_reviewRating:"",
      seller_reviewDate:"",     
      influencer_reviewContent:"",
      influencer_reviewRating:"",
      influencer_reviewDate:"",             
    }:{
      refId:refId,
      listingId:listingId,   //Id of the listing that is being paid for
      amount:payout,      //Amount paid, this can be full payment or part payment
      datetimeOfPayment:req.body.create_time,
      buyerName:firstName+" "+lastName,
      buyerId:buyerId,
      buyerPhoto: profileImage,
      description:description,
      listingPhoto:listingPhoto,
      deliveryDate:"",
      status:"Purchased",
      dueDate:""+dueDate,
      submissionDate:"",
      completed:false,
      seller_reviewContent:"",
      seller_reviewRating:"",
      seller_reviewDate:"",     
      influencer_reviewContent:"",
      influencer_reviewRating:"",
      influencer_reviewDate:"",
    };

    const reviews = {
      refId:refId,
      listingId:listingId,
      buyerId:buyerId,
      authorId:authorId,
      seller_displayName:"",
      seller_reviewContent:"",
      seller_reviewRating:"",
      seller_reviewDate:"",     
      influencer_displayName:"",
      influencer_reviewContent:"",
      influencer_reviewRating:"",
      influencer_reviewDate:"",
    }
    
    //get reviews object
    const newConReview = separateObject(currentReviews);
    newConReview.push(reviews);
    const updatedReview = Object.assign({},newConReview);
    

    //get listing object
    const newCon = separateObject(currentListings);
    newCon.push(listingDetails);
    const updatedListing = Object.assign({},newCon);


    //compile user data
    const id = isSeller? buyerId:authorId;
    
    console.log("Step H   ------------------------------------");
  integrationSdk.users.updateProfile(
    {
      id: id,
      privateData: {
        listingPaidFor:updatedListing,
      },
      publicData: {
        review:updatedReview,
      },
      metadata: {
        identityVerified: true
      }
    }, {
      expand: true,
      include: ["profileImage"]
    }

  ).then(res => {
    //console.log(`Success with status: ${res.status} ${res.statusText}`);
    })
    .catch(res=>{
      //console.log(`Request failed with status: ${res.status} ${res.statusText}`);
    });
  };

  }


  const getDuration = (value)=>{
    let result = 0;
      switch(value){
        case "1_weeks":
          result = 1;
          break;
        case "2_weeks":
          result = 2;
          break;
        case "3_weeks":
          result = 3;
          break;
        case "4_weeks":
          result = 4;
          break;
        case "5_weeks":
          result = 5;
          break;
        case "6_weeks":
          result = 6;
          break;
        case "7_weeks":
          result = 7;
          break;
        default:
          result = 8;
          break;

      }
      return result;
  }

const updateUserListingPaidFor = async () => {

    //Get the image url
   await integrationSdk.listings.show({
      id: listingId,
      include: ["images"],
      "fields.image": ["variants.square-small", "variants.my-variant"],
      // SDK provides a util function to construct image variant URL param strings
      "imageVariant.my-variant": sdkUtil.objectQueryString({
        w: 320,
        h: 640,
        fit: 'scale'
      })
    })
    .then(res => {
      console.log("Step B   ------------------------------------");

      try{
        listingImage = res?.data.included[0].attributes.variants["square-small"].url;
      }catch(e){}
      
      console.log("Step B  B ------------------------------------");
      const completionDuration = res.data.data.attributes.publicData.completion_duration;
      console.log("Step B  B B------------------------------------  " + paymentDate);
      completionDurationValue = getDuration(completionDuration);
      const current = new Date(paymentDate);
      console.log("Step B  B B B------------------------------------");
      current.setDate(current.getDate()+parseInt(completionDurationValue));
      dueDate = current.toDateString();

      // integrationSdk.transactions.query({id:"655616fe-7b6c-4758-81f3-ef095bb77b65"}).then(res => {
      //   // res.data contains the response data
      //   console.log(JSON.stringify(res.data));
      // });
  
     // console.log(JSON.stringify(res.data));
      console.log("Step C   ------------------------------------");
      updateUser(listingImage,true);
    })
    .then(res => {
      updateUser(listingImage,false);
    })
    .catch(error=>{
        console.log(error +"  eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee    ");
    })
  };


// //
//   const generateAccessToken = async (paypalMerchantId) => {
//     const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
//     const PAYPAL_APP_SECRET = process.env.PAYPAL_APP_SECRET;

//     try {
//       if (!PAYPAL_CLIENT_ID || !PAYPAL_APP_SECRET) {
//         throw new Error("MISSING_API_CREDENTIALS");
//       }
//       const auth = Buffer.from(
//         PAYPAL_CLIENT_ID + ":" + PAYPAL_APP_SECRET,
//       ).toString("base64");
//       const response = await fetch('https://api.sandbox.paypal.com/v1/oauth2/token', {
//         method: "POST",
//         body: "grant_type=client_credentials",
//         headers: {
//           Authorization: `Basic ${auth}`,
//         },
//       });
  
//       const data = await response.json();

//       makePayments(data.access_token,paypalMerchantId);


//       //return data.access_token;
//     } catch (error) {
//       console.error("Failed to generate Access Token:", error);
//     }
//   };

//  const getTokenThenMakePayouts = async (paypalMerchantId) =>{

//   const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
//   const PAYPAL_APP_SECRET = process.env.PAYPAL_APP_SECRET;


//   try {
//     if (!PAYPAL_CLIENT_ID || !PAYPAL_APP_SECRET) {
//       throw new Error("MISSING_API_CREDENTIALS");
//     }
//     const auth = Buffer.from(
//       PAYPAL_CLIENT_ID + ":" + PAYPAL_APP_SECRET,
//     ).toString("base64");
//     const response = await fetch('https://api.sandbox.paypal.com/v1/oauth2/token', {
//       method: "POST",
//       body: "grant_type=client_credentials",
//       headers: {
//         Authorization: `Basic ${auth}`,
//       },
//     });

//     const data = await response.json();
//     makePayments(data.access_token,paypalMerchantId);

//     //return data.access_token;
//   } catch (error) {
//     console.error("Failed to generate Access Token:", error);
//   }

// }

  // const makePayments = async (token,paypalMerchantId)=>{
  //   try {
     
  //     const response = await fetch("https://api-m.sandbox.paypal.com/v1/payments/payouts", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: 'Bearer '+ token,
  //       },
  //       // use the "body" param to optionally pass additional order information
  //       // like product ids and quantities
  //       body: JSON.stringify({
         
  //           "sender_batch_header": {
  //             "sender_batch_id": "2014021162",
  //             "recipient_type": "EMAIL",
  //             "email_subject": "You have money!",
  //             "email_message": "You received a payment. Thanks for using our service!"
  //           },
  //           "items": [
             
  //             {
  //               "recipient_type": "PAYPAL_ID",
  //               "amount": {
  //                   "value": payout,
  //                   "currency": "USD"
  //               },
  //               "note": "Thanks for your patronage!",
  //               "sender_item_id": "201403140071",
  //               "receiver": paypalMerchantId,
  //               "notification_language": "en-US"
  //           }
  //         ]
          
  //       }),
  //     }).then(async res=>{
  //       const orderData = await res.json();
       
  //       if (orderData.id) {
         
  //       } else {
  //         const errorDetail = orderData?.details?.[0];
  //        console.log(errorDetail);
  //       }
  //     })
  
      
  //   } catch (error) {
  //     console.error(error);
  //     setMessage(`Could not initiate PayPal Checkout...${error}`);
  //   }
  // }


// const getMerchantId = async (userId) => {
//   const parameters ={
//     id: userId
//   };
 
//  return await integrationSdk.users.show(
//     parameters
//   )
// };

// const handleCalls = async ()=>{
//   const isOnboarding = authorId === undefined || authorId === null || authorId === "";
//   if(isOnboarding){
//     //const res = await getMerchantId(buyerId);
//     //const {privateData} = res?.data.data.attributes.profile;
//     const paypalMerchantId = req.body.buyerId;
//     await updateUserPaypalId(buyerId,paypalMerchantId);
    

//   }else{
//     console.log("Step A   ------------------------------------");
//     updateUserListingPaidFor();
//   }
// }
 

// function updateUserPaypalId (userId,paypalId){
  
//   integrationSdk.users.updateProfile(
//    {
//      id: userId,
//      privateData: {
//       paypalMerchantId:paypalId,
//     },
    
//    }, {
//     expand: true,
   
//   }

//  ).then(res => {

//    console.log(`Successful Paypal Id updated: ${res.status} ${res.statusText}`);
//    generateAccessToken(paypalId);
//    })
//    .catch(res=>{
//      console.log(`Failed Paypal Id: ${res.status} ${res.statusText}`);
//    });
//  };


updateUserListingPaidFor();


}

console.log("Starting ================================================");










