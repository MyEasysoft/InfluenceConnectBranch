import React, { useEffect, useState } from 'react';
import { bool, func, number, string } from 'prop-types';
import { Form as FinalForm, FormSpy } from 'react-final-form';

import { FormattedMessage, useIntl } from '../../../util/reactIntl';
import { propTypes } from '../../../util/types';
import { numberAtLeast, required } from '../../../util/validators';
import { PURCHASE_PROCESS_NAME } from '../../../transactions/transaction';

import {
  Form,
  FieldSelect,
  FieldTextInput,
  InlineTextButton,
  PrimaryButton,
  H3,
  H6,
} from '../../../components';

import EstimatedCustomerBreakdownMaybe from '../EstimatedCustomerBreakdownMaybe';

import css from './ProductOrderForm.module.css';
import Checkout from '../../PaypalCom/Checkout';
import AgreementForm from '../../AgreementForm/AgreementForm';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';

// Browsers can't render huge number of select options.
// (stock is shown inside select element)
// Note: input element could allow ordering bigger quantities
const MAX_QUANTITY_FOR_DROPDOWN = 100;

const handleFetchLineItems = ({
  quantity,
  deliveryMethod,
  listingId,
  isOwnListing,
  fetchLineItemsInProgress,
  onFetchTransactionLineItems,
}) => {
  const stockReservationQuantity = Number.parseInt(quantity, 10);
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser && stockReservationQuantity && deliveryMethod && !fetchLineItemsInProgress) {
    onFetchTransactionLineItems({
      orderData: { stockReservationQuantity, deliveryMethod },
      listingId,
      isOwnListing,
    });
  }
};

