import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { isScrollingDisabled } from '../../ducks/ui.duck';
import { LayoutSideNavigation, Page, UserNav, H3 } from '../../components';
import TopbarContainer from '../TopbarContainer/TopbarContainer';
import FooterContainer from '../FooterContainer/FooterContainer';

import {
  projects,
  projectsClear,
  resetPassword,
} from './ProjectsPage.duck';
import { logout } from '../../ducks/auth.duck';
import css from './ProjectsPage.module.css';
import EarningsPageViewComponent from '../../components/EarningsPageView/EarningsPageView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';

export const ProjectsPageComponent = props => {

  const [showAgreementDialog, setShowAgreementDialog] = useState(false);
  const [showCompletedIcon, setShowCompletedIcon] = useState(false);

  const handleShowAgreeDialog = ()=>{
    console.log("Clickedddddddddddddddddddddddddddddddddddd");
    setShowAgreementDialog(!showAgreementDialog);
  }

  const handleAccept = ()=>{
    setShowAgreementDialog(false);
  }

  const handleReject = ()=>{
    setShowAgreementDialog(false);
  }

  const {
    projectsError,
    projectsInProgress,
    currentUser,
    onChange,
    onLogout,
    onSubmitProjects,
    onResetPassword,
    resetPasswordInProgress,
    resetPasswordError,
    accountDeleted,
    scrollingDisabled,
    intl,
    getAuthorListing,
    getListing,
    getUserById
  } = props;

  if (currentUser === undefined || currentUser?.attributes?.profile?.privateData === undefined)return;

  const {paypalMerchantId,listingPaidFor} = currentUser?.attributes?.profile?.privateData;
  
  const handleProjects = values => {
    return onSubmitProjects(values).then(() => {
      onLogout();
    });
  };

  

  useEffect(() => {
    return onChange();
  }, []);

  

  const totalTransactionLabel = 'TOTAL EXPECTED';
  const totalTransactionValue = '$43,000';
  const showTotalTransaction = true;

  const totalCompletedLabel = 'TOTAL COMPLETED';
  const totaLCompletedValue = '23';
  const showTotalCompleted = true;

  const totalDeclinedLabel = 'TOTAL EARNINGS';
  const totalDeclinedValue = '$34,000';
  const showTotalDeclined = true;

  const totalProfitLabel = 'TOTAL LOSS';
  const totalProfitValue = '$9,000';
  const showTotalProfit = true;

  const pageDetails = (
    
        <EarningsPageViewComponent
        
          totalTransactionLabel={totalTransactionLabel}
          totalTransactionValue={totalTransactionValue}
          showTotalTransaction={showTotalTransaction}
          totalCompletedLabel={totalCompletedLabel}
          totaLCompletedValue={totaLCompletedValue}
          showTotalCompleted={showTotalCompleted}
          totalDeclinedLabel={totalDeclinedLabel}
          totalDeclinedValue={totalDeclinedValue}
          showTotalDeclined={showTotalDeclined}
          totalProfitLabel={totalProfitLabel}
          totalProfitValue={totalProfitValue}
          showTotalProfit={showTotalProfit}
          listingPaidFor={listingPaidFor}
          paypalMerchantId={paypalMerchantId}
          handleShowAgreeDialog = {handleShowAgreeDialog} 
        />
   
  );

  const agreementDialog = showAgreementDialog? 
        <div className={css.modal}>
            <p>By clicking Accept button below, you agree that this project has been completed successfully.</p>
          
            <button onClick={handleAccept} class={css.acceptBtn}>Accept</button>
            <button onClick={handleReject} class={css.rejectBtn}>Reject</button>
        </div>:"";


  const title = intl.formatMessage({ id: 'ProjectsPage.title' });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation
        topbar={
          <>
            <TopbarContainer
              currentPage="ProjectsPage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            <UserNav currentPage="ProjectsPage" />
           
          </>
        }
        sideNav={null}
        useAccountSettingsNav
        currentPage="ProjectsPage"
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <H3 as="h1" className={css.title}>
            <FormattedMessage id="ProjectsPage.heading" />
          </H3>
         
         
        </div>
      </LayoutSideNavigation>
      {agreementDialog}
    </Page>
  );
};

ProjectsPageComponent.defaultProps = {
  projectsError: null,
  currentUser: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func } = PropTypes;

ProjectsPageComponent.propTypes = {
  projectsError: propTypes.error,
  projectsInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  onChange: func.isRequired,
  onSubmitProjects: func.isRequired,
  accountDeleted: bool.isRequired,
  scrollingDisabled: bool.isRequired,
  resetPasswordInProgress: bool,
  resetPasswordError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {

 
  
  // Topbar needs user info.
  const {
    projectsError,
    projectsInProgress,
    accountDeleted,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.ProjectsPage;
  const { currentUser } = state.user;

  const getListing = id => {
    const ref = { id, type: 'listing' };
    const listings = getMarketplaceEntities(state, [ref]);
    return listings.length === 1 ? listings[0] : null;
  };

  const getAuthorListing = id => {
    const ref = { id, type: 'ownListing' };
    const listings = getMarketplaceEntities(state, [ref]);
    return listings.length === 1 ? listings[0] : null;
  };

  const getUserById = (id)=>{
    const userMatches = getMarketplaceEntities(state, [{ type: 'user', id: id }]);
    const user = userMatches.length === 1 ? userMatches[0] : null;
  }

  return {
    getListing,
    getAuthorListing,
    getUserById,
    projectsError,
    projectsInProgress,
    currentUser,
    accountDeleted,
    scrollingDisabled: isScrollingDisabled(state),
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(projectsClear()),
  onLogout: () => dispatch(logout()),
  onSubmitProjects: values => dispatch(projects(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const ProjectsPage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(ProjectsPageComponent);

export default ProjectsPage;