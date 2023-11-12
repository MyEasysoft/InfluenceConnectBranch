import React, { useEffect, useState } from 'react';
import w1 from '../../assets/cover1.png';
import cancel from '../../assets/new/cancel.png';
import mark from '../../assets/new/mark.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faHeart, faSignIn, faEnvelope, faCancel} from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames';
import css from './ListingPaymentListItems.module.css';


function ListingItemComponent(props){

    const [showAgreementDialog, setShowAgreementDialog] = useState(false);
    const [showCompletedIcon, setShowCompletedIcon] = useState(false);
    const [currentSelectedId, setCurrentSelectedId] = useState("");
    const [currentSelectedDescription, setCurrentSelectedDescription] = useState("");
    const [currentSelectedSellerId, setCurrentSelectedSellerId] = useState("");
    const [currentSelectedAuthorId, setCurrentSelectedAuthorId] = useState("");

    const {onUpdateListingReceived,currentUser} = props;

    const handleShowAgreeDialog = (event,id,des,authorId)=>{

      setShowAgreementDialog(!showAgreementDialog);
      setCurrentSelectedId(id);
      setCurrentSelectedDescription(des);
      setCurrentSelectedAuthorId(authorId);
      console.log("Clicked    ssssssssssssssssssssssssssssssssssss    " +id+"   "+ des);
      
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


    const {
        listingPaidFor,
        getAuthorListing,
        getListing,
        getUserById,
       
        } = props;
    const hasListingPiadFor = listingPaidFor !== undefined && listingPaidFor !== null;
    if(!hasListingPiadFor)return "";

    const agreementDialog = showAgreementDialog? 
    <div className={css.modal}>
        <p>By clicking Accept button below, you agree that this project has been completed successfully.</p>
        <h3 className={css.description}>Listing Description:{" "+currentSelectedDescription}</h3> 
      
        <button onClick={handleAccept} class={css.acceptBtn}>Accept</button>
        <button onClick={handleReject} class={css.rejectBtn}>Close</button>
    </div>:"";
    
  return (
   
    <>
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
                    return (
                        <tr key={key}>
                            
                            <td><img className={css.product} src={listingPaidFor[key].listingPhoto}/></td>
                            <td>{listingPaidFor[key].description}</td>
                            <td>01-01-2023</td>
                            <td>Pending</td>
                           
                            <td>01-02-2023</td>
                            <td>01-03-2023</td>
                            <td><img className={css.roundImg} src={listingPaidFor[key].authorPhoto || listingPaidFor[key].buyerPhoto}/>{listingPaidFor[key]?.authorName || listingPaidFor[key]?.buyerName}</td>
                            <td>${listingPaidFor[key]?.amountPaid?.value || listingPaidFor[key]?.amountReceived?.value}</td>
                            <td><button  onClick={  event => handleShowAgreeDialog(event, listingPaidFor[key].listingId,listingPaidFor[key].description,listingPaidFor[key].authorId)} className={css.accept}><img className={css.status} src={showCompletedIcon?mark:cancel}/></button></td>
                            
                        </tr>
                    )
                })}
            </table>
       
    </>
           
           
		

	

    
  );
};




export default ListingItemComponent;