const renderForm = formRenderProps => {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState("");
  const {

    className, 
    rootClassName, 
    handleSubmit,
    showPayPalButton,
    onSetShowPayPalButton,
    showPaypalBtnCom ,
    price,
    lineItems,
    marketplaceName,
    listingId,
    marketplaceCurrency,
    listingTitle,
    showPrice ,
    showCurrency,
    showTitle,
    currentUserId,
    authorId,

    // FormRenderProps from final-form
    form: formApi,
    // Custom props passed to the form component
    intl,
    formId,
    currentStock,
    hasMultipleDeliveryMethods,
    
    isOwnListing,
    onFetchTransactionLineItems,
    onContactUser,
    
    fetchLineItemsInProgress,
    fetchLineItemsError,
    values,
    currentUser,
    listing,
    onAgree,
    onAccept,
    onCancelAgree,
    onInitiateTransaction,
    createTransactionInquiryInProgress,
    createTransactionInquiryError,
    transactionInquiryMessageId,
    onSendMessage,

  } = formRenderProps;

  const history = useHistory();

  if(transactionInquiryMessageId !== null && transactionInquiryMessageId !== undefined){
   
      //history.push(`/order/${transactionInquiryMessageId.data.id.uuid}`);
      
  }

  const location = useLocation();
  const path = location.pathname;
  console.log(path + "       pppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppppp");

  
  
  
  //const [roleVal, setRole] = useState("");

  // Note: don't add custom logic before useEffect
  useEffect(() => {
    setMounted(true);

    // Side-effect: fetch line-items after mounting if possible
    const { quantity, deliveryMethod } = values;
    if (quantity && !formRenderProps.hasMultipleDeliveryMethods) {
      handleFetchLineItems({
        quantity,
        deliveryMethod,
        listingId,
        isOwnListing,
        fetchLineItemsInProgress,
        onFetchTransactionLineItems,
      });
    }

    console.log(JSON.stringify(transactionInquiryMessageId) + "     Changing ccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc");
   
  }, []);

  // If form values change, update line-items for the order breakdown
  const handleOnChange = formValues => {
    const { quantity, deliveryMethod } = formValues.values;
    if (mounted) {
      handleFetchLineItems({
        quantity,
        deliveryMethod,
        listingId,
        isOwnListing,
        fetchLineItemsInProgress,
        onFetchTransactionLineItems,
      });
    }
  };

  const onMessageChange = (event) =>{
    setMessages(event.target.value);
  }

  // In case quantity and deliveryMethod are missing focus on that select-input.
  // Otherwise continue with the default handleSubmit function.
  const handleFormSubmit = e => {
    const { quantity, deliveryMethod } = values || {};
    if (!quantity || quantity < 1) {
      e.preventDefault();
      // Blur event will show validator message
      formApi.blur('quantity');
      formApi.focus('quantity');
    } else if (!deliveryMethod) {
      e.preventDefault();
      // Blur event will show validator message
      formApi.blur('deliveryMethod');
      formApi.focus('deliveryMethod');
    } else {
      handleSubmit(e);
    }
  };

  
  
   const handleSendMsg = (event)=>{
    event.preventDefault();
    if(!createTransactionInquiryInProgress){
      onInitiateTransaction({
        listingId:listingId,
        msg:messages
      });
      
    }
    
  }

  

  const breakdownData = {};
  const showBreakdown =
    breakdownData && lineItems && !fetchLineItemsInProgress && !fetchLineItemsError;

  const showContactUser = typeof onContactUser === 'function';

  const onClickContactUser = e => {
    e.preventDefault();
    onContactUser();
  };

  const contactSellerLink = (
    <InlineTextButton onClick={onClickContactUser}>
      <FormattedMessage id="ProductOrderForm.finePrintNoStockLinkText" />
    </InlineTextButton>
  );
  const quantityRequiredMsg = intl.formatMessage({ id: 'ProductOrderForm.quantityRequired' });

  const hasStock = currentStock && currentStock > 0;
  const selectableStock =
    currentStock > MAX_QUANTITY_FOR_DROPDOWN ? MAX_QUANTITY_FOR_DROPDOWN : currentStock;
  const quantities = hasStock ? [...Array(selectableStock).keys()].map(i => i + 1) : [];
  const hasNoStockLeft = typeof currentStock != null && currentStock === 0;
  const hasOneItemLeft = typeof currentStock != null && currentStock === 1;

  const submitInProgress = fetchLineItemsInProgress;
  const submitMsgInProgress = createTransactionInquiryInProgress;
  const submitDisabled = !hasStock;
  console.log(listingId);
  let showAgreementForm ="";
  let role = "";


  //Hide Inquiry Message form
  //Message for shows only on ListingPageCorousel
  //And hide on OrderPage
  const isNotOrderPage = !(path.includes("/order/"));
  console.log(isNotOrderPage +"           666666666666666666666666666666666666666666666666");
  

  //If user has not logged in, do normal loading
  if(currentUser !== undefined && currentUser !== null){
      const {firstName,lastName} = currentUser?.attributes?.profile;
      const influencerPhotoVariats = currentUser?.profileImage?.attributes?.variants;
      const influencerPhoto = Object.values(influencerPhotoVariats)[0].url ;
      let listingPhoto = "";
      try{
         listingPhoto = Object.values(listing.images[0].attributes.variants)[1].url ;
      }catch(e){}
      
      role = currentUser?.attributes?.profile?.protectedData?.role;
      //setRole(role);
      const authorDisplayName = listing?.author?.attributes?.profile?.displayName;
      let authorPhoto  = "";
      try{
         authorPhoto = Object.values(listing.author.profileImage.attributes.variants)[0].url;
      }catch(e){}
      
      const listingDescription = listing?.attributes?.title;
      //const price = listing.attributes.price.amount;
      const completionDuration = listing.attributes.publicData.completion_duration;
      
      

      //If currentUser role is "Influencer"
      //Then sellerId = authorId
      //InfluencerId = currentUserId
      showAgreementForm = role === "Influencer"?
      <AgreementForm
            sellerId={authorId}
            influencerId={currentUserId}
            listingId={listingId.uuid}
            influencerName={firstName +" "+ lastName}
            influencerProfilePhoto={influencerPhoto}
            authorName={authorDisplayName}
            authorProfilePhoto={authorPhoto}
            listingDescription={listingDescription}
            cost = {price}
            duration={completionDuration}
            onAgree = {onAgree}
            onAccept={onAccept}
            role={role}
            agreements={currentUser.attributes.profile.privateData.Agreements}
            listing={listing}
            currentUser={currentUser}
            listingPhoto={listingPhoto}
            
          
      />:
            <AgreementForm
            sellerId={currentUserId}
            influencerId={authorId}
            listingId={listingId.uuid}
            influencerName={authorDisplayName}
            influencerProfilePhoto={authorPhoto}
            authorName={firstName +" "+ lastName}
            authorProfilePhoto={influencerPhoto}
            listingDescription={listingDescription}
            cost = {price}
            duration={completionDuration}
            onAgree = {onAgree}
            onAccept={onAccept}
            role={role}
            agreements={currentUser.attributes.profile.privateData.Agreements}
            listing={listing}
            currentUser={currentUser}
            listingPhoto={listingPhoto}

          />;

          console.log("Making payment --------------------------------------");

  }
  
  return (<>
  
   <Form onSubmit={handleFormSubmit}>
      <FormSpy subscription={{ values: true }} onChange={handleOnChange} />
      {hasNoStockLeft ? null : hasOneItemLeft ? (
        <FieldTextInput
          id={`${formId}.quantity`}
          className={css.quantityField}
          name="quantity"
          type="hidden"
          validate={numberAtLeast(quantityRequiredMsg, 1)}
        />
      ) : (
        <FieldSelect
          id={`${formId}.quantity`}
          className={css.quantityField}
          name="quantity"
          disabled={!hasStock}
          label={intl.formatMessage({ id: 'ProductOrderForm.quantityLabel' })}
          validate={numberAtLeast(quantityRequiredMsg, 1)}
        >
          <option disabled value="">
            {intl.formatMessage({ id: 'ProductOrderForm.selectQuantityOption' })}
          </option>
          {quantities.map(quantity => (
            <option key={quantity} value={quantity}>
              {intl.formatMessage({ id: 'ProductOrderForm.quantityOption' }, { quantity })}
            </option>
          ))}
        </FieldSelect>
      )}

      {hasNoStockLeft ? null : hasMultipleDeliveryMethods ? (
        // <FieldSelect
        //   id={`${formId}.deliveryMethod`}
        //   className={css.deliveryField}
        //   name="deliveryMethod"
        //   disabled={!hasStock}
        //   label={intl.formatMessage({ id: 'ProductOrderForm.deliveryMethodLabel' })}
        //   validate={required(intl.formatMessage({ id: 'ProductOrderForm.deliveryMethodRequired' }))}
        // >
        //   <option disabled value="">
        //     {intl.formatMessage({ id: 'ProductOrderForm.selectDeliveryMethodOption' })}
        //   </option>
        //   <option value={'pickup'}>
        //     {intl.formatMessage({ id: 'ProductOrderForm.pickupOption' })}
        //   </option>
        //   <option value={'shipping'}>
        //     {intl.formatMessage({ id: 'ProductOrderForm.shippingOption' })}
        //   </option>
        // </FieldSelect>
        ""
      ) : (
        // <div className={css.deliveryField}>
        //   <H3 rootClassName={css.singleDeliveryMethodLabel}>
        //     {intl.formatMessage({ id: 'ProductOrderForm.deliveryMethodLabel' })}
        //   </H3>
        //   <p className={css.singleDeliveryMethodSelected}>
        //     {values.deliveryMethod === 'shipping'
        //       ? intl.formatMessage({ id: 'ProductOrderForm.shippingOption' })
        //       : intl.formatMessage({ id: 'ProductOrderForm.pickupOption' })}
        //   </p>
        //   <FieldTextInput
        //     id={`${formId}.deliveryMethod`}
        //     className={css.deliveryField}
        //     name="deliveryMethod"
        //     type="hidden"
        //   />
        // </div>
        ""
      )}

      {showBreakdown ? (
        <div className={css.breakdownWrapper}>
          <H6 as="h3" className={css.bookingBreakdownTitle}>
            <FormattedMessage id="ProductOrderForm.breakdownTitle" />
          </H6>
          <hr className={css.totalDivider} />
          <EstimatedCustomerBreakdownMaybe
            breakdownData={breakdownData}
            lineItems={lineItems}
            currency={price.currency}
            marketplaceName={marketplaceName}
            processName={PURCHASE_PROCESS_NAME}
          />
        </div>
      ) : null}


          {role==="Seller"? (
             <div className={css.submitButton}>
             <PrimaryButton type="submit" inProgress={submitInProgress} disabled={submitDisabled}>
               {hasStock? (
                 <FormattedMessage id="ProductOrderForm.ctaButton" />
               ) : (
                 <FormattedMessage id="ProductOrderForm.ctaButtonNoStock" />
               )}
             </PrimaryButton>
           </div>
          ) :""}


          {isNotOrderPage? (

              <>
                <textarea class={css.magT} type="text"  onChange={onMessageChange} value={messages}   placeholder='Please enter your inquiry message here'/>
                <PrimaryButton onClick={handleSendMsg} inProgress={submitMsgInProgress} disabled={submitDisabled}>
                <FormattedMessage id="ProductOrderForm.ctaButtonSendInquiry" />
              </PrimaryButton>
              </>

              ):""
          }



      <p className={css.finePrint}>
        {hasStock ? (
          <FormattedMessage id="ProductOrderForm.finePrint" />
        ) : showContactUser ? (
          <FormattedMessage id="ProductOrderForm.finePrintNoStock" values={{ contactSellerLink }} />
        ) : null}
      </p>

      {showAgreementForm}

     
    </Form>
    
    
  </>
   
  );
};

