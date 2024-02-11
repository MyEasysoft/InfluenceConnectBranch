import React, { useEffect, useState } from 'react';
import css from './AgreementForm.module.css';
import { types as sdkTypes } from '../../../src/util/sdkLoader';
import w1 from '../../assets/cover1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faHeart, faSignIn, faEnvelope, faSpinner} from '@fortawesome/free-solid-svg-icons';
import { InlineTextButton } from '../Button/Button';
const { Money, UUID } = sdkTypes;



const AgreementForm = (props)=>{
    const [showAcceptBtn, setShowAcceptBtn] = useState(true);
    const [startDate, setStartDate] = useState(true);
    const [dueDate, setDueDate] = useState(true);
    const [showAgreementSentSuccess, setShowAgreementSentSuccess] = useState(false);
    const [showAgreement, setShowAgreement] = useState(false);
    const [agreementAlreadyExist, setAgreementAlreadyExist] = useState(false);
    const [agreementAccepted, setAgreementAccepted] = useState(false);
    const [agreementCancel, setAgreementCancel] = useState(false);
    let alreadySentAgreement = [];
    const [alternatListingId, setAlternatListingId] = useState("");

    const [currentSellerId, setCurrentSellerId] = useState("");
    const [currentInfluencerId, setCurrentInfluencerId] = useState("");
    const [currentListingId, setCurrentListingId] = useState("");
    const [from, setFrom] = useState("");
    
    const{
        sellerId,
        influencerId,
        listingId,
        influencerName,
        influencerProfilePhoto,
        authorName,
        authorProfilePhoto,
        listingDescription,
        cost,
        duration,
        onAgree,
        onAccept,
        onCancel,
        agreements,
        role,
        listing,
        currentUser,
        listingPhoto
    }= props;

    
    const isOwnListing = listing.author.id.uuid === currentUser.id.uuid;
    const getAgreement = (agreements,agreementToCheckListingId) => {
  
      if(agreements === undefined || agreements === null)return[];
      const res = [];
      const keys = Object?.keys(agreements);
      keys.forEach(key => {
        
        try{
            if(parseInt(agreements[0]) !== undefined && agreements[key].listingId === agreementToCheckListingId){
              
              //console.log(obj[key].listingId+"  ooooooooooooooooooooooooooooooooooooooooo    "+ listingId);

              //The seller is the author
              //We need to look for the Influencer name in the Agreement 
             
              res.push(
                agreements[key]
              );
            }
            
  
        }catch(error){}
       
      });
      return res;
    };


    //AlternateListing is the listing that will be use by Influencer to accept payment from Sellers 
    //When the Seller is the author of the listing
    const getAlternatListingId = (agreements,agreementToCheckListingId) => {
  
      if(agreements === undefined || agreements === null)return[];
      const res = "";
      const keys = Object?.keys(agreements);
      keys.forEach(key => {
        
        try{
            if(parseInt(agreements[0]) !== undefined && agreements[key].listingId !== agreementToCheckListingId){
              
              //console.log(obj[key].listingId+"  ooooooooooooooooooooooooooooooooooooooooo    "+ listingId);

              //The seller is the author
              //We need to look for the Influencer name in the Agreement 
             
              res = agreements[key].listingId;
            }
            
  
        }catch(error){}
       
      });
      return res;
    };


   

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


    
      useEffect(()=>{
        const completionDurationValue = getDuration(duration);
        const current = new Date();
        setStartDate(current);
        
        current.setDate(current.getDate()+parseInt(completionDurationValue));
        const dueDateVal = current.toDateString();
        setDueDate(dueDateVal);

         //Check if agreement has already been sent for this listing
         alreadySentAgreement = getAgreement(agreements,listingId);

          if(alreadySentAgreement.length > 0 && alreadySentAgreement !== undefined && alreadySentAgreement !== null ){
            setAgreementAlreadyExist(true);
            setAgreementAccepted(alreadySentAgreement[0].agreementAccepted);
            setAgreementCancel(alreadySentAgreement[0].agreementCancel);
            setFrom(alreadySentAgreement[0].from);

            console.log(alreadySentAgreement[0].from +"qqqqqqqqq-------------------------------------")
          }
          
          else{
            setAgreementAlreadyExist(false);
          }

          if(alreadySentAgreement.length > 0 && !agreementAlreadyExist && role === "Seller"){
            setShowAgreement(alreadySentAgreement[0]?.showAgreement);
          }else if(alreadySentAgreement.length === 0 && role === "Seller"){
            setShowAgreement(true);
          }

          setAlternatListingId(getAlternatListingId(agreements,listingId));

      },[]);

    const handleSendAgree = (event,partyA,partyB,listgId,description)=>{

      if(description === undefined){
        description = listingDescription;
      }
        //setShowAcceptBtn(!showAcceptBtn);
        setShowAgreementSentSuccess(true);
        const sig = sellerId+influencerId+listingId;
        const sellerIsAuthor = role==="Influencer"?true:false;

        //Add the listing image before sending
        const tempListingPublicData = listing.attributes.publicData;
        tempListingPublicData.image = listingPhoto;
        const data = {
          sellerIsAuthor:sellerIsAuthor,
          sig:sig,
          sellerId: new UUID(sellerId),
          influencerId: new UUID(influencerId),
          listingId:listingId,
          duration:duration,
          agreementAccepted:false,
          agreementCancel:false,
          price:cost,
          description:description,
          publicData:tempListingPublicData,
          from:currentUser.id.uuid,
          role:role,
          listingPhoto:listingPhoto
       };

       //Create a copy of the original listing
        onAgree(data);
        
    }

    const handleAcceptAgree = (event,partyA,partyB,listgId,description)=>{
        setShowAcceptBtn(!showAcceptBtn);
        const sig = partyA+partyB+listgId;
       const data = {
        sig:sig,
        sellerId:partyA,
        influencerId:partyB,
        listingId:listgId,
        duration:duration,
        startDate:startDate,
        dueDate:dueDate,
        agreementAccepted:true,
        agreementCancel:false

       };
        onAccept(data);
       
    }

    const handleCancel = ()=>{
        const sig = sellerId+influencerId+listingId;
        const data = {
            sig:sig,
            sellerId:sellerId,
            influencerId:influencerId,
            listingId:listingId,
            startDate:startDate,
            dueDate:dueDate,
            agreementAccepted:false,
            agreementCancel:true
           };
        onCancel(data);
    }
    
   

    console.log(agreementAlreadyExist +"-------------------agreementAlreadyExist------------------------");
    console.log(showAgreement +"-------------------showAgreement------------------------");
    console.log(agreementAccepted +"-------------------agreementAccepted------------------------");
    console.log(alreadySentAgreement.length +"-------------------alreadySentAgreement------------------------");

    const agreementExist = agreements !== undefined && agreements !== null;
    console.log(agreementExist +"        -------------------agreementExist------------------------");


    const isSender = currentUser.id.uuid === from;




  return (
    <>

    {!agreementAlreadyExist && !isOwnListing?
    
        <div className={css.container}>
            <div className={css.content}>
                <br/>
                <h4>Proposal Agreement <br/>between</h4><br/>
                
                <img className={css.fit} src={listingPhoto}/>
                <h3>
                    {influencerName}<br/>
                    <img className={css.roundImg} src={influencerProfilePhoto}/>
                    <br/> <br/>& <br/><br/>
                    {authorName} <br/>
                    <img className={css.roundImg} src={authorProfilePhoto}/>
                </h3>

                {!showAgreementSentSuccess?
                    <div>
                        This is an agreement to start working on project: <br/>
                        <b>{listingDescription}</b><br/>
                        
                        To send, please click the "Send Agreement" button below.
                    </div>:""
                }

                
                {showAgreementSentSuccess?
                    <p><h4>Congratulations. Agreement was sent succcessfully!</h4><br/>
                        You will be notified when the Sellers has accepted the Agreement to start working.
                    </p>
                 :""
                }
               
                    {alreadySentAgreement.length > 0 && role==="Influencer"?
                    "": 
                        (
                            (!agreementAccepted && agreementAlreadyExist) ?
                            <button className={css.acceptBtn} onClick={handleAcceptAgree}>Accept Agreement <FontAwesomeIcon className={css.loaderIcon} icon={faSpinner}/></button>
                            :
                            <input type="button" className={css.acceptBtn} onClick={handleSendAgree} value="Send Agreement"/>
                            
                        ) 
                    }
                
            </div>
            
        
        </div>:""
        
        
    }


{agreementExist? 

Object.keys(agreements).map((val,key)=>{
  // if(agreements[key].listgId !== listing.id.uuid){

  //   if(role === "Seller"){
  //     return "";
  //   }else{}
    
  // }
  return(
    <div key={key} className={css.container}>
      <div className={css.content}>
          <br/>
          <h4>Proposal Agreement <br/>between</h4><br/>
          <img className={css.fit} src={agreements[key].listingPhoto}/>
          <h3>
              {agreements[key].partyAName}<br/>
              <img className={css.roundImg} src={agreements[key].partyAProfileImage}/>
              <br/> <br/>& <br/><br/>
              {agreements[key].partyBName} <br/>
              <img className={css.roundImg} src={agreements[key].partyBProfileImage}/>
          </h3>

          {!showAgreementSentSuccess?
              <div>
                  This is an agreement to start working on project: <br/>
                  {agreements[key].description}<br/>
                  
                  To agree, please click the "Agree" button below.
              </div>:""
          }

          
          
          {showAgreementSentSuccess?
              <p><h4>Congratulations. Agreement was sent succcessfully!</h4><br/>
                  You will be notified when the Sellers has accepted the Agreement to start working.
              </p>
          :""
          }
        


          {!isSender?
            (agreements[key].agreementAccepted === false ?
              <input type="button" className={css.acceptBtn}  onClick={  event => handleAcceptAgree(event, agreements[key].partyA,agreements[key].partyB,agreements[key].listingId,agreements[key].description)} value="Accept Agreement"/>
            :
                showAcceptBtn && agreements[key].agreementAccepted === true? ""
            :
                <input type="button" className={css.acceptBtn}  onClick={  event =>handleSendAgree (event, agreements[key].partyA,agreements[key].partyB,agreements[key].listingId,agreements[key].description)} value="Send Agreement"/>
            )
          :""}
          
          {!agreements[key].agreementAccepted?"":
          
          <div className={css.container}>
           <div className={css.contentSent}>
             <h4>Proposal Accepted.</h4>
           </div>
            
         </div>}
          
      </div>
      
  
  </div>
  )
    
})

:""}



    </>
  );
};


export default AgreementForm;
