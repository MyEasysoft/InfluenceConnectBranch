import React, { useEffect, useState } from 'react';
import css from './CustomSection.module.css';
import classNames from 'classnames';
import s1 from '../../assets/new/Influencer1.PNG';
import s2 from '../../assets/new/Influencer2.PNG';
import s3 from '../../assets/new/Influencer3.PNG';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faHeart, faSignIn, faEnvelope, faBook, faGear, faKey} from '@fortawesome/free-solid-svg-icons';
import {
    Avatar,
    InlineTextButton,
    LinkedLogo,
    Menu,
    MenuLabel,
    MenuContent,
    MenuItem,
    NamedLink,
  } from '..';
  
  import {AreaChart} from '../ChartViews/area charts/AreaChart';
  import BarChart from '../ChartViews/area charts/BarChart';
  import BarChart2 from '../ChartViews/area charts/BarChart2';
import LineChart from '../ChartViews/area charts/LineChart';
import EarningsPage from '../../containers/EarningsPage/EarningsPage';
import ListingItemComponent from '../ListingPaymentListItems/ListingPaymentListItem';
import { base64url } from 'jose';
//import { callPayPalOnboardingApi } from '../PaypalCom/Checkout.duck';

function EarningsPageViewComponent(props){

  
    const {

      totalTransactionLabel,
      totalTransactionValue,
      showTotalTransaction,
      totalCompletedLabel,
      totaLCompletedValue,
      showTotalCompleted,
      totalDeclinedLabel,
      totalDeclinedValue,
      showTotalDeclined,
      totalProfitLabel,
      totalProfitValue,
      showTotalProfit,
      listingPaidFor,
      paypalMerchantId,
      handleShowAgreeDialog,
      showCompletedIcon,
      showAgreementDialog,
      currentUser,
      onUpdateListingReceived,
      showGraph,
      showMetrics,
      enableAcceptBtn
      

    } = props;

    const[plan,setPlan] = useState("Basic");
    const  handleBasicClicked = (event)=>{
        event.preventDefault();
       setPlan("Basic");
    }

   const handleProClicked = (event)=>{
    event.preventDefault();
        setPlan("Pro");
    }

    const EarningsPage = {
      name: 'EarningsPage',
      match: { url: '/' },
    };

    const paypalHeader = paypalMerchantId !== undefined && paypalMerchantId !== null && paypalMerchantId !== ""?
    paypalMerchantId:
    <>
      You have not connect your account to Paypal yet
      <NamedLink name="PaymentSettingPage" className={css.btn}>Connect your account to Paypal here</NamedLink>
    </>
    

    const projectListings = (
      <div className={css.details}>
         
         <ListingItemComponent 
              listingPaidFor={listingPaidFor}
              handleShowAgreeDialog = {handleShowAgreeDialog} 
              showCompletedIcon={showCompletedIcon}
              onUpdateListingReceived={onUpdateListingReceived}
              currentUser={currentUser}
              enableAcceptBtn={enableAcceptBtn}
              
            />
         
      </div>
    );

  return (
   
    <div className={css.container +' '+ css.textCenter+' '+ css.sectionBgWhite}>

        {showMetrics && 
          <div className={css.cardRow}>
              <div className={css.card1}>
                  <div className={css.row3}>
                    <h5 className={css.cardHeader}>{totalTransactionLabel}</h5>
                    
                  </div>
                  <div className={css.row3}>
                    <b className={css.amount}>{totalTransactionValue}</b>
                  </div>
              </div>

              <div className={css.card1}>
                  <div className={css.row3}>
                    <h5 className={css.cardHeader}>{totalCompletedLabel}</h5>
                   
                  </div>
                  <div className={css.row3}>
                    
                    <b className={css.amount}>{totaLCompletedValue}</b>
                  </div>
              </div>

              <div className={css.card1}>
                  <div className={css.row3}>
                    <h5 className={css.cardHeader}>{totalDeclinedLabel}</h5>
                   
                  </div>
                  <div className={css.row3}>
                    
                    <b className={css.amount}>{totalDeclinedValue}</b>
                  </div>
              </div>

              <div className={css.card1}>
                  <div className={css.row3}>
                    <h5 className={css.cardHeader}>{totalProfitLabel}</h5>
                   
                  </div>
                  <div className={css.row3}>
                    
                    <b className={css.amount}>{totalProfitValue}</b>
                  </div>
              </div>


          </div>

        }














          {showGraph?
            <div className={css.cardRow}>
              <div className={css.cardNormal}>
                
                  <div className={classNames(css.col4,css.pad1,css.plans)}>
                    <BarChart2 className={css.pie} />
                  </div>
              </div>
              <div className={css.card2}>
                  <div className={classNames(css.col4,css.pad1,css.plans)}>
                    <AreaChart className={css.pie} />
                  </div>
              </div>
            </div>
          
          :""}
          
	</div>

   
  );
};


