const ProductOrderForm = props => {
  const intl = useIntl();
  const { price, currentStock, pickupEnabled, shippingEnabled } = props;

  // Should not happen for listings that go through EditListingWizard.
  // However, this might happen for imported listings.
  if (!pickupEnabled && !shippingEnabled) {
    return (
      <p className={css.error}>
        <FormattedMessage id="ProductOrderForm.noDeliveryMethodSet" />
      </p>
    );
  }

  const hasOneItemLeft = currentStock && currentStock === 1;
  const quantityMaybe = hasOneItemLeft ? { quantity: '1' } : {};
  const singleDeliveryMethodAvailableMaybe =
    shippingEnabled && !pickupEnabled
      ? { deliveryMethod: 'shipping' }
      : !shippingEnabled && pickupEnabled
      ? { deliveryMethod: 'pickup' }
      : {};
  const hasMultipleDeliveryMethods = pickupEnabled && shippingEnabled;
  const initialValues = { ...quantityMaybe, ...singleDeliveryMethodAvailableMaybe };

  return (
    <FinalForm
      initialValues={initialValues}
      hasMultipleDeliveryMethods={hasMultipleDeliveryMethods}
      {...props}
      intl={intl}
      render={renderForm}
    />
  );
};

ProductOrderForm.defaultProps = {
  rootClassName: null,
  className: null,
  price: null,
  currentStock: null,
  listingId: null,
  isOwnListing: false,
  lineItems: null,
  fetchLineItemsError: null,
};

ProductOrderForm.propTypes = {
  rootClassName: string,
  className: string,

  marketplaceName: string.isRequired,

  // form
  formId: string.isRequired,
  onSubmit: func.isRequired,

  // listing
  listingId: propTypes.uuid,
  price: propTypes.money,
  currentStock: number,
  isOwnListing: bool,

  // line items
  lineItems: propTypes.lineItems,
  onFetchTransactionLineItems: func.isRequired,
  fetchLineItemsInProgress: bool.isRequired,
  fetchLineItemsError: propTypes.error,

  // other
  onContactUser: func,
};

export default ProductOrderForm;
