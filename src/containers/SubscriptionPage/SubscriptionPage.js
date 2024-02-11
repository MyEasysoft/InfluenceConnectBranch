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
import SubscriptionSelectorForm from '../../components/SubscriptionSellector/SubscriptionSelectorForm';

import {
  subscription,
  subscriptionClear,
  resetPassword,
} from '../SubscriptionPage/SubscriptionPage.duck';
import { logout } from '../../ducks/auth.duck';
import css from './SubscriptionPage.module.css';

export const SubscriptionPageComponent = props => {
  const {
    subscriptionError,
    subscriptionInProgress,
    currentUser,
    onChange,
    onLogout,
    onSubmitSubscription,
    onResetPassword,
    resetPasswordInProgress,
    resetPasswordError,
    subscription,
    scrollingDisabled,
    intl,
  } = props;

  const handleSubscription = values => {
    return onSubmitSubscription(values).then(() => {
      onLogout();
    });
  };

  useEffect(() => {
    return onChange();
  }, []);

  const pageDetails = (
    <div className={css.details}>
      <SubscriptionSelectorForm />
    </div>
  );

  const title = intl.formatMessage({ id: 'SubscriptionPage.title' });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation
        topbar={
          <>
            <TopbarContainer
              currentPage="SubscriptionPage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            <UserNav currentPage="SubscriptionPage" />
          </>
        }
        sideNav={null}
        useAccountSettingsNav
        currentPage="SubscriptionPage"
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <H3 as="h1" className={css.title}>
            <FormattedMessage id="SubscriptionPage.heading" />
          </H3>
          {pageDetails}
        </div>
      </LayoutSideNavigation>
    </Page>
  );
};

SubscriptionPageComponent.defaultProps = {
  subscriptionError: null,
  currentUser: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func } = PropTypes;

SubscriptionPageComponent.propTypes = {
  subscriptionError: propTypes.error,
  subscriptionInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  onChange: func.isRequired,
  onSubmitSubscription: func.isRequired,
  subscription: bool,
  scrollingDisabled: bool.isRequired,
  resetPasswordInProgress: bool,
  resetPasswordError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  // Topbar needs user info.
  const {
    subscriptionError,
    subscriptionInProgress,
    subscription,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.SubscriptionPage;
  const { currentUser } = state.user;
  return {
    subscriptionError,
    subscriptionInProgress,
    currentUser,
    subscription,
    scrollingDisabled: isScrollingDisabled(state),
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(subscriptionClear()),
  onLogout: () => dispatch(logout()),
  onSubmitSubscription: values => dispatch(subscription(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const SubscriptionPage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(SubscriptionPageComponent);

export default SubscriptionPage;