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
  purchases,
  purchasesClear,
  resetPassword,
} from './PurchasesPage.duck';
import { logout } from '../../ducks/auth.duck';
import css from './PurchasesPage.module.css';

export const PurchasesPageComponent = props => {
  const {
    purchasesError,
    purchasesInProgress,
    currentUser,
    onChange,
    onLogout,
    onSubmitPurchases,
    onResetPassword,
    resetPasswordInProgress,
    resetPasswordError,
    accountSales,
    scrollingDisabled,
    intl,
  } = props;

  const handlePurchases = values => {
    return onSubmitPurchases(values).then(() => {
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
          purchasesError?.status == 409
            ? 'PurchasesPage.error'
            : 'PurchasesPage.details'
        }
        values={{ errorCause: purchasesError?.message }}
      />
    </div>
  );

  const title = intl.formatMessage({ id: 'PurchasesPage.title' });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation
        topbar={
          <>
            <TopbarContainer
              currentPage="PurchasesPage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            <UserNav currentPage="PurchasesPage" />
          </>
        }
        sideNav={null}
        useAccountSettingsNav
        currentPage="PurchasesPage"
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <H3 as="h1" className={css.title}>
            <FormattedMessage id="PurchasesPage.heading" />
          </H3>
          {pageDetails}
        </div>
      </LayoutSideNavigation>
    </Page>
  );
};

PurchasesPageComponent.defaultProps = {
  purchasesError: null,
  currentUser: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func } = PropTypes;

PurchasesPageComponent.propTypes = {
  purchasesError: propTypes.error,
  purchasesInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  onChange: func.isRequired,
  onSubmitPurchases: func.isRequired,
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
    purchasesError,
    purchasesInProgress,
    accountSalesd,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.PurchasesPage;
  const { currentUser } = state.user;
  return {
    purchasesError,
    purchasesInProgress,
    currentUser,
    accountSalesd,
    scrollingDisabled: isScrollingDisabled(state),
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(purchasesClear()),
  onLogout: () => dispatch(logout()),
  onSubmitPurchases: values => dispatch(purchases(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const PurchasesPage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(PurchasesPageComponent);

export default PurchasesPage;