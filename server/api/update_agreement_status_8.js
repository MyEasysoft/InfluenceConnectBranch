const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');


module.exports = (req, res) => {


  console.log("Starting ----------------ProjectClosure----------------------------");

  const listingSignature = req.body.sig;
  const listingId = req.body.listingId;
  const sellerId = req.body.sellerId;
  const influencerId = req.body.influencerId;
  

  console.log("listingId --------------------------------------------    "+listingId);
  // Create new SDK instance
// To obtain a client ID, see Applications in Flex Console

// Create new SDK instance
const integrationSdk = sharetribeIntegrationSdk.createInstance({
   clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
   clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
 });

 const sdkUtil = sharetribeIntegrationSdk.util;

 

 const separateObject = obj => {
  
   if(obj === undefined || obj === null)return[];
   const res = [];
   const keys = Object?.keys(obj);
   keys.forEach(key => {

    console.log("Calling ------------------------------------------------------------");
     
     try{
         if(parseInt(obj[key]) !== undefined && obj[key].sig === listingSignature){
      
           obj[key].status7ProjectClosure = true;
           obj[key].status0NextStatus = "End";
         }

     }catch(error){}
    
   });
   return obj;
 };

 

//Update either a Buyer or Author Info
const updateUser = (isSeller)=>{
  let userId = isSeller?influencerId:sellerId;
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
 console.log(userId+"  step1  uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu    ");
 //Get Author profile info including profile image Id
 integrationSdk.users.show(
   parameters
 ).then(res => {
   console.log("step2  uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu    ");
   const currentListing = res?.data.data.attributes.profile.privateData.Agreements;
   //console.log(JSON.stringify(currentListing)+"    555555555555555555555555555555555555555555 ");
   //console.log(firstName+"  "+lastName+"  "+profileImage+"  "+ListingImage+"  "+isSeller+"    555555555555555555555555555555555555555555 ");
  
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
   })
   .catch(res=>{
     console.log(`Request failed with status: ${res.status} ${res.statusText}`);
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
  updateUser(true);
  updateUser(false);
}

 updateUserListingPaidFor();
 
}
