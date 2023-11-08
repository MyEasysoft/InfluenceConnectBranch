import React from 'react';
import { func, string } from 'prop-types';
import { Form as FinalForm } from 'react-final-form';
import classNames from 'classnames';

import { FormattedMessage, useIntl } from '../../../util/reactIntl';

import { Form, PrimaryButton } from '../..';

import css from './InquiryWithoutPaymentForm.module.css';
import Checkout from '../../PaypalCom/Checkout';
import Checkouts from '../../PaypalCom/Checkouts';




const renderForm = formRenderProps => {
  // FormRenderProps from final-form
  const { formId, 
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
    authorId={authorId}

  } = formRenderProps;
  const classes = classNames(rootClassName || css.root, className);

  
const redirectToSuccess =()=>{
  console.log("Runningggggggggggggggggggggggggggggggggggggggggggggggggg");
}

  return (
    <>
    <Form id={formId} onSubmit={handleSubmit} className={classes}>
      <div className={css.submitButton}>
        <PrimaryButton className={css.marginB} type="submit">
          <FormattedMessage id="InquiryWithoutPaymentForm.ctaButton" />
        </PrimaryButton>
      </div>
    </Form>
    {showPaypalBtnCom?
      <Checkout 
        currentUserId = {currentUserId}
        onContactUserPayPal={formRenderProps.onContactUserPayPal} 
        onRedirectToOrderPage={formRenderProps.onRedirectToOrderPage}
        showPayPalButton={showPayPalButton}
        price={price}
        lineItems={lineItems}
        marketplaceName={marketplaceName}
        listingId={listingId}
        marketplaceCurrency={marketplaceCurrency}
        listingTitle={listingTitle}
        showPrice = {showPrice}
        showCurrency={showCurrency}
        showTitle={showTitle}
        authorId={authorId}
        redirectToSuccess={redirectToSuccess}
      />:""
    }
    
    </>
    
  );
};



const InquiryWithoutPaymentForm = props => {
  const intl = useIntl();
  const initialValues = {};

  return <FinalForm initialValues={initialValues} {...props} intl={intl} render={renderForm} />;
};

InquiryWithoutPaymentForm.defaultProps = {
  rootClassName: null,
  className: null,
};

InquiryWithoutPaymentForm.propTypes = {
  rootClassName: string,
  className: string,

  // form
  formId: string.isRequired,
  onSubmit: func.isRequired,
};

export default InquiryWithoutPaymentForm;
