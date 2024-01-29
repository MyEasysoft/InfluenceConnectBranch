const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');
const integrationSdk = sharetribeIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
  });


module.exports = (req, res) => {


  console.log("Starting ----------------Accept----------------------------");

  const userId = req.body.userId;
  const listingId = req.body.listingId;
  const newPrice = req.body.newPrice;

  console.log("listingId --------------------------------------------    "+listingId);
  // Create new SDK instance
// To obtain a client ID, see Applications in Flex Console

 const sdkUtil = sharetribeIntegrationSdk.util;

 

 const separateObject = obj => {
  
   if(obj === undefined || obj === null)return[];
   const res = [];
   const keys = Object?.keys(obj);
   keys.forEach(key => {

    console.log("Calling ------------------------------------------------------------");
     
     try{
         if(parseInt(obj[key]) !== undefined && obj[key].listingId === listingId && (obj[key].partyA === userId || obj[key].partyB === userId)){
      
           obj[key].newPrice = newPrice;
           
         }

     }catch(error){}
    
   });
   return obj;
 };

 

//Update either a Buyer or Author Info
const updateUser = ()=>{
 const parameters ={
   id: userId
  
 };

 //Get Author profile info including profile image Id
 integrationSdk.users.show(
   parameters
 ).then(res => {
   
  //Get the list of Agreements
   const agreements = res?.data.data.attributes.profile.privateData.Agreements;
   updateUserProfileData(agreements);
  
 })

 const updateUserProfileData = (agreements)=>{
   
   const updatedAgreement = separateObject(agreements);
  
 integrationSdk.users.updateProfile(
   {
     id: userId,
     privateData: {
       Agreements:updatedAgreement,
     },
   }

 ).then(res => {
   console.log(`Change Price Success with status: ${res.status} ${res.statusText}`);
   })
   .catch(res=>{
     console.log(`Change Price Request failed with status: ${res.status} ${res.statusText}`);
   });
 };

 }

const updateUserListingPaidFor = async () => {
  updateUser();
}

 updateUserListingPaidFor();
 
}
