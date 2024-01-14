const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');
const integrationSdk = sharetribeIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
  });

module.exports = (req, res) => {
    console.log("Working oooooooooooooooo111111111111111111111111111111111oooooooooooooooooooooooooooo");
const separateObject = (obj,listingIdToUpdate) => {
    const currentDate = new Date();
    if(obj === undefined || obj === null)return[];
    const keys = Object?.keys(obj);
    keys.forEach(key => {
      try{
          if(parseInt(obj[0]) !== undefined && obj[key].listingId === listingIdToUpdate){
            obj[key].completed = true;
            obj[key].status = "Delivered";
            obj[key].deliveryDate = ""+currentDate;
          }
      }catch(error){}
    });
    return obj;
  };
  
  console.log("Working oooooooyyyooooooooooooo");
  const getUserListingPaidforAndUpdate = (userId,listingIdToUpdate)=>{
    console.log(req.body.buyerId+"  "+req.body.listingId+"  11111111111111111111111111");
    integrationSdk.users.show({id: userId}).then(res => {
      const allListingsPaidFor = res?.data.data.attributes.profile.privateData.listingPaidFor;
      console.log(JSON.stringify(allListingsPaidFor)+"  22222222222222222222222222222222222222222222");
      //Update the particular list item
      updatedListing = separateObject(allListingsPaidFor,listingIdToUpdate);
      updateUserProfileData(userId,updatedListing);
    })
  }
  console.log("Working ooooooooooooooozzoooooooooo");
  const updateUserProfileData =  (userId,newCon)=>{
    
    console.log(updatedListing);
    console.log("Working ooooooooooooooaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaooooooooooooooooooooooo");
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
  

  console.log(req.body.buyerId+"   ABC   "+req.body.authorId);
  getUserListingPaidforAndUpdate(req.body.buyerId,req.body.listingId);
  getUserListingPaidforAndUpdate(req.body.authorId,req.body.listingId);
  
}

console.log("Workingdddddddddddddddddddddddddddd iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");

