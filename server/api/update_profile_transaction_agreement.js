const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');

//This endpoint is used to send new Proposal Agreement from Influencer to Seller
module.exports = (req, res) => {

  const listingId = req.body.listingId;
  const sellerId = req.body.sellerId;
  const influencerId = req.body.influencerId;
  const agreementAccepted = false;
  const agreementCancel = false;
  const showAgreement = true;
  const startDate = req.body.startDate;
  const dueDate = req.body.dueDate;
  let listExist = false;
  let listingImage = "";
  let amount = 0;
  let description = "";

 
  // Create new SDK instance
// To obtain a client ID, see Applications in Flex Console

// Create new SDK instance
const integrationSdk = sharetribeIntegrationSdk.createInstance({
   clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
   clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
 });

 const sdkUtil = sharetribeIntegrationSdk.util;

 

 const separateObject = obj => {
   if(listExist)return[];
  
   if(obj === undefined || obj === null)return[];
   const res = [];
   const keys = Object?.keys(obj);
   keys.forEach(key => {
     
     try{
         if(parseInt(obj[0]) !== undefined && obj[key].listingId === listingId){
           listExist = true;
          
         }
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
         if(parseInt(obj[0]) !== undefined && obj[key].listingId === listingId){
           listExist = true;
         }
     }catch(error){}
   });
  ;
 };

//Update either a Buyer or Author Info
const updateUser = (isSeller)=>{
  const userId = isSeller?sellerId:influencerId;
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
 ).then(res => {
  
   const {firstName, lastName} = res?.data.data.attributes.profile;
   
   let profileImage = "";
   try{
     profileImage = res?.data.included[0].attributes.variants["square-small"].url;
   }catch(err){}
   const currentListing = res?.data.data.attributes.profile.privateData.Agreements;
   
   checkIfExist(currentListing);
   if(listExist){
     return null;
   }else{
      updateUserProfileData(currentListing,firstName, lastName,profileImage,listingImage,isSeller);
   }
 })

 function updateUserProfileData (currentListings,firstName, lastName,profileImage,listingImage,isSeller){
   
  if(listingImage === true || listingImage === false)return;
  
   const listingDetails = !isSeller? {
     listingId:listingId,   //Id of the listing that is being paid for
     seller:influencerId,
     influencer:sellerId,
     influencerName:firstName+" "+lastName,
     profileImage:profileImage,
     listingPhoto:listingImage,
     deliveryDate:"",
     status:"Not Started",
     dueDate:""+dueDate,
     submissionDate:"",
     completed:false, 
     agreementAccepted : agreementAccepted,
     agreementCancel : agreementCancel,
     showAgreement : showAgreement,
     startDate :""+startDate,
     dueDate : ""+dueDate,
     amount:amount,  
     description:description,  
   }:{
     listingId:listingId,   //Id of the listing that is being paid for
     seller:influencerId,
     influencer:sellerId,
     sellerName:firstName+" "+lastName,
     profileImage:profileImage,
     listingPhoto:listingImage,
     deliveryDate:"",
     status:"Not Started",
     dueDate:""+dueDate,
     submissionDate:"",
     completed:false, 
     agreementAccepted : agreementAccepted,
     agreementCancel : agreementCancel,
     showAgreement : showAgreement,
     startDate :""+startDate,
     dueDate : ""+dueDate,
     amount:amount,   
     description:description,        
   };

   console.log(listingImage +"  --------------------listingImage------------------------  ");
   
   const newCon = separateObject(currentListings);
   
  
   
   newCon.push(listingDetails);
 
   //convert array to object
   const updatedAgreement = Object.assign({},newCon);

   //compile user data
   const id = isSeller? sellerId:influencerId;
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






 

const updateUserAgreement = async () => {
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
    listingImage = res?.data.included[0].attributes.variants["square-small"].url;
    amount = res?.data.data.attributes.price.amount;
    description = res?.data.data.attributes.description;

    amount = parseInt(amount) /100;
    console.log(listingImage +"  ooooooooooooooooooooolistingImageoooooooooooooooooooooooooooo    "+amount);
    updateUser(true);
  })
  .then(res => {
    console.log(listingImage +"  uuuuuuuuuuuuuuuuuuuuuuuulistingImageuuuuuuuuuuuuuuuuuuuuuuuuu    ");
    updateUser(false);
  })
  .catch(error=>{
     // console.log(error +"  eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee    ");
  })
























  updateUser(true);//IsSeller
  updateUser(false);//IsInfluencer
}

updateUserAgreement();
 
}
