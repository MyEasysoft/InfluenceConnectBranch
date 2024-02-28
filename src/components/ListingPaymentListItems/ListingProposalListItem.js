import React, { useEffect, useState } from 'react';
import w1 from '../../assets/cover1.png';
import cancel from '../../assets/new/cancel.png';
import mark from '../../assets/new/mark.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMessage, faHeart, faSignIn, faEnvelope, faCancel} from '@fortawesome/free-solid-svg-icons'
import classNames from 'classnames';
import css from './ListingPaymentListItems.module.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


function ListingProposalItemComponent(props){
    const history = useHistory();
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

    console.log("Running 3333333333333333333333333333333333333333333333");

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
  

    const handleClicked = (id,des)=>{
      
       // history.push(`/order/${id}`);
       history.push(`/l/${des}/${id}`); 
                
        console.log("Clicked    " + id);
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

    const role = currentUser.attributes.profile.protectedData.role;
    
  return (
   
    <>
            {agreementDialog}
            <table className={css.tbContainer}>
                <tr>
                    <th class={css.product}>Product</th>
                    <th>Product Name</th>
                    <th>State Date</th>
                    <th>Status</th>
                    
                    <th>Due Date</th>
                    
                    <th>
                        {role==="Influencer"?"Seller":"Influencer"}
                        

                    </th>
                    <th>Price</th>
                    
                </tr>
                {Object.keys(Agreements).map((val, key) => {
                    const completed = Agreements[key].status;
                    const showMark = completed==="Completed";
                    let d = new Date(Agreements[key].startDate);
                    const startDate = d.toDateString();
                    console.log((currentUser.id.uuid ===  Agreements[key]?.partyA)+"             11111111111111111111111111111111111111111111111111111111111");
                    console.log((currentUser.id.uuid ===  Agreements[key]?.partyB)+"             22222222222222222222222222222222222222222222222222222222222");
                    const otherName = (currentUser.id.uuid ===  Agreements[key]?.partyA)? Agreements[key]?.partyBName  : Agreements[key]?.partyAName;
                    const sellerProfilePhoto = currentUser.id.uuid ===  Agreements[key]?.partyA? Agreements[key]?.partyBProfileImage  : Agreements[key]?.partyAProfileImage;
                    return (
                        <tr key={key}>
                            
                            <td><img className={css.product} src={Agreements[key].listingPhoto} onClick={handleClicked.bind( null,Agreements[key].listingId,Agreements[key].description)}/></td>
                            <td>{Agreements[key].description}</td>
                            <td>{startDate}</td>
                            <td><span className={css.statusTxt}>{Agreements[key].status}</span></td>
                           
                            <td>{Agreements[key].dueDate}</td>
                           
                            <td><img className={css.roundImg} src={sellerProfilePhoto}/>{otherName}</td>
                            <td><b className={css.amount}>${Agreements[key]?.amount}</b></td>
                            
                        </tr>
                    )
                })}
            </table>
       
    </>
           
           
		

	

    
  );
};




export default ListingProposalItemComponent;
