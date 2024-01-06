const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');

//This endpoint is used to send new Proposal Agreement from Influencer to Seller
module.exports = (req, res) => {

  const sellerIsAuthor = req.body.sellerIsAuthor;
  const listingSignature = req.body.sig;
  const listingId = req.body.listingId;
  const partyA = req.body.sellerId.uuid;
  const partyB = req.body.influencerId.uuid;
  const agreementAccepted = false;
  const agreementCancel = false;
  const showAgreement = true;
  const startDate = req.body.startDate;
  const dueDate = req.body.dueDate;
  const isSellerListing = req.body.isSellerListing;
  let listExist = false;
  let listingImage = "";
  let amount = 0;
  let description = "";
  let partyAName = "";
  let partyBName = "";
  let partyAProfileImage = "";
  let partyBProfileImage = "";
  let listingDetails = "";
  let alternateListingSellersPayToId = req.body.alternateListingSellersPayToId;

  console.log(req.body.listingId+ "----------------------Listing-----------------------------");
  console.log(req.body.sellerId+ "----------------------Seller-----------------------------");
  console.log(req.body.influencerId + "----------------------Influencer-----------------------------");
  console.log(req.body.startDate);
  console.log(req.body.dueDate);
  

 
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
         if(parseInt(obj[key]) !== undefined && obj[key].sig === listingSignature){
          if((partyA === obj[key].partyA && partyB === obj[key].partyB) || (partyB === obj[key].partyA && partyA === obj[key].partyB))
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
         if(parseInt(obj[key]) !== undefined && obj[key].sig === listingSignature){
          
           listExist = true;
         }
     }catch(error){}
   });
  ;
 };

//Update either a Buyer or Author Info
const updateUser = (isSeller)=>{
  const userId = isSeller?partyA:partyB;
 const parameters ={
   id: userId
 };

 //Get Author profile info including profile image Id
 integrationSdk.users.show(
   parameters
 ).then(res => {
  
   const currentListing = res?.data.data.attributes.profile.privateData.Agreements;
   const role = res?.data.data.attributes.profile.protectedData.role;
   
   
   checkIfExist(currentListing);
   if(role==="Influencer"){
    updateUserProfileData(currentListing,true);
   }else{
    updateUserProfileData(currentListing,false);
   }
   
   
 })

 function updateUserProfileData (currentListings,isInfluencer){
   
  if(listingImage === true || listingImage === false)return;

  //alternateListingSellersPayToId = isInfluencer?alternateListingSellersPayToId:"";

  //Updating Influencer Information
  //Check if the post blong to the Seller or Influencer before updating
   const listingDetails = {
     sig:listingSignature,
     listingId:listingId,   //Id of the listing that is being paid forr
     partyA:partyA,
     partyB:partyB,
     partyAName:partyAName,
     partyBName:partyBName,
     partyAProfileImage:partyAProfileImage,
     partyBProfileImage:partyBProfileImage,
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
     alternateListingSellersPayToId:alternateListingSellersPayToId,
   }

   console.log(listingImage +"  --------------------listingImage------------------------  ");
   
   const newCon = separateObject(currentListings);
   
   newCon.push(listingDetails);
 
   //convert array to object
   const updatedAgreement = Object.assign({},newCon);

   //compile user data
   const id = isSeller? partyA:partyB;
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

 const getPartyAData = (id)=>{
  const parameters ={
    id: id,
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
    //const role = res.data.attributes.profile.protectedData.role;
    partyAName = firstName +" "+ lastName;
    
    // if(role==="Influencer"){
    //   //Get the listings for this Influencer
    //   //Then look for the one to use as alternateListingSellersPayToId
    // }
    try{
      partyAProfileImage = res?.data.included[0].attributes.variants["square-small"].url;
    }catch(err){}
   
  })
 }

 
 const getPartyBData = (id)=>{
  const parameters ={
    id: id,
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
    partyBName = firstName +" "+ lastName;
    
    try{
      partyBProfileImage = res?.data.included[0].attributes.variants["square-small"].url;
    }catch(err){}
   
  })
 }

const updateUserAgreement = async (userId) => {
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

    console.log(sellerIsAuthor + "      Creating listing copy  starting       ---------------------------------------------  "+userId+"  "+partyB);
    if(sellerIsAuthor && userId === partyB){
      //Create a duplicate copy of listing
      console.log("Creating listing copy         ---------------------------------------------");

      //listingDetails = res.data;
     

    }

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


}


const createListingCopy = async(data)=>{
  if(data === undefined)return;
  console.log(JSON.stringify(data) +"  --------------------------Done3-------------------------    ");
  data.id = partyB;
  console.log("  --------------------------Done4-------------------------    ");
//   integrationSdk.listings.create(
//     JSON.stringify(data)
//    ).then(res => {
//     console.log("  --------------------------Done5-------------------------    ");
//     // res.data
//   })
//   .catch(error=>{
//     console.log(error +"  eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee    ");
//  })
  
  




}


//Get User Data
getPartyAData(partyA);
console.log("  --------------------------Done1-------------------------    ");
getPartyBData(partyB);
console.log("  --------------------------Done2-------------------------    ");
updateUserAgreement(partyB);
//createListingCopy(listingDetails);
//console.log("  --------------------------Done22222222222-------------------------    ");


const getUserListings = (userId)=>{

}

 
}

