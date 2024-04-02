
const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');
// Create new SDK instance
const integrationSdk = sharetribeIntegrationSdk.createInstance({
  clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
  clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
});

const sdkUtil = sharetribeIntegrationSdk.util;
const sdkTypes = sharetribeIntegrationSdk.types;
const { UUID,Money } = sdkTypes;

module.exports = (req, resp) => {

  console.log("productDeliveryAddress ---------------- productDeliveryAddress  cccccccc----------------------------");
  const listingSignature = req.body.sig;
  const listingId = req.body.listingId;
  const sellerId = req.body.sellerId;
  const influencerId = req.body.influencerId;
  const newPricee = req.body.newPrice;

  console.log(listingId+"   Calling ------------------------------------------------------------");
  console.log(sellerId+"   Calling ------------------------------------------------------------");
  console.log(influencerId+"   Calling ------------------------------------------------------------");
 
  ///// Create new SDK instance
/// To obtain a client ID, see Applications in Flex Console

const separateObject = obj => {
  
  if(obj === undefined || obj === null)return[];
  const res = [];
  const keys = Object?.keys(obj);
  keys.forEach(key => {

   console.log("obj[key].sig ------------------------------------------------------------" +obj[key].sig);
   console.log("listingSignature ------------------------------------------------------------" +listingSignature);
    
    try{
        if((parseInt(obj[key]) !== undefined && obj[key].sig === listingSignature) || obj[key].alternateListingSellersPayToId === listingId ){
          obj[key].newPrice = newPricee;
          console.log("Calling =============================----");
        }
    }catch(error){}
   
  });
  return obj;
};

//Update either a Buyer or Author Info
const updateUser = (isSeller)=>{
  console.log(isSeller+"  step0  uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu    ");
  let userId = isSeller?influencerId:sellerId;
 const parameters ={
   id: userId
 };
 console.log(userId+"  step1  uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu    ");
 //Get Author profile info including profile image Id
 integrationSdk.users.show(
   parameters
 ).then(res => {
   console.log("step2  uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu    ");
   const currentListing = res?.data.data.attributes.profile.privateData.Agreements;
   console.log(JSON.stringify(currentListing)+"    555555555555555555555555555555555555555555 ");
   updateUserProfileData(currentListing,isSeller);
  
 })

 const updateUserProfileData = (currentListings,isSeller)=>{
   
   const updatedAgreement = separateObject(currentListings);
  
   //convert array to object
   //const updatedAgreement = Object.assign({},newCon);

   //compile user data
   const id = isSeller? sellerId:influencerId;
   console.log("step6666666666666666666666666666666666666666666    ");
 integrationSdk.users.updateProfile(
   {
     id: id,
     privateData: {
       Agreements:updatedAgreement,
     },
     metadata: {
       identityVerified: true
     }
   }, {
     expand: true,
     include: ["profileImage"]
   }

 ).then(res => {
    console.log(`Success with status: ${res.status} ${res.statusText}`);
    console.log("pppppppppppppppppppppppppppppppppppppppppp");
    resp.send(200, { message: 'ok' });
   })
   .catch(res=>{
     console.log(`Request failed with status: ${res.status} ${res.statusText}`);
   });
 };

 }


//Change the listing price
const updateUserListingPaidFor = async () => {
 integrationSdk.listings.update({
  id: new UUID(listingId),
  price: new Money(newPricee*100, 'USD'),
}).then(res => {
  // res.data
  //Update the newPrice field to reflect the new price
  updateUser(true);
  updateUser(false);
  
  
}).catch(err=>{
 console.log(err +"           ssssssssssssssssgggggggggggggggggssssssssssssss");
});

  
}

 updateUserListingPaidFor();
 
}