export const getMyToken = ()=>{
  const clientId = "AYxhGK4SWA5pfB60bJoEniORkENksn6FnuRTd29-37pNh40Sex05SfortQj3D8cAx4Jxy3X6TNRtkaMX";
  const clientSecret = "EFt4Kt_guhRwzNkGDj-iJOkblAfjwpaShF9ycCF9CtOxiXNi93tlIrXRpbFM9MF1cd1xDpo5OIS6MkvT";


  fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', { 
    method: 'POST',
    headers: { 
         'Accept': 'application/json', 
         'Accept-Language': 'en_US',
         'Content-Type': 'application/x-www-form-urlencoded',
         'Authorization': 'Basic ' + btoa('AYxhGK4SWA5pfB60bJoEniORkENksn6FnuRTd29-37pNh40Sex05SfortQj3D8cAx4Jxy3X6TNRtkaMX:EFt4Kt_guhRwzNkGDj-iJOkblAfjwpaShF9ycCF9CtOxiXNi93tlIrXRpbFM9MF1cd1xDpo5OIS6MkvT')
        },
    body: 'grant_type=client_credentials'

}).then(response => response.json())
  .then(async (data) => {
    console.log(data);
    callPayPalOnboardingApi(data.access_token);
}).catch(function (error) {
    let edata = error.message;
    console.log('Error:', edata)
});

};


