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

      totalEarningsLabel,
      totalEarningsValue,
      showTotalTransaction,
      totalGigLabel,
      totaLGigValue,
      showTotalCompleted,
      totalCompletedLabel,
      totalCompletedValue,
      showTotalDeclined,
      totalPendingLabel,
      totalPendingValue,
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
                    <h5 className={css.cardHeader}>{totalEarningsLabel}</h5>
                    
                  </div>
                  <div className={css.row3}>
                    <b className={css.amount}>{totalEarningsValue}</b>
                  </div>
              </div>

              <div className={css.card1}>
                  <div className={css.row3}>
                    <h5 className={css.cardHeader}>{totalGigLabel}</h5>
                   
                  </div>
                  <div className={css.row3}>
                    
                    <b className={css.amount}>{totaLGigValue}</b>
                  </div>
              </div>

              <div className={css.card1}>
                  <div className={css.row3}>
                    <h5 className={css.cardHeader}>{totalCompletedLabel}</h5>
                   
                  </div>
                  <div className={css.row3}>
                    
                    <b className={css.amount}>{totalCompletedValue}</b>
                  </div>
              </div>

              <div className={css.card1}>
                  <div className={css.row3}>
                    <h5 className={css.cardHeader}>{totalPendingLabel}</h5>
                   
                  </div>
                  <div className={css.row3}>
                    
                    <b className={css.amount}>{totalPendingValue}</b>
                  </div>
              </div>


          </div>

        }

          {showGraph?
            <div className={css.cardRow}>
              <div className={css.cardNormal}>
                
                  <div className={classNames(css.col4,css.pad1,css.plans)}>
                    <BarChart2 
                     earnings={parseInt(totalEarningsValue)}
                     gigs={parseInt(totaLGigValue)}
                     completed={parseInt(totalCompletedValue)}
                     pending={parseInt(totalPendingValue)}
                    className={css.pie} />
                  </div>
              </div>
              <div className={css.card2}>
                  <div className={classNames(css.col4,css.pad1,css.plans)}>
                    <AreaChart 
                      earnings={parseInt(totalEarningsValue)}
                      gigs={parseInt(totaLGigValue)}
                      completed={parseInt(totalCompletedValue)}
                      pending={parseInt(totalPendingValue)}
                      className={css.pie} />
                  </div>
              </div>
            </div>
          
          :""}
          
	</div>

   
  );
};

export default EarningsPageViewComponent;
