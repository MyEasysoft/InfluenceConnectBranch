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
import SubmitForm from '../../containers/AuthenticationPage/SignupForm/SignupForm'

import {
  gigs,
  gigsClear,
  resetPassword,
} from './GigsPage.duck';
import { logout } from '../../ducks/auth.duck';
import css from './GigsPage.module.css';

export const GigsPageComponent = props => {
  const {
    gigsError,
    gigsInProgress,
    currentUser,
    onChange,
    onLogout,
    onSubmitGigs,
    onResetPassword,
    resetPasswordInProgress,
    resetPasswordError,
    accountSales,
    scrollingDisabled,
    intl,
  } = props;

  const handleGigs = values => {
    return onSubmitGigs(values).then(() => {
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
          gigsError?.status == 409
            ? 'GigsPage.error'
            : 'GigsPage.details'
        }
        values={{ errorCause: gigsError?.message }}
      />
    </div>
  );

  const title = intl.formatMessage({ id: 'GigsPage.title' });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation
        topbar={
          <>
            <TopbarContainer
              currentPage="GigsPage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            <UserNav currentPage="GigsPage" />
          </>
        }
        sideNav={null}
        useAccountSettingsNav
        currentPage="GigsPage"
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <H3 as="h1" className={css.title}>
            <FormattedMessage id="GigsPage.heading" />
          </H3>
          {pageDetails}
        </div>
      </LayoutSideNavigation>
    </Page>
  );
};

GigsPageComponent.defaultProps = {
  gigsError: null,
  currentUser: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func } = PropTypes;

GigsPageComponent.propTypes = {
  gigsError: propTypes.error,
  gigsInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  onChange: func.isRequired,
  onSubmitGigs: func.isRequired,
  gigs: bool,
  scrollingDisabled: bool.isRequired,
  resetPasswordInProgress: bool,
  resetPasswordError: propTypes.error,

  // from injectIntl
  intl: intlShape.isRequired,
};

const mapStateToProps = state => {
  // Topbar needs user info.
  const {
    gigsError,
    gigsInProgress,
    gigs,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.GigsPage;
  const { currentUser } = state.user;
  return {
    gigsError,
    gigsInProgress,
    currentUser,
    gigs,
    scrollingDisabled: isScrollingDisabled(state),
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(gigsClear()),
  onLogout: () => dispatch(logout()),
  onSubmitGigs: values => dispatch(gigs(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const GigsPage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(GigsPageComponent);

export default GigsPage;