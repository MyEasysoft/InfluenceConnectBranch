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

import {
  pendingProposals,
  pendingProposalsClear,
  resetPassword,
} from './PendingProposalsPage.duck';
import { logout } from '../../ducks/auth.duck';
import css from './PendingProposalsPage.module.css';
import EarningsPageViewComponent from '../../components/EarningsPageView/EarningsPageView';

export const PendingProposalsPageComponent = props => {
  const {
    pendingProposalsError,
    pendingProposalsInProgress,
    currentUser,
    onChange,
    onLogout,
    onSubmitPendingProposals,
    onResetPassword,
    resetPasswordInProgress,
    resetPasswordError,
    pendingProposals,
    scrollingDisabled,
    intl,
  } = props;

  const handlePendingProposals = values => {
    return onSubmitPendingProposals(values).then(() => {
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
  const showGraph = true;

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
          showGraph={showGraph}
        />
    </div>
  );








  

  const title = intl.formatMessage({ id: 'PendingProposalsPage.title' });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation
        topbar={
          <>
            <TopbarContainer
              currentPage="PendingProposalsPage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            <UserNav currentPage="PendingProposalsPage" />
          </>
        }
        sideNav={null}
        useAccountSettingsNav
        currentPage="PendingProposalsPage"
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <H3 as="h1" className={css.title}>
            <FormattedMessage id="PendingProposalsPage.heading" />
          </H3>
          {pageDetails}
        </div>
      </LayoutSideNavigation>
    </Page>
  );
};

PendingProposalsPageComponent.defaultProps = {
  pendingProposalsError: null,
  currentUser: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func } = PropTypes;

PendingProposalsPageComponent.propTypes = {
  pendingProposalsError: propTypes.error,
  pendingProposalsInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  onChange: func.isRequired,
  onSubmitPendingProposals: func.isRequired,
  pendingProposals: bool,
  scrollingDisabled: bool.isRequired,
  resetPasswordInProgress: bool,
  resetPasswordError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  // Topbar needs user info.
  const {
    pendingProposalsError,
    pendingProposalsInProgress,
    pendingProposals,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.PendingProposalsPage;
  const { currentUser } = state.user;
  return {
    pendingProposalsError,
    pendingProposalsInProgress,
    currentUser,
    pendingProposals,
    scrollingDisabled: isScrollingDisabled(state),
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(pendingProposalsClear()),
  onLogout: () => dispatch(logout()),
  onSubmitPendingProposals: values => dispatch(pendingProposals(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const PendingProposalsPage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(PendingProposalsPageComponent);

export default PendingProposalsPage;