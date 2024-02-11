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
  carts,
  cartsClear,
  resetPassword,
} from './CartsPage.duck';
import { logout } from '../../ducks/auth.duck';
import css from './CartsPage.module.css';

export const CartsPageComponent = props => {
  const {
    cartsError,
    cartsInProgress,
    currentUser,
    onChange,
    onLogout,
    onSubmitCarts,
    onResetPassword,
    resetPasswordInProgress,
    resetPasswordError,
    accountDeleted,
    scrollingDisabled,
    intl,
  } = props;

  const handleCarts = values => {
    return onSubmitCarts(values).then(() => {
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
          cartsError?.status == 409
            ? 'CartsPage.error'
            : 'CartsPage.details'
        }
        values={{ errorCause: cartsError?.message }}
      />
    </div>
  );

  const title = intl.formatMessage({ id: 'CartsPage.title' });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation
        topbar={
          <>
            <TopbarContainer
              currentPage="CartsPage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            <UserNav currentPage="CartsPage" />
          </>
        }
        sideNav={null}
        useAccountSettingsNav
        currentPage="CartsPage"
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <H3 as="h1" className={css.title}>
            <FormattedMessage id="CartsPage.heading" />
          </H3>
          {pageDetails}
        </div>
      </LayoutSideNavigation>
    </Page>
  );
};

CartsPageComponent.defaultProps = {
  cartsError: null,
  currentUser: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func } = PropTypes;

CartsPageComponent.propTypes = {
  cartsError: propTypes.error,
  cartsInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  onChange: func.isRequired,
  onSubmitCarts: func.isRequired,
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
    cartsError,
    cartsInProgress,
    accountDeleted,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.CartsPage;
  const { currentUser } = state.user;
  return {
    cartsError,
    cartsInProgress,
    currentUser,
    accountDeleted,
    scrollingDisabled: isScrollingDisabled(state),
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(cartsClear()),
  onLogout: () => dispatch(logout()),
  onSubmitCarts: values => dispatch(carts(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const CartsPage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(CartsPageComponent);

export default CartsPage;