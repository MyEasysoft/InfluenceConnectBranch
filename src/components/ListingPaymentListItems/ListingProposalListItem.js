import React, { useEffect, useState } from 'react';
import w1 from '../../assets/cover1.png';
import cancel from '../../assets/new/cancel.png';
import mark from '../../assets/new/mark.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faHeart, faSignIn, faEnvelope, faCancel} from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames';
import css from './ListingPaymentListItems.module.css';


function ListingProposalItemComponent(props){

    const [showAgreementDialog, setShowAgreementDialog] = useState(false);
    const [showCompletedIcon, setShowCompletedIcon] = useState(false);
    const [currentSelectedId, setCurrentSelectedId] = useState("");
    const [currentSelectedDescription, setCurrentSelectedDescription] = useState("");
    const [currentSelectedSellerId, setCurrentSelectedSellerId] = useState("");
    const [currentSelectedAuthorId, setCurrentSelectedAuthorId] = useState("");

    const {
        onUpdateListingReceived,
        currentUser,
        enableAcceptBtn
    } = props;

    const handleShowAgreeDialog = (event,id,des,authorId)=>{

      setShowAgreementDialog(!showAgreementDialog);
      setCurrentSelectedId(id);
      setCurrentSelectedDescription(des);
      setCurrentSelectedAuthorId(authorId);
      setShowCompletedIcon(true);
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
        Agreements,
        getAuthorListing,
        getListing,
        getUserById,
       
        } = props;
    const hasListingPiadFor = Agreements !== undefined && Agreements !== null;
    if(!hasListingPiadFor)return "";

    const agreementDialog = showAgreementDialog? 
    <div className={css.modal}>
        <p>By clicking Accept button below, you agree that this project has been completed successfully.</p>
        <h4 className={css.description}>Listing Description:{" "+currentSelectedDescription}</h4> 
      
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
                    
                    <th>Influencer</th>
                    <th>Amount Paid</th>
                    
                </tr>
                {Object.keys(Agreements).map((val, key) => {
                    const completed = Agreements[key].status;
                    const showMark = completed==="Completed";
                    let d = new Date(Agreements[key].deliveryDate);
                    const deliveryDate = d.toDateString();
                    return (
                        <tr key={key}>
                            
                            <td><img className={css.product} src={Agreements[key].listingPhoto}/></td>
                            <td>{Agreements[key].description}</td>
                            <td>{deliveryDate}</td>
                            <td>{Agreements[key].status}</td>
                           
                            <td>{Agreements[key].dueDate}</td>
                           
                            <td><img className={css.roundImg} src={Agreements[key].authorPhoto || Agreements[key].buyerPhoto}/>{Agreements[key]?.authorName || Agreements[key]?.buyerName}</td>
                            <td><b className={css.amount}>${Agreements[key]?.amount?.value}</b></td>

                           

                            
                        </tr>
                    )
                })}
            </table>
       
    </>
           
           
		

	

    
  );
};




export default ListingProposalItemComponent;
