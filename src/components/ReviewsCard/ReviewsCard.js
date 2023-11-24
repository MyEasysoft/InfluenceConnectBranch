import React, { useEffect, useState } from 'react';
import css from './ReviewsCard.module.css';

import w1 from '../../assets/cover1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faHeart, faSignIn, faEnvelope, faSpinner} from '@fortawesome/free-solid-svg-icons'


const ReviewsCard = (props)=>{
    const [showAcceptBtn, setShowAcceptBtn] = useState(true);
    const [startDate, setStartDate] = useState(true);
    const [dueDate, setDueDate] = useState(true);
    const [showAgreementSentSuccess, setShowAgreementSentSuccess] = useState(false);
    const [showAgreement, setShowAgreement] = useState(true);
    const [agreementAlreadyExist, setAgreementAlreadyExist] = useState(false);
    const [agreementAccepted, setAgreementAccepted] = useState(false);
    const [agreementCancel, setAgreementCancel] = useState(false);
    
    const{
        sellerId,
        influencerId,
        listingId,
        buyerName,
        buyerProfilePhoto,
        authorName,
        authorProfilePhoto,
        listingDescription,
        cost,
        duration,
        onAgree,
        onAccept,
        onCancel,
        agreements,
        role
    }= props;

    

    const getAgreement = (agreements,agreementToCheckListingId) => {
  
      if(agreements === undefined || agreements === null)return[];
      const res = [];
      const keys = Object?.keys(agreements);
      keys.forEach(key => {
        
        try{
            if(parseInt(agreements[0]) !== undefined && agreements[key].listingId === agreementToCheckListingId){
              
              //console.log(obj[key].listingId+"  ooooooooooooooooooooooooooooooooooooooooo    "+ listingId);
              res.push(
                agreements[key]
              );
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
          const alreadySentAgreement = getAgreement(agreements,listingId);

          if(alreadySentAgreement.length > 0 && alreadySentAgreement !== undefined && alreadySentAgreement !== null && role !=="Seller"){
            setAgreementAlreadyExist(true);
            setAgreementAccepted(alreadySentAgreement[0].agreementAccepted);
            setAgreementCancel(alreadySentAgreement[0].agreementCancel);
         
          }else if(alreadySentAgreement.length > 0 && alreadySentAgreement !== undefined && alreadySentAgreement !== null && role ==="Seller"){
            setAgreementAlreadyExist(true);
            setAgreementAccepted(alreadySentAgreement[0].agreementAccepted);
            setAgreementCancel(alreadySentAgreement[0].agreementCancel);
          }
          else{
            setAgreementAlreadyExist(false);
           
          }

          if(alreadySentAgreement.length > 0 && !agreementAlreadyExist && role === "Seller"){
            setShowAgreement(alreadySentAgreement[0]?.showAgreement);
          }


      },[]);

    const handleSendAgree = ()=>{
        setShowAcceptBtn(!showAcceptBtn);
        setShowAgreementSentSuccess(true);
        const data = {
        sellerId:sellerId,
        influencerId:influencerId,
        listingId:listingId,
        duration:duration,
        agreementAccepted:false,
        agreementCancel:false

       };
        onAgree(data);
        
    }

    const handleAcceptAgree = ()=>{
        setShowAcceptBtn(!showAcceptBtn);
       const data = {
        sellerId:sellerId,
        influencerId:influencerId,
        listingId:listingId,
        duration:duration,
        startDate:startDate,
        dueDate:dueDate,
        agreementAccepted:true,
        agreementCancel:false

       };
        onAccept(data);
       
    }

    const handleCancel = ()=>{
        const data = {
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

  return (
    <>

    {(showAgreement && role==="Influencer")||(!showAgreement && !agreementAlreadyExist && role === "Influencer")?
    
        <div className={css.container}>
            <div className={css.content}>
                <br/>
                <h4>Proposal Agreement <br/>between</h4><br/>
                <h3>
                    {buyerName}<br/>
                    <img className={css.roundImg} src={buyerProfilePhoto}/>
                    <br/> <br/>& <br/><br/>
                    {authorName} <br/>
                    <img className={css.roundImg} src={authorProfilePhoto}/>
                </h3>

                {!showAgreementSentSuccess?
                    <div>
                        This is an agreement to start working on project: <br/>
                        {listingDescription}<br/>
                        
                        To agree, please click the "Agree" button below.
                    </div>:""
                }

                
                
                {showAgreementSentSuccess?
                    <p><h4>Congratulations. Agreement was sent succcessfully!</h4><br/>
                        You will be notified when the Sellers has accepted the Agreement to start working.
                    </p>
                 :""
                }
               

                    {showAcceptBtn &&
                        (
                            (!agreementAccepted) && role === "Seller"?
                            <button className={css.acceptBtn} onClick={handleAcceptAgree}>Accept Agreement <FontAwesomeIcon className={css.loaderIcon} icon={faSpinner}/></button>
                            :
                            <button className={css.acceptBtn} onClick={handleSendAgree}>Send Agreement <FontAwesomeIcon className={css.loaderIcon} icon={faSpinner}/></button>
                            
                        ) }
               
                
                {!agreementCancel && <button className={css.rejectBtn} onClick={handleCancel}>Cancel Agreement</button>
                 }
                
                
            </div>
            
        
        </div>:""
        
        
    }

{showAgreement && role==="Seller"?
    
    <div className={css.container}>
        <div className={css.content}>
            <br/>
            <h4>Proposal Agreement <br/>between</h4><br/>
            <h3>
                {buyerName}<br/>
                <img className={css.roundImg} src={buyerProfilePhoto}/>
                <br/> <br/>& <br/><br/>
                {authorName} <br/>
                <img className={css.roundImg} src={authorProfilePhoto}/>
            </h3>

            {!showAgreementSentSuccess?
                <div>
                    This is an agreement to start working on project: <br/>
                    {listingDescription}<br/>
                    
                    To agree, please click the "Agree" button below.
                </div>:""
            }

            
            
            {showAgreementSentSuccess?
                <p><h4>Congratulations. Agreement was sent succcessfully!</h4><br/>
                    You will be notified when the Sellers has accepted the Agreement to start working.
                </p>
             :""
            }
           

                {showAcceptBtn &&
                    (
                        agreementAccepted?"":
                        <button className={css.acceptBtn} onClick={handleAcceptAgree}>Accept Agreement <FontAwesomeIcon className={css.loaderIcon} icon={faSpinner}/></button>
                       
                    ) }
           
            
            {!agreementCancel && <button className={css.rejectBtn} onClick={handleCancel}>Cancel Agreement</button>
             }
            
            
        </div>
        
    
    </div>:""
    
    
}

    {
     agreementAlreadyExist && role==="Influencer"?
      <div className={css.container}>
          <div className={css.contentSent}>
            <h4>You have already sent a Proposal Agreement for this Listing.</h4>
          </div>
           
        </div>:""
    }
    

    </>
  );
};


export default ReviewsCard;
