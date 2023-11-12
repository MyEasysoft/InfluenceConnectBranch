

const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');


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

  //console.log(JSON.stringify(req.body));
  let refId = req.body.resource.purchase_units[0].reference_id;//Contains buyerId, author and listingId
  let dataArray = refId.split(" ");
  const buyerId = dataArray[0];
  const authorId = dataArray[1]
  const listingId = dataArray[2];
  const description = req.body.resource.purchase_units[0].description;
  let listingImage = "";
  

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

//Update either a Buyer or Author Info
const updateUser = (userId,ListingImage,isSeller)=>{
   
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
    if(listExist)return;
    console.log("step2bbbbb  uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu    ");
    const {firstName, lastName} = res?.data.data.attributes.profile;
    console.log(firstName+"   "+lastName+"step2cccccc  uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu    ");
    let profileImage = "";
    try{
      profileImage = res?.data.included[0].attributes.variants["square-small"].url;
    }catch(err){}
    

    console.log(profileImage+"    step3  uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu    ");
    //Get the exiting info for this Buyer before updating
    integrationSdk.users.show({id: userId}).then(res => {
      console.log("step4  uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu    ");
      const currentListing = res?.data.data.attributes.profile.privateData.listingPaidFor;
      updateUserProfileData(currentListing,firstName,lastName,profileImage,ListingImage,isSeller);
      console.log("step5  uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu    ");
    });
   
  })

  const updateUserProfileData = (currentListings,firstName,lastName,profileImage,listingPhoto,isSeller)=>{

    //New listing to be added
    const listingDetails = isSeller? {
      listingId:listingId,   //Id of the listing that is being paid for
      amountReceived:req.body.resource.purchase_units[0].amount,      //Amount paid, this can be full payment or part payment
      datetimeOfPayment:req.body.resource.create_time,
      authorName:firstName+" "+lastName,
      authorId:authorId,
      authorPhoto: profileImage,
      description:description,
      listingPhoto:listingPhoto,
      deliveryDate:"",
      status:"Pending",
      dueDate:"",
      submissionDate:"",
      completed:false,             
    }:{
      listingId:listingId,   //Id of the listing that is being paid for
      amountReceived:req.body.resource.purchase_units[0].amount,      //Amount paid, this can be full payment or part payment
      datetimeOfPayment:req.body.resource.create_time,
      buyerName:firstName+" "+lastName,
      buyerId:buyerId,
      buyerPhoto: profileImage,
      description:description,
      listingPhoto:listingPhoto,
      deliveryDate:"",
      status:"Pending",
      dueDate:"",
      submissionDate:"",
      completed:false,             
    };

    const newCon = separateObject(currentListings);
    if(listExist)return null;
    newCon.push(listingDetails);
  
    const updatedListing = Object.assign({},newCon);

    //compile user data
    const id = isSeller? buyerId:authorId;
    
  integrationSdk.users.updateProfile(
    {
      id: id,
      privateData: {
        listingPaidFor:updatedListing,
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

const updateUserListingPaidFor = (ListingImageId) => {

    //Get the image url
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
    })
    .then(res => {
      listingImage = res?.data.included[0].attributes.variants["square-small"].url;
      updateUser(buyerId,listingImage,true);
    })
    .then(res => {
      updateUser(authorId,listingImage,false);
    })
    .catch(error=>{
        console.log(error +"  eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee    ");
    })
  };
  
  updateUserListingPaidFor();
  
}












