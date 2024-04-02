import React, { useEffect, useRef, useState } from 'react';
import css from './AgreementForm.module.css';
import { types as sdkTypes } from '../../../src/util/sdkLoader';
import w1 from '../../assets/cover1.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faHeart, faSignIn, faEnvelope, faSpinner, faCheck} from '@fortawesome/free-solid-svg-icons';
import { InlineTextButton } from '../Button/Button';
import { Field, Form } from 'react-final-form';
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
    const [selectedActionData, setSelectedActionData] = useState({});
    const submit1 = useRef(null);
    const submit2 = useRef(null);
    const submit3 = useRef(null);
    const submit4 = useRef(null);
    const submit5 = useRef(null);
    const submit6 = useRef(null);
    const submit7 = useRef(null);
    
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
        listingPhoto,
        onSendProductDeliveryAddress,
        onAcceptProductDeliveryAddress,
        onSendProductToAddress,
        onConfirmProductReceipt,
        onSendVideoUrl,
        onConfirmVideoUrlReciept,
        onAcceptProduct,
        onProjectClosure,
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
    

    const agreementExist = agreements !== undefined && agreements !== null;
    
    const isSender = currentUser.id.uuid === from;

const onSubmit1 = (values)=>{
  console.log(selectedActionData +"      zzzzzzzzzzzzzzzzzzzzzz");
  Object.assign(selectedActionData,values);
  console.log(selectedActionData +"      zzzzzzzzzzzzzzzzzzzzzz");
  onSendProductDeliveryAddress(selectedActionData);
}

const onSubmit2 = (values)=>{
  console.log(selectedActionData +"      zzzzzzzzzzzzzzzzzzzzzz");
  Object.assign(selectedActionData,values);
  console.log(selectedActionData +"      zzzzzzzzzzzzzzzzzzzzzz");
  onAcceptProductDeliveryAddress(selectedActionData);
}

const onSubmit3 = (values)=>{
  console.log(selectedActionData +"      zzzzzzzzzzzzzzzzzzzzzz");
  Object.assign(selectedActionData,values);
  console.log(selectedActionData +"      zzzzzzzzzzzzzzzzzzzzzz");
  onSendProductToAddress(selectedActionData);
}

const onSubmit4 = (values)=>{
  console.log(selectedActionData +"      zzzzzzzzzzzzzzzzzzzzzz");
  Object.assign(selectedActionData,values);
  console.log(selectedActionData +"      zzzzzzzzzzzzzzzzzzzzzz");
  onConfirmProductReceipt(selectedActionData);
}

const onSubmit5 = (values)=>{
  console.log(selectedActionData +"      zzzzzzzzzzzzzzzzzzzzzz");
  Object.assign(selectedActionData,values);
  console.log(selectedActionData +"      zzzzzzzzzzzzzzzzzzzzzz");
  onSendVideoUrl(selectedActionData);
}

const onSubmit6 = (values)=>{
  console.log(selectedActionData +"      zzzzzzzzzzzzzzzzzzzzzz");
  Object.assign(selectedActionData,values);
  console.log(selectedActionData +"      zzzzzzzzzzzzzzzzzzzzzz");
  onConfirmVideoUrlReciept(selectedActionData);
}

const onSubmit7 = (values)=>{
  console.log(selectedActionData +"      zzzzzzzzzzzzzzzzzzzzzz");
  Object.assign(selectedActionData,values);
  console.log(selectedActionData +"      zzzzzzzzzzzzzzzzzzzzzz");
  onAcceptProduct(selectedActionData);
}

const onSubmit8 = (values)=>{
  console.log(selectedActionData +"      zzzzzzzzzzzzzzzzzzzzzz");
  Object.assign(selectedActionData,values);
  console.log(selectedActionData +"      zzzzzzzzzzzzzzzzzzzzzz");
  onProjectClosure(selectedActionData);
}

const handleSelectUserAction = (event,partyA,partyB,listgId,sig)=>{
  event.preventDefault
  
  console.log("clickedpartyA ---------------------------------- " +partyA );
  console.log("clickedpartyB ---------------------------------- " +partyB );
  console.log("clickedlistgId ---------------------------------- " +listgId );
  console.log("clickedsig ---------------------------------- " +sig );

  const data = {
    sig:sig,
    sellerId:partyA,
    influencerId:partyB,
    listingId:listgId,
   };
   setSelectedActionData(data);
}

