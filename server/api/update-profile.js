

const { cancel } = require('raf');
const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');
const { error } = require('../log');

 const TX_TRANSITION_ACTOR_CUSTOMER = 'customer';
 const TX_TRANSITION_ACTOR_PROVIDER = 'provider';
 const TX_TRANSITION_ACTOR_SYSTEM = 'system';
 const TX_TRANSITION_ACTOR_OPERATOR = 'operator';



module.exports = (req, res) => {
   // Create new SDK instance
// To obtain a client ID, see Applications in Flex Console

 // Create new SDK instance
 const integrationSdk = sharetribeIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
  });

  const sdkUtil = sharetribeIntegrationSdk.util;
  let listExist = false;

  let refId = req.body.resource.purchase_units[0].reference_id;//Contains buyerId, author and listingId
  let dataArray = refId.split(" ");
  const buyerId = dataArray[0];
  const authorId = dataArray[1]
  const listingId = dataArray[2];
  const description = req.body.resource.purchase_units[0].description;
  const transactionId = listingId;// req.body.id;




  //Construct the transaction object

 const createTxTransition = options => {
    return {
      createdAt: new Date(Date.UTC(2017, 4, 1)),
      by: TX_TRANSITION_ACTOR_CUSTOMER,
      transition: 'transition/accept',
      ...options,
    };
  };
 const createTransaction = () => {
  
  const  id = req.body.id;
  const processName = 'default-inquiry';
  const processVersion = 1;
  const lastTransition = "transition/accept";
  const total = {
                        amount: req.body.resource.purchase_units[0].amount,
                        currency: "USD"
                      };
  const commission = {
                        amount: 10,
                        currency: "USD"
                      }
  const booking = null;
  const listing = null;
  const customer = null;
  const provider = null;
  const  reviews = [];
  const lastTransitionedAt = new Date(Date.UTC(2017, 5, 1));
  const transitions = [
                        createTxTransition({
                          createdAt: new Date(Date.UTC(2017, 4, 1)),
                          by: TX_TRANSITION_ACTOR_CUSTOMER,
                          transition: "transition/accept",
                        }),
                        createTxTransition({
                          createdAt: new Date(Date.UTC(2017, 4, 1, 0, 0, 1)),
                          by: TX_TRANSITION_ACTOR_CUSTOMER,
                          transition: "transition/accept",
                        }),
                      ];
  
  const dayCount = booking ? daysBetween(booking.attributes.start, booking.attributes.end) : 1;
  const lineItems = [
                        {
                          code: 'line-item/item',
                          includeFor: ['customer', 'provider'],
                          quantity: 1,
                          unitPrice: {
                            amount: total.amount / dayCount,
                            currency: "USD"
                          },
                          lineTotal: total,
                          reversal: false,
                        },
                        {
                          code: 'line-item/provider-commission',
                          includeFor: ['provider'],
                          unitPrice: {
                            amount: commission.amount * -1,
                            currency: commission.currency
                          },
                          lineTotal: {
                            amount: commission.amount * -1,
                            currency: commission.currency
                          },
                          reversal: false,
                        },
                      ];

  return {
    id: id,
    type: 'transaction',
    attributes: {
      createdAt: new Date(Date.UTC(2017, 4, 1)),
      processName,
      processVersion,
      lastTransitionedAt,
      lastTransition,
      payinTotal:  {
        amount: total.amount,
        currency: total.currency
      },
      payoutTotal: {
        amount: total.amount - commission.amount,
        currency: total.currency
      },
      transitions,
      lineItems,
    },
    booking,
    listing,
    customer,
    provider,
    reviews,
  };
};


  const separateObject = obj => {
    if(listExist)return[];
   
    if(obj === undefined || obj === null)return[];
    const res = [];
    const keys = Object?.keys(obj);
    keys.forEach(key => {
      
      try{
          if(parseInt(obj[0]) !== undefined && obj[key].listingId === listingId){
            listExist = true;
            console.log(obj[key].listingId+"  ooooooooooooooooooooooooooooooooooooooooo    "+ listingId);
          }
          res.push(
            obj[key]
          );

      }catch(error){}
     
    });
    return res;
  };


  //Get listing Image url
let listingImage = "";
integrationSdk.listings.show({
  id: listingId,
  include: ["images"],
  "fields.image": ["variants.square-small", "variants.my-variant"],
  // SDK provides a util function to construct image variant URL param strings
  "imageVariant.my-variant": sdkUtil.objectQueryString({
    w: 320,
    h: 640,
    fit: 'scale'
  })
}).then(res => {
  // res.data contains the response data
 
    listingImage = res?.data.included[0].attributes.variants["square-small"].url;
    console.log(listingImage+"  uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu    ");
    updateAuthor(listingImage);
    
   
}).then(res=>{
 
  console.log(listingImage +"  wwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww    ");
  updateBuyer(listingImage);
}).then(res=>{
  setOrderTransaction();
});



