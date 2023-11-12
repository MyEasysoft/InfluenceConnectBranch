const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');
const integrationSdk = sharetribeIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
  });
console.log("Working iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");
module.exports = (req, res) => {
    console.log("Working oooooooooooooooooooooooooooooooooooooooooooo");
const separateObject = (obj,listingIdToUpdate) => {
    const currentDate = new Date();
    if(obj === undefined || obj === null)return[];
    const res = [];
    const keys = Object?.keys(obj);
    keys.forEach(key => {
      try{
          if(parseInt(obj[0]) !== undefined && obj[key].listingId === listingIdToUpdate){
            obj[key].completed = true;
            obj[key].status = "Completed";
            obj[key].deliveryDate = currentDate;
          }
      }catch(error){}
    });
    return obj;
  };
  
  
  const getUserListingPaidforAndUpdate = (userId,listingIdToUpdate)=>{
    integrationSdk.users.show({id: userId}).then(res => {
      const allListingsPaidFor = res?.data.data.attributes.profile.privateData.listingPaidFor;
  
      //Update the particular list item
      updatedListing = separateObject(allListingsPaidFor,listingIdToUpdate);
      updateUserProfileData(userId,updatedListing);
    })
  }
  
  
  const updateUserProfileData = (userId,updatedListing)=>{
  
    integrationSdk.users.updateProfile({
      id: userId,
      privateData: {
        listingPaidFor:updatedListing,
      },
     
    }, {
      expand: true
    }).then(res => {
      console.log(`Success: ${res.status} ${res.statusText}`);
    })
    .catch(res=>{
      console.log(`Request failed with status: ${res.status} ${res.statusText}`);
    });
  };
  
  
 const updateListingToReceived = () => {
    const updateUserDatas = {
      getSellerData:getUserListingPaidforAndUpdate(req.body.sellerId,req.body.listingId),
      getInfluencerData:getUserListingPaidforAndUpdate(req.body.authorId,req.body.listingId),
    } 
  };

  updateListingToReceived();

}