const handleSendProductDeliveryAddress = (event,partyA,partyB,listgId,sig)=>{/////////
  event.preventDefault
  
  console.log("clickedpartyA ---------------------------------- " +partyA );
  console.log("clickedpartyB ---------------------------------- " +partyB );
  console.log("clickedlistgId ---------------------------------- " +listgId );
  console.log("clickedsig ---------------------------------- " +sig );

  const data = {
    sig:sig,
    sellerId:partyA,
    influencerId:partyB,
    listingId:listgId,
   };
   setSelectedActionData(data);
   submit1.current.click();
}

const handleAcceptProductDeliveryAddress = (event,partyA,partyB,listgId,sig)=>{/////////
  
  console.log("clickedpartyA ---------------------------------- " +partyA );
  console.log("clickedpartyB ---------------------------------- " +partyB );
  console.log("clickedlistgId ---------------------------------- " +listgId );
  console.log("clickedsig ---------------------------------- " +sig );

  const data = {
    sig:sig,
    sellerId:partyA,
    influencerId:partyB,
    listingId:listgId,
   };
   setSelectedActionData(data);
   submit2.current.click();
}

const handleSendProductToAddress = (event,partyA,partyB,listgId,sig)=>{///////////////
  
  console.log("clickedpartyA ---------------------------------- " +partyA );
  console.log("clickedpartyB ---------------------------------- " +partyB );
  console.log("clickedlistgId ---------------------------------- " +listgId );
  console.log("clickedsig ---------------------------------- " +sig );

  const data = {
    sig:sig,
    sellerId:partyA,
    influencerId:partyB,
    listingId:listgId,
   };
   setSelectedActionData(data);
   submit3.current.click();
}

const handleConfirmProductReceipt = (event,partyA,partyB,listgId,sig)=>{//////////////
  
  console.log("clickedpartyA ---------------------------------- " +partyA );
  console.log("clickedpartyB ---------------------------------- " +partyB );
  console.log("clickedlistgId ---------------------------------- " +listgId );
  console.log("clickedsig ---------------------------------- " +sig );

  const data = {
    sig:sig,
    sellerId:partyA,
    influencerId:partyB,
    listingId:listgId,
   
   };
   setSelectedActionData(data);
   submit4.current.click();
}

const handleSendVideoUrl = (event,partyA,partyB,listgId,sig)=>{//productVideoUrl///////////////
  
  console.log("clickedpartyA ---------------------------------- " +partyA );
  console.log("clickedpartyB ---------------------------------- " +partyB );
  console.log("clickedlistgId ---------------------------------- " +listgId );
  console.log("clickedsig ---------------------------------- " +sig );

  const data = {
    sig:sig,
    sellerId:partyA,
    influencerId:partyB,
    listingId:listgId,
   
   };
   setSelectedActionData(data);
   submit5.current.click();
}

const handleConfirmVideoUrlReciept = (event,partyA,partyB,listgId,sig)=>{////////////////
  
  console.log("clickedpartyA ---------------------------------- " +partyA );
  console.log("clickedpartyB ---------------------------------- " +partyB );
  console.log("clickedlistgId ---------------------------------- " +listgId );
  console.log("clickedsig ---------------------------------- " +sig );

  const data = {
    sig:sig,
    sellerId:partyA,
    influencerId:partyB,
    listingId:listgId,
   
   };
   setSelectedActionData(data);
   submit6.current.click();
}

const handleAcceptProduct = (event,partyA,partyB,listgId,sig)=>{////////////////
  
  console.log("clickedpartyA ---------------------------------- " +partyA );
  console.log("clickedpartyB ---------------------------------- " +partyB );
  console.log("clickedlistgId ---------------------------------- " +listgId );
  console.log("clickedsig ---------------------------------- " +sig );

  const data = {
    sig:sig,
    sellerId:partyA,
    influencerId:partyB,
    listingId:listgId,
   
   };
   setSelectedActionData(data);
   submit7.current.click();
}

