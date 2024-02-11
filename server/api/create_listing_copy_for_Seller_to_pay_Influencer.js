const integrationSdk = require('sharetribe-flex-integration-sdk');


module.exports = (req,res)=>{
  console.log("  --------------------------Running  1111111111111111111111-------------------------    ");

  integrationSdk.listings.create(
    JSON.stringify(req.body)
   ).then(res => {
    console.log("  --------------------------Done5-------------------------    ");
    // res.data
  })
  .catch(error=>{
    console.log(error +"  eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee    ");
 })

}


console.log("  --------------------------Running  1111111111111111111111-------------------------    ");
