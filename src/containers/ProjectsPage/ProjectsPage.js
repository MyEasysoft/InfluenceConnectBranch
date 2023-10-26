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
  projects,
  projectsClear,
  resetPassword,
} from './ProjectsPage.duck';
import { logout } from '../../ducks/auth.duck';
import css from './ProjectsPage.module.css';
import EarningsPageViewComponent from '../../components/EarningsPageView/EarningsPageView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalculator } from '@fortawesome/free-solid-svg-icons';

export const ProjectsPageComponent = props => {
  const {
    projectsError,
    projectsInProgress,
    currentUser,
    onChange,
    onLogout,
    onSubmitProjects,
    onResetPassword,
    resetPasswordInProgress,
    resetPasswordError,
    accountDeleted,
    scrollingDisabled,
    intl,
  } = props;

  const handleProjects = values => {
    return onSubmitProjects(values).then(() => {
      onLogout();
    });
  };

  useEffect(() => {
    return onChange();
  }, []);

  

  const totalTransactionLabel = 'TOTAL EXPECTED';
  const totalTransactionValue = '$43,000';
  const showTotalTransaction = true;

  const totalCompletedLabel = 'TOTAL COMPLETED';
  const totaLCompletedValue = '23';
  const showTotalCompleted = true;

  const totalDeclinedLabel = 'TOTAL EARNINGS';
  const totalDeclinedValue = '$34,000';
  const showTotalDeclined = true;

  const totalProfitLabel = 'TOTAL LOSS';
  const totalProfitValue = '$9,000';
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


  const title = intl.formatMessage({ id: 'ProjectsPage.title' });

  return (
    <Page title={title} scrollingDisabled={scrollingDisabled}>
      <LayoutSideNavigation
        topbar={
          <>
            <TopbarContainer
              currentPage="ProjectsPage"
              desktopClassName={css.desktopTopbar}
              mobileClassName={css.mobileTopbar}
            />
            <UserNav currentPage="ProjectsPage" />
           
          </>
        }
        sideNav={null}
        useAccountSettingsNav
        currentPage="ProjectsPage"
        footer={<FooterContainer />}
      >
        <div className={css.content}>
          <H3 as="h1" className={css.title}>
            <FormattedMessage id="ProjectsPage.heading" />
          </H3>
          {pageDetails}
        </div>
      </LayoutSideNavigation>
    </Page>
  );
};

ProjectsPageComponent.defaultProps = {
  projectsError: null,
  currentUser: null,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

const { bool, func } = PropTypes;

ProjectsPageComponent.propTypes = {
  projectsError: propTypes.error,
  projectsInProgress: bool.isRequired,
  currentUser: propTypes.currentUser,
  onChange: func.isRequired,
  onSubmitProjects: func.isRequired,
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
    projectsError,
    projectsInProgress,
    accountDeleted,
    resetPasswordInProgress,
    resetPasswordError,
  } = state.ProjectsPage;
  const { currentUser } = state.user;
  return {
    projectsError,
    projectsInProgress,
    currentUser,
    accountDeleted,
    scrollingDisabled: isScrollingDisabled(state),
    resetPasswordInProgress,
    resetPasswordError,
  };
};

const mapDispatchToProps = dispatch => ({
  onChange: () => dispatch(projectsClear()),
  onLogout: () => dispatch(logout()),
  onSubmitProjects: values => dispatch(projects(values)),
  onResetPassword: values => dispatch(resetPassword(values)),
});

const ProjectsPage = compose(
  connect(mapStateToProps, mapDispatchToProps),
  injectIntl
)(ProjectsPageComponent);

export default ProjectsPage;