const SendProductDeliveryAddressForm = (props) => (
  <Form
    onSubmit={onSubmit1}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit} className={css.flow_form}>
        <Field
          name="productDeliveryAddress"
          render={({ input, meta }) => (
            <div>
              <label>Send Product delivery address</label>
              <textarea {...input} />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        />
        <button type="button" onClick={event =>handleSendProductDeliveryAddress (event, props.data.partyA,props.data.partyB,props.data.listingId,props.data.sig)} >Send product delivery address</button>
        <input  ref={submit1} type="submit" value="Send product delivery address" hidden/>
      </form>
    )}
  />
);

const AcceptProductDeliveryAddressForm = (props) => (
  <Form
    onSubmit={onSubmit2}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit} className={css.flow_form}>

        <p></p>
        
        <Field
          name="acceptProductDeliveryAddress"
          render={({ input, meta }) => (
            <div>
              <label>Accept Product delivery address</label>
              <textarea {...input} value={props.data.productDeliveryAddress} disabled/>
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        />
        <button  type="button" onClick={event =>handleAcceptProductDeliveryAddress (event, props.data.partyA,props.data.partyB,props.data.listingId,props.data.sig)} >Accept product delivery address</button>
        <input  ref={submit2} type="submit" value="Accept product delivery address" hidden/>
      
      </form>
    )}
  />
);


const SendProductToAddress = (props) => (
  <Form
    onSubmit={onSubmit3}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit} className={css.flow_form}>
        <Field
          name="sendProductToAddress"
          render={({ input, meta }) => (
            <div>
              <label>Please type the word "Product Sent" to show you have sent the product. Then click the "Product Sent" button</label>
              <input type="text" {...input} />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        />
        <button onClick={event =>handleSendProductToAddress (event, props.data.partyA,props.data.partyB,props.data.listingId,props.data.sig)} type="button">Product Sent</button>
        <button  ref={submit3} type="submit" hidden>Send product delivery address</button>
      </form>
    )}
  />
);


const ConfirmProductReceipt = (props) => (
  <Form
    onSubmit={onSubmit4}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit} className={css.flow_form}>
        <Field
          name="confirmProductReceipt"
          render={({ input, meta }) => (
            <div>
              <label>Please type the word "Product Recieved" to show you have recieved the product. Then click the "Product Recieve" button</label>
              <input type="text" {...input} />
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        />
        <button onClick={event =>handleConfirmProductReceipt (event, props.data.partyA,props.data.partyB,props.data.listingId,props.data.sig)} type="button">Product Recieved</button>
        <button  ref={submit4} type="submit" hidden>Send product delivery address</button>
      </form>
    )}
  />
);

const SendVideoUrl = (props) => (
  <Form
    onSubmit={onSubmit5}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit} className={css.flow_form}>
        <Field
          name="productVideoUrl"
          render={({ input, meta }) => (
            <div>
              <label>Please type the video Url in the box below</label>
              <input type="text" {...input} placeholder='Product Video Url'/>
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        />
        <button onClick={event =>handleSendVideoUrl (event, props.data.partyA,props.data.partyB,props.data.listingId,props.data.sig)} type="button">Send Url</button>
        <button  ref={submit5} type="submit" hidden>Send product delivery address</button>
      </form>
    )}
  />
);

const ConfirmVideoUrlReciept = (props) => (
  <Form
    onSubmit={onSubmit6}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit} className={css.flow_form}>
        
        <Field
          name="confirmVideoUrlReciept"
          render={({ input, meta }) => (
            <div>
              <label>To show that you have recieved the video url, please click the "Url recieved" button below</label>
              <input type="text" {...input} value={props.data.productVideoUrl} disabled/>
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        />
        <button onClick={event =>handleConfirmVideoUrlReciept (event, props.data.partyA,props.data.partyB,props.data.listingId,props.data.sig)} type="button">Url Recieved</button>
        <button  ref={submit6} type="submit" hidden>Send product delivery address</button>
      </form>
    )}
  />
);

