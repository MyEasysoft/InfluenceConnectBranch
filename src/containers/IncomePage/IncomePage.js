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
  income,
  incomeClear,
  resetPassword,
} from './IncomePage.duck';
import { logout } from '../../ducks/auth.duck';
import css from './IncomePage.module.css';
import EarningsPageViewComponent from '../../components/EarningsPageView/EarningsPageView';

export const IncomePageComponent = props => {
  const {
    incomeError,
    incomeInProgress,
    currentUser,
    onChange,
    onLogout,
    onSubmitIncome,
    onResetPassword,
    resetPasswordInProgress,
    resetPasswordError,
    accountSales,
    scrollingDisabled,
    intl,
  } = props;

  const handleIncome = values => {
    return onSubmitIncome(values).then(() => {
      onLogout();
    });
  };

  useEffect(() => {
    return onChange();
  }, []);

 
  const totalTransactionLabel = 'TOTAL INCOME';
  const totalTransactionValue = '$72,000';
  const showTotalTransaction = true;

  const totalCompletedLabel = 'TOTAL GIGS';
  const totaLCompletedValue = '25';
  const showTotalCompleted = true;

  const totalDeclinedLabel = 'TOTAL REJECT';
  const totalDeclinedValue = '4';
  const showTotalDeclined = true;

  const totalProfitLabel = 'TOTAL ACCEPTED';
  const totalProfitValue = '21';
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

  const title = intl.formatMessage({ id: 'IncomePage.title' });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation
        topbar={
          <>
            <TopbarContainer
              currentPage="IncomePage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            <UserNav currentPage="IncomePage" />
          </>
        }
        sideNav={null}
        useAccountSettingsNav
        currentPage="IncomePage"
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <H3 as="h1" className={css.title}>
            <FormattedMessage id="IncomePage.heading" />
          </H3>
          {pageDetails}
        </div>
      </LayoutSideNavigation>
    </Page>
  );
};

IncomePageComponent.defaultProps = {
  incomeError: null,
  currentUser: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func } = PropTypes;

IncomePageComponent.propTypes = {
  incomeError: propTypes.error,
  incomeInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  onChange: func.isRequired,
  onSubmitIncome: func.isRequired,
  income: bool,
  scrollingDisabled: bool.isRequired,
  resetPasswordInProgress: bool,
  resetPasswordError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  // Topbar needs user info.
  const {
    incomeError,
    incomeInProgress,
    income,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.IncomePage;
  const { currentUser } = state.user;
  return {
    incomeError,
    incomeInProgress,
    currentUser,
    income,
    scrollingDisabled: isScrollingDisabled(state),
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(incomeClear()),
  onLogout: () => dispatch(logout()),
  onSubmitIncome: values => dispatch(income(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const IncomePage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(IncomePageComponent);

export default IncomePage;