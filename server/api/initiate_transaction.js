
const sdk = require('sharetribe-flex-integration-sdk');

module.exports = (req,res)=>{
    console.log(JSON.stringify(req.body.listingId)+"      hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
  const listingId = req.body.listingId;

    sdk.transactions.initiate({
        processAlias: "default-purchase/release-1",
        transition: "transition/inquire",
        params: {
          listingId: listingId.uuid,
          bookingStart: new Date("2024-22-20T00:00:00.000Z"),
          bookingEnd: new Date("2024-01-27T00:00:00.000Z"),
          seats: 1,
          cardToken: "tok_mastercard"
        }
      }, {
        expand: true
      }).then(res => {
        // res.data contains the response data
        console.log(JSON.stringify(res.data)+"      xxxxxxxxxxxxxxxxxxxxxxxxxxxxxooooooooooooooooooooooooooooooooooo");
      });
}

console.log("      zzzzzzzzzzzzzzzzzzz   ");