const AcceptProduct = (props) => (
  <Form
    
    onSubmit={onSubmit7}
    render={({ handleSubmit }) => (
      <form onSubmit={handleSubmit} className={css.flow_form}>
        <Field
          name="acceptProduct"
          render={({ input, meta }) => (
            <div>
              <label>Please type the word "Accepted" in the box below, to show you are satisfied with the product, and click the "Accept Product" button</label>
              <input type="text" {...input}/>
              {meta.touched && meta.error && <span>{meta.error}</span>}
            </div>
          )}
        />
        <button onClick={event =>handleAcceptProduct (event, props.data.partyA,props.data.partyB,props.data.listingId,props.data.sig)} type="button">Accept Product</button>
        <button  ref={submit7} type="submit" hidden>Send product delivery address</button>
      </form>
    )}
  />
);

const ProcessFlows = (props) => {
  console.log(props.data.SendProductDeliveryAddressForm +"    ==============xxxxxxxxxxxxxx");
  return(
    <div className={css.processFlow}>
      {props.data.status1SendProductDeliveryAddressForm?<button>Address sent<span><FontAwesomeIcon icon={faCheck} /></span></button>:""}
      {props.data.status2AcceptProductDeliveryAddressForm?<button>Address accepted<span><FontAwesomeIcon icon={faCheck} /></span></button>:""}
      {props.data.status3SendProductToAddress?<button>Product sent<span><FontAwesomeIcon icon={faCheck} /></span></button>:""}
      {props.data.status4ConfirmProductReceipt?<button>Product Recieved<span><FontAwesomeIcon icon={faCheck} /></span></button>:""}
      {props.data.status5SendVideoUrl?<button>Video url sent<span><FontAwesomeIcon icon={faCheck} /></span></button>:""}
      {props.data.status6ConfirmVideoUrlReciept?<button>Video url recieved<span><FontAwesomeIcon icon={faCheck} /></span></button>:""}
      {props.data.status7AcceptProduct?<button>Video accepted<span><FontAwesomeIcon icon={faCheck} /></span></button>:""}
      {props.data.status8ProjectClosure?<button>Project closed!<span><FontAwesomeIcon icon={faCheck} /></span></button>:""}
    </div>
  )
};

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
  console.log(agreements[key].status0NextStatus + "       nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
  console.log(agreements[key].SendProductDeliveryAddressForm + "       SendProductDeliveryAddressForm");

  const props = agreements[key];
  return(
    <div key={key} className={css.container}>
      <div className={css.content} onMouseEnter={event =>handleSelectUserAction (event, props.partyA,props.partyB,props.listingId,props.sig)}>
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


         
        {role==="Seller" || role === "Influencer"?
          <ProcessFlows data={agreements[key]}/>:""
        }

        {role==="Influencer" && agreements[key].status0NextStatus === "SendProductDeliveryAddressForm"?
          <SendProductDeliveryAddressForm data={agreements[key]}/>:""
        }

        {role==="Seller" && agreements[key].status0NextStatus === "AcceptProductDeliveryAddressForm"?
          <AcceptProductDeliveryAddressForm data={agreements[key]}/>:""
        }

        {role==="Seller" && agreements[key].status0NextStatus === "SendProductToAddress"?
          <SendProductToAddress data={agreements[key]}/>:""
        }

        {role==="Influencer" && agreements[key].status0NextStatus === "ConfirmProductReceipt"?
          <ConfirmProductReceipt data={agreements[key]}/>:""
        }

        {role==="Influencer" && agreements[key].status0NextStatus === "SendVideoUrl"?
          <SendVideoUrl data={agreements[key]}/>:""
        }

        {role==="Seller" && agreements[key].status0NextStatus === "ConfirmVideoUrlReciept"?
          <ConfirmVideoUrlReciept data={agreements[key]}/>:""
        }
         
        {role==="Seller" && agreements[key].status0NextStatus === "AcceptProduct"?
          <AcceptProduct data={agreements[key]}/>:""
        }
         
        
        { agreements[key].status0NextStatus === "ProjectClosure"?
                      <div>
                        <p>Project closed</p>
                      </div>:""}

        
          
      </div>

  </div>
  )
    
})

:""}



    </>
  );
};


export default AgreementForm;
