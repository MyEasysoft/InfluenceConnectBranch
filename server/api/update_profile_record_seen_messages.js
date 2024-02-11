const sharetribeIntegrationSdk = require('sharetribe-flex-integration-sdk');
const integrationSdk = sharetribeIntegrationSdk.createInstance({
    clientId: process.env.SHARETRIBE_INTEGRATION_CLIENT_ID,
    clientSecret: process.env.SHARETRIBE_INTEGRATION_CLIENT_SECRET
  });

module.exports = (req, res) => {
console.log("Working iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii");

const txId = req.body.id;
const userId = req.body.userId;
 
const separateObject = obj => {
    //if(listExist)return[];
   
    if(obj === undefined || obj === null)return[];
    const res = [];
    const keys = Object?.keys(obj);
    keys.forEach(key => {
      
      try{
          res.push(
            obj[key]
          );
      }catch(error){}
     
    });
    return res;
  };
  
  const getUserData = (userId)=>{
    //console.log(req.body.sellerId+"  "+req.body.listingId+"  11111111111111111111111111");
    integrationSdk.users.show({id: userId}).then(res => {
      const currentSeenMessages = res?.data.data.attributes.profile.protectedData.seenMessages;
     
      updateUserProfileData(currentSeenMessages);
    })
  }
  
  
  const updateUserProfileData =  (currentSeenMessages)=>{
    
    const newTxId = {id:txId};
    
    const arrayOfCurrentSeenMsg = separateObject(currentSeenMessages);
    arrayOfCurrentSeenMsg.push(newTxId);
    const updatedSeenMsg = Object.assign({},arrayOfCurrentSeenMsg);
   
    integrationSdk.users.updateProfile(
    {
        id: userId,
        protectedData: {
          seenMessages:updatedSeenMsg,
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
  
  getUserData(userId);
 
}