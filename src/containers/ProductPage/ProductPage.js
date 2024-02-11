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
  product,
  productClear,
  resetPassword,
} from './ProductPage.duck';
import { logout } from '../../ducks/auth.duck';
import css from './ProductPage.module.css';

export const ProductPageComponent = props => {
  const {
    productError,
    productInProgress,
    currentUser,
    onChange,
    onLogout,
    onSubmitProduct,
    onResetPassword,
    resetPasswordInProgress,
    resetPasswordError,
    accountSales,
    scrollingDisabled,
    intl,
  } = props;

  const handleProduct = values => {
    return onSubmitProduct(values).then(() => {
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
          productError?.status == 409
            ? 'ProductPage.error'
            : 'ProductPage.details'
        }
        values={{ errorCause: productError?.message }}
      />
    </div>
  );

  const title = intl.formatMessage({ id: 'ProductPage.title' });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation
        topbar={
          <>
            <TopbarContainer
              currentPage="ProductPage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            <UserNav currentPage="ProductPage" />
          </>
        }
        sideNav={null}
        useAccountSettingsNav
        currentPage="ProductPage"
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <H3 as="h1" className={css.title}>
            <FormattedMessage id="ProductPage.heading" />
          </H3>
          {pageDetails}
        </div>
      </LayoutSideNavigation>
    </Page>
  );
};

ProductPageComponent.defaultProps = {
  productError: null,
  currentUser: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func } = PropTypes;

ProductPageComponent.propTypes = {
  productError: propTypes.error,
  productInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  onChange: func.isRequired,
  onSubmitProduct: func.isRequired,
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
    productError,
    productInProgress,
    accountSalesd,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.ProductPage;
  const { currentUser } = state.user;
  return {
    productError,
    productInProgress,
    currentUser,
    accountSalesd,
    scrollingDisabled: isScrollingDisabled(state),
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(productClear()),
  onLogout: () => dispatch(logout()),
  onSubmitProduct: values => dispatch(product(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const ProductPage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(ProductPageComponent);

export default ProductPage;