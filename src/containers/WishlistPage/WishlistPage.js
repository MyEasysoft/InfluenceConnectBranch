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
  wishlist,
  wishlistClear,
  resetPassword,
} from '../WishlistPage/WishlistPage.duck';
import { logout } from '../../ducks/auth.duck';
import css from './WishlistPage.module.css';

export const WishlistPageComponent = props => {
  const {
    wishlistError,
    wishlistInProgress,
    currentUser,
    onChange,
    onLogout,
    onSubmitWishlist,
    onResetPassword,
    resetPasswordInProgress,
    resetPasswordError,
    accountSales,
    scrollingDisabled,
    intl,
  } = props;

  const handleWishlist = values => {
    return onSubmitWishlist(values).then(() => {
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
          wishlistError?.status == 409
            ? 'WishlistPage.error'
            : 'WishlistPage.details'
        }
        values={{ errorCause: wishlistError?.message }}
      />
    </div>
  );

  const title = intl.formatMessage({ id: 'WishlistPage.title' });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation
        topbar={
          <>
            <TopbarContainer
              currentPage="WishlistPage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            <UserNav currentPage="WishlistPage" />
          </>
        }
        sideNav={null}
        useAccountSettingsNav
        currentPage="WishlistPage"
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <H3 as="h1" className={css.title}>
            <FormattedMessage id="WishlistPage.heading" />
          </H3>
          {pageDetails}
        </div>
      </LayoutSideNavigation>
    </Page>
  );
};

WishlistPageComponent.defaultProps = {
  wishlistError: null,
  currentUser: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func } = PropTypes;

WishlistPageComponent.propTypes = {
  wishlistError: propTypes.error,
  wishlistInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  onChange: func.isRequired,
  onSubmitWishlist: func.isRequired,
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
    wishlistError,
    wishlistInProgress,
    accountSalesd,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.WishlistPage;
  const { currentUser } = state.user;
  return {
    wishlistError,
    wishlistInProgress,
    currentUser,
    accountSalesd,
    scrollingDisabled: isScrollingDisabled(state),
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(wishlistClear()),
  onLogout: () => dispatch(logout()),
  onSubmitWishlist: values => dispatch(wishlist(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const WishlistPage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(WishlistPageComponent);

export default WishlistPage;