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
  refunds,
  refundsClear,
  resetPassword,
} from './RefundsPage.duck';
import { logout } from '../../ducks/auth.duck';
import css from './RefundsPage.module.css';

export const RefundsPageComponent = props => {
  const {
    refundsError,
    refundsInProgress,
    currentUser,
    onChange,
    onLogout,
    onSubmitRefunds,
    onResetPassword,
    resetPasswordInProgress,
    resetPasswordError,
    accountProjects,
    scrollingDisabled,
    intl,
  } = props;

  const handleRefunds = values => {
    return onSubmitRefunds(values).then(() => {
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
          refundsError?.status == 409
            ? 'RefundsPage.error'
            : 'RefundsPage.details'
        }
        values={{ errorCause: refundsError?.message }}
      />
    </div>
  );

  const title = intl.formatMessage({ id: 'RefundsPage.title' });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation
        topbar={
          <>
            <TopbarContainer
              currentPage="RefundsPage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            <UserNav currentPage="RefundsPage" />
          </>
        }
        sideNav={null}
        useAccountSettingsNav
        currentPage="RefundsPage"
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <H3 as="h1" className={css.title}>
            <FormattedMessage id="RefundsPage.heading" />
          </H3>
          {pageDetails}
        </div>
      </LayoutSideNavigation>
    </Page>
  );
};

RefundsPageComponent.defaultProps = {
  refundsError: null,
  currentUser: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func } = PropTypes;

RefundsPageComponent.propTypes = {
  refundsError: propTypes.error,
  refundsInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  onChange: func.isRequired,
  onSubmitRefunds: func.isRequired,
  accountProjectsd: bool.isRequired,
  scrollingDisabled: bool.isRequired,
  resetPasswordInProgress: bool,
  resetPasswordError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  // Topbar needs user info.
  const {
    refundsError,
    refundsInProgress,
    accountProjectsd,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.RefundsPage;
  const { currentUser } = state.user;
  return {
    refundsError,
    refundsInProgress,
    currentUser,
    accountProjectsd,
    scrollingDisabled: isScrollingDisabled(state),
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(refundsClear()),
  onLogout: () => dispatch(logout()),
  onSubmitRefunds: values => dispatch(refunds(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const RefundsPage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(RefundsPageComponent);

export default RefundsPage;