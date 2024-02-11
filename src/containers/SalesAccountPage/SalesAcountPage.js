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
  salesAccount,
  salesAccountClear,
  resetPassword,
} from './SalesAccountPage.duck';
import { logout } from '../../ducks/auth.duck';
import css from './SalesAccountPage.module.css';

export const SalesAccountPageComponent = props => {
  const {
    salesAccountError,
    salesAccountInProgress,
    currentUser,
    onChange,
    onLogout,
    onSubmitSalesAccount,
    onResetPassword,
    resetPasswordInProgress,
    resetPasswordError,
    accountSales,
    scrollingDisabled,
    intl,
  } = props;

  const handleSalesAccount = values => {
    return onSubmitSalesAccount(values).then(() => {
      onLogout();
    });
  };

  useEffect(() => {
    return onChange();
  }, []);

  const pageDetails = (
    <div className={css.details}>
      <FormattedMessage
        id={
          salesAccountError?.status == 409
            ? 'SalesAccountPage.error'
            : 'SalesAccountPage.details'
        }
        values={{ errorCause: salesAccountError?.message }}
      />
    </div>
  );

  const title = intl.formatMessage({ id: 'SalesAccountPage.title' });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation
        topbar={
          <>
            <TopbarContainer
              currentPage="SalesAccountPage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            <UserNav currentPage="SalesAccountPage" />
          </>
        }
        sideNav={null}
        useAccountSettingsNav
        currentPage="SalesAccountPage"
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <H3 as="h1" className={css.title}>
            <FormattedMessage id="SalesAccountPage.heading" />
          </H3>
          {pageDetails}
        </div>
      </LayoutSideNavigation>
    </Page>
  );
};

SalesAccountPageComponent.defaultProps = {
  salesAccountError: null,
  currentUser: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func } = PropTypes;

SalesAccountPageComponent.propTypes = {
  salesAccountError: propTypes.error,
  salesAccountInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  onChange: func.isRequired,
  onSubmitSalesAccount: func.isRequired,
  accountSalesd: bool.isRequired,
  scrollingDisabled: bool.isRequired,
  resetPasswordInProgress: bool,
  resetPasswordError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  // Topbar needs user info.
  const {
    salesAccountError,
    salesAccountInProgress,
    accountSalesd,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.SalesAccountPage;
  const { currentUser } = state.user;
  return {
    salesAccountError,
    salesAccountInProgress,
    currentUser,
    accountSalesd,
    scrollingDisabled: isScrollingDisabled(state),
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(salesAccountClear()),
  onLogout: () => dispatch(logout()),
  onSubmitSalesAccount: values => dispatch(salesAccount(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const SalesAccountPage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(SalesAccountPageComponent);

export default SalesAccountPage;