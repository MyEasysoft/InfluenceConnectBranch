

const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');


module.exports = (req, res) => {

  console.log("Starting --------------------------------------------");
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
  let completionDurationValue = 0;
  const paymentDate = req.body.create_time;
  let dueDate = "";
  

  const separateObject = obj => {
    if(listExist)return[];
   
    if(obj === undefined || obj === null)return[];
    const res = [];
    const keys = Object?.keys(obj);
    keys.forEach(key => {
      
      try{
          if(parseInt(obj[0]) !== undefined && obj[key].listingId === listingId){
            listExist = true;
            //console.log(obj[key].listingId+"  ooooooooooooooooooooooooooooooooooooooooo    "+ listingId);
            
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
  console.log(userId+"  step1  uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu    ");
  //Get Author profile info including profile image Id
  integrationSdk.users.show(
    parameters
  ).then(res => {
    //console.log("step2  uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu    ");
    
    //console.log("step2bbbbb  uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu    ");
    const {firstName, lastName} = res?.data.data.attributes.profile;
    //console.log(userId+"   "+firstName+"   "+lastName+"     step222222  uuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu    ");
    let profileImage = "";
    try{
      profileImage = res?.data.included[0].attributes.variants["square-small"].url;
    }catch(err){}
    
    const currentListing = res?.data.data.attributes.profile.privateData.listingPaidFor;
    //console.log(JSON.stringify(currentListing)+"    555555555555555555555555555555555555555555 ");
    //console.log(firstName+"  "+lastName+"  "+profileImage+"  "+ListingImage+"  "+isSeller+"    555555555555555555555555555555555555555555 ");
    checkIfExist(currentListing);
    if(listExist){
      //console.log("List exist ssssssssssssssssssssssssssssssss");
      return null;
    }
    updateUserProfileData(currentListing,firstName,lastName,profileImage,ListingImage,isSeller);
   
  })

  const updateUserProfileData = (currentListings,firstName,lastName,profileImage,listingPhoto,isSeller)=>{
    console.log(firstName+"  "+lastName+"  "+profileImage+"  "+ListingImage+"  "+isSeller+"    555555555555555555555555555555555555555555 ");
    //New listing to be added
    const listingDetails = isSeller? {
      listingId:listingId,   //Id of the listing that is being paid for
      amount:req.body.resource.purchase_units[0].amount,      //Amount paid, this can be full payment or part payment 
      datetimeOfPayment:req.body.resource.create_time,
      authorName:firstName+" "+lastName,
      authorId:authorId,
      authorPhoto: profileImage,
      description:description,
      listingPhoto:listingPhoto,
      deliveryDate:"",
      status:"Pending",
      dueDate:""+dueDate,
      submissionDate:"",
      completed:false,             
    }:{
      listingId:listingId,   //Id of the listing that is being paid for
      amount:req.body.resource.purchase_units[0].amount,      //Amount paid, this can be full payment or part payment
      datetimeOfPayment:req.body.resource.create_time,
      buyerName:firstName+" "+lastName,
      buyerId:buyerId,
      buyerPhoto: profileImage,
      description:description,
      listingPhoto:listingPhoto,
      deliveryDate:"",
      status:"Pending",
      dueDate:""+dueDate,
      submissionDate:"",
      completed:false,             
    };
    
    const newCon = separateObject(currentListings);
    
    //console.log("step66666666666662222222222222222222222222222222    ");
    newCon.push(listingDetails);
  
    //convert array to object
    const updatedListing = Object.assign({},newCon);

    //compile user data
    const id = isSeller? buyerId:authorId;
    //console.log("step6666666666666666666666666666666666666666666    ");
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
      listingImage = res?.data.included[0].attributes.variants["square-small"].url;
      const completionDuration = res.data.data.attributes.publicData.completion_duration;
      completionDurationValue = getDuration(completionDuration);
      const current = new Date(paymentDate);
      
      current.setDate(current.getDate()+parseInt(completionDurationValue));
      dueDate = current.toDateString();
  
      console.log(JSON.stringify(res.data));
      updateUser(listingImage,true);
    })
    .then(res => {
      updateUser(listingImage,false);
    })
    .catch(error=>{
       // console.log(error +"  eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee    ");
    })
  };
  
  updateUserListingPaidFor();
  
}