//Update Author data
function updateAuthor(ListingImage){
 //For Influencer
  //Get Buyer profile info including profile image Id
  const parameter2 ={
    id: buyerId,
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
  integrationSdk.users.show(parameter2)
  .then(res => {
  if(listExist)return;
  const {firstName, lastName} = res?.data.data.attributes.profile;
  const profileImage =  res?.data.included[0].attributes.variants["square-small"].url;

 
 
  //Update Influencer details
  integrationSdk.users.show({id: buyerId}).then(res => {
    const currentListing = res?.data.data.attributes.profile.privateData.listingPaidFor;
    updateInfluencerProfileData(currentListing,firstName,lastName,profileImage,ListingImage);
  });
})


const updateInfluencerProfileData = (currentListings,firstName,lastName,profileImage,listingPhoto)=>{
  const listingDetails = {
    listingId:listingId,   //Id of the listing that is being paid for
    amountPaid:req.body.resource.purchase_units[0].amount,      //Amount paid, this can be full payment or part payment
    datetimeOfPayment:req.body.resource.create_time,
    authorName:firstName+" "+lastName,
    authorId:authorId,
    authorPhoto: profileImage,
    description:description,
    listingPhoto:listingPhoto                   
  };

  const newCon = separateObject(currentListings);
  if(listExist)return;
  newCon.push(listingDetails);

  const updatedListing = Object.assign({},newCon);
  //console.log(`step3333:    ${JSON.stringify(updatedListing)}`);
  integrationSdk.users.updateProfile({
    id: buyerId,

    privateData: {
      discoveredServiceVia: null,
      paypalMerchantId:req.body.resource.payer.payer_id,
      listingPaidFor:updatedListing,
      

    },
    metadata: {
      identityVerified: true
    }
   
  }, {
    expand: true,
    include: ["profileImage"]
  }).then(res => {
    console.log(`Success: ${res.status} ${res.statusText}`);
    
  })
  .catch(res=>{
    console.log(`Request failed with status: ${res.status} ${res.statusText}`);
  });
};

return ListingImage;
}

//Update buyer data
function updateBuyer (ListingImage){
   
  const parameters ={
    id: authorId,
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
    
  ).then(res => {
    if(listExist)return;
    const {firstName, lastName} = res?.data.data.attributes.profile;
    const profileImage = res?.data.included[0].attributes.variants["square-small"].url;

    
    //Get the exiting info for this Buyer before updating
    integrationSdk.users.show({id: buyerId}).then(res => {
      const currentListing = res?.data.data.attributes.profile.privateData.listingPaidFor;
      updateBuyerProfileData(currentListing,firstName,lastName,profileImage,ListingImage);
    });
   
  })

  const updateBuyerProfileData = (currentListings,firstName,lastName,profileImage,listingPhoto)=>{
    const listingDetails = {
      listingId:listingId,   //Id of the listing that is being paid for
      amountReceived:req.body.resource.purchase_units[0].amount,      //Amount paid, this can be full payment or part payment
      datetimeOfPayment:req.body.resource.create_time,
      buyerName:firstName+" "+lastName,
      buyerId:buyerId,
      buyerPhoto: profileImage,
      description:description,
      listingPhoto:listingPhoto             
    };

    const newCon = separateObject(currentListings);
    if(listExist)return null;
    newCon.push(listingDetails);
  
    const updatedListing = Object.assign({},newCon);
    
    integrationSdk.users.updateProfile({
      id: authorId,

      privateData: {
       
        listingPaidFor:updatedListing,
      
      },
      metadata: {
        identityVerified: true
      }
     
    }, {
      expand: true,
      include: ["profileImage"]
    }).then(res => {
      console.log( JSON.stringify(res) +"      Runing  ==========================================");
      //setOrderTransaction();
    })
    .catch(res=>{
      console.log(`Request failed with status: ${res.status} ${res.statusText}`);
    });
  };

  }

  
const setOrderTransaction = ()=>{
  console.log("Runing  ---------------------------------------------------");
  integrationSdk.transactions.transition({
    id: transactionId,
    transition: "transition/accept",
    params: createTransaction()
  }, {
    expand: true
  }).then(res => {
    // res.data contains the response data
    console.log("Runing  oooooooooooooooooooooooooooooooooooooooooo");
  }) 
  .catch(res=>{
    console.log(`Request failed with status2: ${res.status} ${res.statusText}`);
  });
  ;
}

    


}














  


// Create new SDK instance
// To obtain a client ID, see Applications in Flex Console
