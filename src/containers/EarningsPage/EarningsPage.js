import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { isScrollingDisabled } from '../../ducks/ui.duck';
import { LayoutSideNavigation, Page, UserNav, H3, Modal } from '../../components';
import TopbarContainer from '../TopbarContainer/TopbarContainer';
import FooterContainer from '../FooterContainer/FooterContainer';

import {
  earnings,
  earningsClear,
  resetPassword,
} from '../EarningsPage/EarningsPage.duck';
import { logout } from '../../ducks/auth.duck';
import css from './EarningsPage.module.css';
import EarningsPageViewComponent from '../../components/EarningsPageView/EarningsPageView';

export const EarningsPageComponent = props => {
 
  const {
    earningsError,
    earningsInProgress,
    currentUser,
    onChange,
    onLogout,
    onSubmitEarnings,
    onResetPassword,
    resetPasswordInProgress,
    resetPasswordError,
    accountSales,
    scrollingDisabled,
    intl,
  } = props;

  const handleEarnings = values => {
    return onSubmitEarnings(values).then(() => {
      onLogout();
    });
  };

  useEffect(() => {
    return onChange();
  }, []);


  //Get the list of ProjectPaidFor
  //Calculate total earnings

  
  let listingPaidFor ="";
  let agreements = "";
  if(currentUser !== undefined){
     listingPaidFor = currentUser?.attributes?.profile?.privateData?.listingPaidFor;
     agreements = currentUser?.attributes?.profile?.privateData?.Agreements;
  }


  const getTotalEarnings = (listingPaidForr) => {
  
    if(listingPaidForr === undefined || listingPaidForr === null)return[];
    let totalEarnings = 0;
    const keys = Object?.keys(listingPaidForr);
    keys.forEach(key => {
      
      try{
          if( listingPaidForr[key].status === "Delivered"){
            
            //console.log(obj[key].listingId+"  ooooooooooooooooooooooooooooooooooooooooo    "+ listingId);
            totalEarnings += parseInt(listingPaidForr[key].amount);
          }
          

      }catch(error){}
     
    });
    return totalEarnings;
  };
  
  const getTotalPending = (agreements) => {
  
    if(agreements === undefined || agreements === null)return 0;
    let totalPending = 0;
    const keys = Object?.keys(agreements);
    keys.forEach(key => {
      
      try{
          if( agreements[key].status !== "Started"){
            totalPending+=1;
          }
      }catch(error){}
     
    });
    return totalPending;
  };

  const getTotalCompleted = (listingPaidForr) => {
  
    if(listingPaidForr === undefined || listingPaidForr === null)return 0;
    let totalCompleted = 0;
    const keys = Object?.keys(listingPaidForr);
    keys.forEach(key => {
      
      try{
          if( listingPaidForr[key].status === "Delivered"){
            
            //console.log(obj[key].listingId+"  ooooooooooooooooooooooooooooooooooooooooo    "+ listingId);
            totalCompleted+=1;
          }
          

      }catch(error){}
     
    });
    return totalCompleted;
  };

const getTotalGigs = (agreements) => {
  
    if(agreements === undefined || agreements === null)return 0;
    let total = 0;
    const keys = Object?.keys(agreements);
    keys.forEach(key => {
      
      total+=1;
     
    });
    return total;
  };

  const totalEarningsLabel = 'TOTAL EARNINGS';
  let totalEarningsValue = '0';
  const showTotalTransaction = true;

  const totalGigLabel = 'TOTAL GIG';
  let totaLGigValue = '0';
  const showTotalCompleted = true;

  const totalCompletedLabel = 'TOTAL COMPLETED';
  let totalCompletedValue = '0';
  const showTotalDeclined = true;

  const totalPending = 'TOTAL PENDING PROPOSALS';
  let totalPendingValue = '0';
  const showTotalProfit = true;

  try{
    totalCompletedValue = getTotalCompleted(listingPaidFor);
    totalPendingValue = getTotalPending(agreements);
    totalEarningsValue = getTotalEarnings(listingPaidFor);
    totaLGigValue = getTotalGigs(agreements);
    
    
  }catch(e){}
   
  console.log(totalCompletedValue+"  ooooooooooooooooooooooooooooooooooooooooo    "+ listingPaidFor);

  const pageDetails = (
    <div className={css.details}>
        <EarningsPageViewComponent
        
          totalEarningsLabel={totalEarningsLabel}
          totalEarningsValue={totalEarningsValue}
          showTotalTransaction={showTotalTransaction}
          totalGigLabel={totalGigLabel}
          totaLGigValue={totaLGigValue}
          showTotalCompleted={showTotalCompleted}
          totalCompletedLabel={totalCompletedLabel}
          totalCompletedValue={totalCompletedValue}
          showTotalDeclined={showTotalDeclined}
          totalPendingLabel={totalPending}
          totalPendingValue={totalPendingValue}
          showTotalProfit={showTotalProfit}
         // handleShowAgreeDialog={handleShowAgreeDialog}
          //showCompletedIcon={showCompletedIcon}
          showGraph={true}
          showMetrics={true}

        />
    </div>
  );

  

  const title = intl.formatMessage({ id: 'EarningsPage.title' });

  
  return (

    
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation
        topbar={
          <>
            <TopbarContainer
              currentPage="EarningsPage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            <UserNav currentPage="EarningsPage" />
          </>
        }
        sideNav={null}
        useAccountSettingsNav
        currentPage="EarningsPage"
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <H3 as="h1" className={css.title}>
            <FormattedMessage id="EarningsPage.heading" />
          </H3>


         
          {pageDetails}
         
         
        </div>
       
      </LayoutSideNavigation>
      
    </Page>
  );
};

EarningsPageComponent.defaultProps = {
  earningsError: null,
  currentUser: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func } = PropTypes;

EarningsPageComponent.propTypes = {
  earningsError: propTypes.error,
  earningsInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  onChange: func.isRequired,
  onSubmitEarnings: func.isRequired,
  earnings: bool,
  scrollingDisabled: bool.isRequired,
  resetPasswordInProgress: bool,
  resetPasswordError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  // Topbar needs user info.
  const {
    earningsError,
    earningsInProgress,
    earnings,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.EarningsPage;
  const { currentUser } = state.user;
  return {
    earningsError,
    earningsInProgress,
    currentUser,
    earnings,
    scrollingDisabled: isScrollingDisabled(state),
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(earningsClear()),
  onLogout: () => dispatch(logout()),
  onSubmitEarnings: values => dispatch(earnings(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const EarningsPage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(EarningsPageComponent);

export default EarningsPage;