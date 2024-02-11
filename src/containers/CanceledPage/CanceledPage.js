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
  canceled,
  canceledClear,
  resetPassword,
} from './CanceledPage.duck';
import { logout } from '../../ducks/auth.duck';
import css from './CanceledPage.module.css';

export const CanceledPageComponent = props => {
  const {
    canceledError,
    canceledInProgress,
    currentUser,
    onChange,
    onLogout,
    onSubmitCanceled,
    onResetPassword,
    resetPasswordInProgress,
    resetPasswordError,
    accountDeleted,
    scrollingDisabled,
    intl,
  } = props;

  const handleCanceled = values => {
    return onSubmitCanceled(values).then(() => {
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
          canceledError?.status == 409
            ? 'CanceledPage.error'
            : 'CanceledPage.details'
        }
        values={{ errorCause: canceledError?.message }}
      />
    </div>
  );

  const title = intl.formatMessage({ id: 'CanceledPage.title' });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation
        topbar={
          <>
            <TopbarContainer
              currentPage="CanceledPage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            <UserNav currentPage="CanceledPage" />
          </>
        }
        sideNav={null}
        useAccountSettingsNav
        currentPage="CanceledPage"
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <H3 as="h1" className={css.title}>
            <FormattedMessage id="CanceledPage.heading" />
          </H3>
          {pageDetails}
        </div>
      </LayoutSideNavigation>
    </Page>
  );
};

CanceledPageComponent.defaultProps = {
  canceledError: null,
  currentUser: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func } = PropTypes;

CanceledPageComponent.propTypes = {
  canceledError: propTypes.error,
  canceledInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  onChange: func.isRequired,
  onSubmitCanceled: func.isRequired,
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
    canceledError,
    canceledInProgress,
    accountDeleted,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.CanceledPage;
  const { currentUser } = state.user;
  return {
    canceledError,
    canceledInProgress,
    currentUser,
    accountDeleted,
    scrollingDisabled: isScrollingDisabled(state),
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(canceledClear()),
  onLogout: () => dispatch(logout()),
  onSubmitCanceled: values => dispatch(canceled(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const CanceledPage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(CanceledPageComponent);

export default CanceledPage;