export const callPayPalOnboardingApi = token=>{
 // dispatch(onboardRequest());
console.log(token+"      oooooooooooooooooooooooooooooooooooooooooooooooo");
 fetch('https://api-m.sandbox.paypal.com/v2/customer/partner-referrals', { 
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' +token
    
  },
  body: JSON.stringify({ "individual_owners": [ { "names": [ { "prefix": "Mr.", "given_name": "Tola", "surname": "Tope", "middle_name": "Yemi", "suffix": "Jr.", "full_name": "John Middle Doe Jr.", "type": "LEGAL" } ], "citizenship": "US", "addresses": [ { "address_line_1": "One Washington Square", "address_line_2": "Apt 123", "admin_area_2": "San Jose", "admin_area_1": "CA", "postal_code": "95112", "country_code": "US", "type": "HOME" } ], "phones": [ { "country_code": "1", "national_number": "6692468839", "extension_number": "1234", "type": "MOBILE" } ], "birth_details": { "date_of_birth": "1955-12-29" }, "type": "PRIMARY" } ], "business_entity": { "business_type": { "type": "INDIVIDUAL", "subtype": "ASSO_TYPE_INCORPORATED" }, "business_industry": { "category": "1004", "mcc_code": "8931", "subcategory": "2025" }, "business_incorporation": { "incorporation_country_code": "US", "incorporation_date": "1986-12-29" }, "names": [ { "business_name": "Test Enterprise", "type": "LEGAL_NAME" } ], "emails": [ { "type": "CUSTOMER_SERVICE", "email": "customerservice@example.com" } ], "website": "https://mystore.testenterprises.com", "addresses": [ { "address_line_1": "One Washington Square", "address_line_2": "Apt 123", "admin_area_2": "San Jose", "admin_area_1": "CA", "postal_code": "95112", "country_code": "US", "type": "WORK" } ], "phones": [ { "country_code": "1", "national_number": "6692478833", "extension_number": "1234", "type": "CUSTOMER_SERVICE" } ], "beneficial_owners": { "individual_beneficial_owners": [ { "names": [ { "prefix": "Mr.", "given_name": "John", "surname": "Doe", "middle_name": "Middle", "suffix": "Jr.", "full_name": "John Middle Doe Jr.", "type": "LEGAL" } ], "citizenship": "US", "addresses": [ { "address_line_1": "One Washington Square", "address_line_2": "Apt 123", "admin_area_2": "San Jose", "admin_area_1": "CA", "postal_code": "95112", "country_code": "US", "type": "HOME" } ], "phones": [ { "country_code": "1", "national_number": "6692468839", "extension_number": "1234", "type": "MOBILE" } ], "birth_details": { "date_of_birth": "1955-12-29" }, "percentage_of_ownership": "50" } ], "business_beneficial_owners": [ { "business_type": { "type": "INDIVIDUAL", "subtype": "ASSO_TYPE_INCORPORATED" }, "business_industry": { "category": "1004", "mcc_code": "8931", "subcategory": "2025" }, "business_incorporation": { "incorporation_country_code": "US", "incorporation_date": "1986-12-29" }, "names": [ { "business_name": "Test Enterprise", "type": "LEGAL_NAME" } ], "emails": [ { "type": "CUSTOMER_SERVICE", "email": "customerservice@example.com" } ], "website": "https://mystore.testenterprises.com", "addresses": [ { "address_line_1": "One Washington Square", "address_line_2": "Apt 123", "admin_area_2": "San Jose", "admin_area_1": "CA", "postal_code": "95112", "country_code": "US", "type": "WORK" } ], "phones": [ { "country_code": "1", "national_number": "6692478833", "extension_number": "1234", "type": "CUSTOMER_SERVICE" } ], "percentage_of_ownership": "50" } ] }, "office_bearers": [ { "names": [ { "prefix": "Mr.", "given_name": "John", "surname": "Doe", "middle_name": "Middle", "suffix": "Jr.", "full_name": "John Middle Doe Jr.", "type": "LEGAL" } ], "citizenship": "US", "addresses": [ { "address_line_1": "One Washington Square", "address_line_2": "Apt 123", "admin_area_2": "San Jose", "admin_area_1": "CA", "postal_code": "95112", "country_code": "US", "type": "HOME" } ], "phones": [ { "country_code": "1", "national_number": "6692468839", "extension_number": "1234", "type": "MOBILE" } ], "birth_details": { "date_of_birth": "1955-12-29" }, "role": "DIRECTOR" } ], "annual_sales_volume_range": { "minimum_amount": { "currency_code": "USD", "value": "10000" }, "maximum_amount": { "currency_code": "USD", "value": "50000" } }, "average_monthly_volume_range": { "minimum_amount": { "currency_code": "USD", "value": "1000" }, "maximum_amount": { "currency_code": "USD", "value": "50000" } }, "purpose_code": "P0104" }, "email": "accountemail@example.com", "preferred_language_code": "en-US", "tracking_id": "testenterprices123122", "partner_config_override": { "partner_logo_url": "https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_111x69.jpg", "return_url": "https://testenterprises.com/merchantonboarded", "return_url_description": "the url to return the merchant after the paypal onboarding process.", "action_renewal_url": "https://testenterprises.com/renew-exprired-url", "show_add_credit_card": true }, "operations": [ { "operation": "BANK_ADDITION" } ], "financial_instruments": { "banks": [ { "nick_name": "Bank of America", "account_number": "123405668293", "account_type": "CHECKING", "currency_code": "USD", "identifiers": [ { "type": "ROUTING_NUMBER_1", "value": "123456789" } ] } ] }, "legal_consents": [ { "type": "SHARE_DATA_CONSENT", "granted": true } ], "products": [ "EXPRESS_CHECKOUT" ] })
,

}).then(response => response.json())
.then(async (data) => {
  const orderData =  data;
  console.log(JSON.stringify(orderData));
}).catch(function (error) {
  let edata = error.message;
  console.log('Error:', edata)
});


}

export default EarningsPageViewComponent;
