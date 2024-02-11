import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '../../util/reactIntl';
import { propTypes } from '../../util/types';
import { isScrollingDisabled } from '../../ducks/ui.duck';
import { LayoutSideNavigation, Page, UserNav, H3 } from '../../components';
import TopbarContainer from '../TopbarContainer/TopbarContainer';
import FooterContainer from '../FooterContainer/FooterContainer';
import SubmitForm from '../AuthenticationPage/SignupForm/SignupForm'

import {
  gigsTracking,
  gigsTrackingClear,
  resetPassword,
} from './GigsTrackingPage.duck';
import { logout } from '../../ducks/auth.duck';
import css from './GigsTrackingPage.module.css';
import EarningsPageViewComponent from '../../components/EarningsPageView/EarningsPageView';

export const GigsTrackingPageComponent = props => {
  const {
    gigsTrackingError,
    gigsTrackingInProgress,
    currentUser,
    onChange,
    onLogout,
    onSubmitGigsTracking,
    onResetPassword,
    resetPasswordInProgress,
    resetPasswordError,
    accountSales,
    scrollingDisabled,
    intl,
  } = props;

  const handleGigsTracking = values => {
    return onSubmitGigsTracking(values).then(() => {
      onLogout();
    });
  };

  useEffect(() => {
    return onChange();
  }, []);

 
  const totalTransactionLabel = 'TOTAL GIG';
  const totalTransactionValue = '20';
  const showTotalTransaction = true;

  const totalCompletedLabel = 'TOTAL COMPLETED';
  const totaLCompletedValue = '17';
  const showTotalCompleted = true;

  const totalDeclinedLabel = 'TOTAL PROFITS';
  const totalDeclinedValue = '$25000';
  const showTotalDeclined = true;

  const totalProfitLabel = 'TOTAL LOSS';
  const totalProfitValue = '$5000';
  const showTotalProfit = true;

  const pageDetails = (
    <div className={css.details}>
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
        />
    </div>
  );

  const title = intl.formatMessage({ id: 'GigsTrackingPage.title' });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation
        topbar={
          <>
            <TopbarContainer
              currentPage="GigsTrackingPage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            <UserNav currentPage="GigsTrackingPage" />
          </>
        }
        sideNav={null}
        useAccountSettingsNav
        currentPage="GigsTrackingPage"
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <H3 as="h1" className={css.title}>
            <FormattedMessage id="GigsTrackingPage.heading" />
          </H3>
          {pageDetails}
        </div>
      </LayoutSideNavigation>
    </Page>
  );
};

GigsTrackingPageComponent.defaultProps = {
  gigsTrackingError: null,
  currentUser: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func } = PropTypes;

GigsTrackingPageComponent.propTypes = {
  gigsTrackingError: propTypes.error,
  gigsTrackingInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  onChange: func.isRequired,
  onSubmitGigsTracking: func.isRequired,
  gigsTracking: bool,
  scrollingDisabled: bool.isRequired,
  resetPasswordInProgress: bool,
  resetPasswordError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  // Topbar needs user info.
  const {
    gigsTrackingError,
    gigsTrackingInProgress,
    gigsTracking,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.GigsTrackingPage;
  const { currentUser } = state.user;
  return {
    gigsTrackingError,
    gigsTrackingInProgress,
    currentUser,
    gigsTracking,
    scrollingDisabled: isScrollingDisabled(state),
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(gigsTrackingClear()),
  onLogout: () => dispatch(logout()),
  onSubmitGigsTracking: values => dispatch(gigsTracking(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const GigsTrackingPage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(GigsTrackingPageComponent);

export default GigsTrackingPage;