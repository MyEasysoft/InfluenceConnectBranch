import React, { useEffect, useState } from 'react';
import w1 from '../../assets/cover1.png';
import cancel from '../../assets/new/cancel.png';
import mark from '../../assets/new/mark.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faHeart, faSignIn, faEnvelope, faCancel} from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames';
import css from './ListingPaymentListItems.module.css';
import { FieldRadioButton } from '..';
import { Form } from 'react-final-form';


function ListingItemComponent(props){
    
    const [showAgreementDialog, setShowAgreementDialog] = useState(false);
    const [showCompletedIcon, setShowCompletedIcon] = useState(false);
    const [currentSelectedId, setCurrentSelectedId] = useState("");
    const [currentSelectedDescription, setCurrentSelectedDescription] = useState("");
    const [currentSelectedSellerId, setCurrentSelectedSellerId] = useState("");
    const [currentSelectedAuthorId, setCurrentSelectedAuthorId] = useState("");
    const [showReviewDialog, setShowReviewDialog] = useState(false);
    const [reviewDescription, setReviewDescription] = useState("");
    const [currentSelectedCompleted, setCurrentSelectedCompleted] = useState(false);
    const [review, setReview] = useState("");
    const [rating, setRating] = useState("");
    const [currentListing, setCurrentListing] = useState({});
    const [currentUserInfo, setCurrentUserInfo] = useState({});
    
    const {
        onUpdateListingReceived,
        currentUser,
        enableAcceptBtn,
        listingPaidFor,
        getAuthorListing,
        getListing,
        getUserById,
        showReview, 
        onSendReview,
    } = props;

    useEffect(()=>{
        setCurrentUserInfo(currentUser);
    },[])

    const role = currentUser.attributes.profile.protectedData.role;

    const handleShowAgreeDialog = (event,id,des,authorId,status)=>{
      setShowAgreementDialog(!showAgreementDialog);
      setCurrentSelectedId(id);
      setCurrentSelectedDescription(des);
      setCurrentSelectedAuthorId(authorId);
      setShowCompletedIcon(true);
      console.log("Clicked    ssssssssssssssssssssssssssssssssssss    " +id+"   "+ des);
    }

    const handleSubmit = (values)=>{

        if(role === "Seller"){
            onSendReview({
                sellerId:currentUserInfo.id.uuid,
                influencerId:currentListing.authorId,
                listingId:currentListing.listingId,
                review:review,
                rating:rating
            });
        }else{
            onSendReview({
                sellerId:currentListing.buyerId,
                influencerId:currentUserInfo.id.uuid,
                listingId:currentListing.listingId,
                review:review,
                rating:rating
            });
        }


        
    }

    const handleShowReview = (event,data,des,status,id,authorId)=>{
        //if(status === "Completed"){
            setShowReviewDialog(true);
        //}
        // setCurrentSelectedId(id);
        // setCurrentSelectedAuthorId(authorId);
        // setReviewDescription(des);
        setCurrentListing(data);

       
    }

    const     closeDialog = ()=>{
        setShowReviewDialog(false);
    }

    
    const handleChange = (event)=>{
       setReview(event.target.value);
    }

    const HandleChangeRating = (event)=>{
        setRating(event.target.value);
     }
  
    const handleAccept = ()=>{
        setShowAgreementDialog(false);
        //Update the listing to received
        onUpdateListingReceived({
            sellerId:currentUser.id.uuid,
            authorId:currentSelectedAuthorId,
            listingId:currentSelectedId
        })

    }
  
    const handleReject = ()=>{
      setShowAgreementDialog(false);
    }
    const[projectAuthors, setProjectAuthors] = useState([]);

    const hasListingPiadFor = listingPaidFor !== undefined && listingPaidFor !== null;
    if(!hasListingPiadFor)return "";


    //
    const agreementDialog = showAgreementDialog? 
    <div className={css.modal}>
        <h2>Project Completion Acceptance</h2>
        <p>By clicking Accept button below, you agree that this project has been completed successfully.</p>
        <h4 className={classNames(css.description,css.marginB) }>Listing Description:{" "+currentSelectedDescription}</h4> <br/>
      
        <button onClick={handleAccept} class={css.acceptBtn}>Accept</button>
        <button onClick={handleReject} class={css.rejectBtn}>Close</button>
    </div>:"";


    const reviewDialog = showReviewDialog? 

        <div className={css.formContainer} >
            <h2>Review</h2>
            <h4>description:{reviewDescription}</h4>
            <p>
                Please leave a review about your experience on this project below.
            </p>
        <input onChange={handleChange} className={css.textInput} type="text" placeholder='What was your experience like'  value={review}/>
        <div className={css.formRadio}  onChange={HandleChangeRating}>
            <div className={css.formItems}>
                <input className={css.radioBtn} type='radio' value="Bad" name="rating"/>Bad
            </div>
            <div className={css.formItems}>
                <input className={css.radioBtn} type='radio' value="Fair" name="rating"/>Fair
            </div>
            <div className={css.formItems}>
                <input className={css.radioBtn} type='radio' value="Good" name="rating"/>Good
            </div>
            <div className={css.formItems}>
                <input className={css.radioBtn} type='radio' value="Very good" name="rating"/>Very good
            </div>
            <div className={css.formItems}>
                <input className={css.radioBtn} type='radio' value="Excellent" name="rating"/>Excellent
            </div>
             
        </div>

       <div>
            
            <button onClick={handleSubmit} class={css.acceptBtn}>Submit Review</button>
            <button onClick={closeDialog} class={css.rejectBtn}>Close</button>
       </div>
        
        </div>
    
    
   :"";
    
  return (
   
    <>
            {reviewDialog}
            {agreementDialog}
            <table className={css.tbContainer}>
                <tr>
                    <th class={css.product}>Product</th>
                    <th>Product Name</th>
                    <th>Delivery Date</th>
                    <th>Status</th>
                    
                    <th>Due Date</th>
                    <th>Submission Date</th>
                    <th>Influencer</th>
                    <th>Amount Paid</th>
                    <th>Received</th>
                </tr>
                {Object.keys(listingPaidFor).map((val, key) => {
                    const completed = listingPaidFor[key].status;
                    const showMark = completed==="Completed";
                    let d = new Date(listingPaidFor[key].deliveryDate);
                    const deliveryDate = d.toDateString();
                    return (
                        <tr key={key}>
                            
                            <td><img className={css.product} src={listingPaidFor[key].listingPhoto}/></td>
                            <td>{listingPaidFor[key].description}</td>
                            <td>{deliveryDate}</td>
                            <td>{listingPaidFor[key].status}</td>
                           
                            <td>{listingPaidFor[key].dueDate}</td>
                            <td>{listingPaidFor[key].submissionDate}</td>
                            <td><button className={css.profileImg} onClick={event => handleShowReview(event, listingPaidFor[key]) }><img className={css.roundImg} src={listingPaidFor[key].authorPhoto || listingPaidFor[key].buyerPhoto}/>{listingPaidFor[key]?.authorName || listingPaidFor[key]?.buyerName}</button></td>
                            <td><b className={css.amount}>${listingPaidFor[key]?.amount?.value}</b></td>

                            {enableAcceptBtn?
                                <td><button  onClick={  event => handleShowAgreeDialog(event, listingPaidFor[key].listingId,listingPaidFor[key].description,listingPaidFor[key].authorId)} className={css.accept}><img className={css.status} src={showMark?mark:cancel}/></button></td>   
                                :
                                <td><button className={css.accept}><img className={css.status} src={showMark?mark:cancel}/></button></td>
                            }
 
                            
                        </tr>
                    )
                })}
            </table>
       
    </>
           
           
		

	

    
  );
};




export default ListingItemComponent;
