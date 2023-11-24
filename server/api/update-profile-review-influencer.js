const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');
const integrationSdk = sharetribeIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
  });
//console.log("Working iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");


module.exports = (req, res) => {

  const listingId = req.body.listingId;
  const sellerId = req.body.sellerId;
  const influencerId = req.body.influencerId;
  const reviewContent = req.body.review;
  const reviewRating = req.body.rating;
  const reviewDate = new Date();
    //console.log("Working oooooooooooooooooooooooooooooooooooooooooooo");
const separateObject = (obj,listingIdToUpdate) => {
    const currentDate = new Date();
    if(obj === undefined || obj === null)return[];
    const keys = Object?.keys(obj);
    keys.forEach(key => {
      try{
          if(parseInt(obj[0]) !== undefined && obj[key].listingId === listingIdToUpdate){
            obj[key].influencer_reviewContent = reviewContent;
            obj[key].influencer_reviewRating = reviewRating;
            obj[key].influencer_reviewDate = reviewDate;
          }
      }catch(error){}
    });
    return obj;
  };
  
  
  const getUserListingPaidforAndUpdate = (userId,listingIdToUpdate)=>{
    //console.log(req.body.sellerId+"  "+req.body.listingId+"  11111111111111111111111111");
    integrationSdk.users.show({id: userId}).then(res => {
      const allListingsPaidFor = res?.data.data.attributes.profile.privateData.listingPaidFor;
      //console.log(JSON.stringify(allListingsPaidFor)+"  22222222222222222222222222222222222222222222");
      //Update the particular list item
      updatedListing = separateObject(allListingsPaidFor,listingIdToUpdate);
      updateUserProfileData(userId,updatedListing);
    })
  }
  
  
  const updateUserProfileData =  (userId,newCon)=>{
    
    console.log(updatedListing);

    integrationSdk.users.updateProfile(
    {
        id: userId,
        privateData: {
          listingPaidFor:updatedListing,
        },
        
      }, {
        expand: true,
        include: ["profileImage"]
      }
    
    ).then(res => {
      console.log(`Success: ${res.status} ${res.statusText}`);
    })
    .catch(res=>{
      console.log(`Request failed with status: ${res.status} ${res.statusText}`);
    });
  };
  
 
  getUserListingPaidforAndUpdate(influencerId,req.body.listingId);
  //getUserListingPaidforAndUpdate(req.body.authorId,req.body.listingId);
  
}