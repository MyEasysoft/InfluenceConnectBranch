import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from '../../util/reactIntl';
import classNames from 'classnames';
import { ACCOUNT_SETTINGS_PAGES } from '../../routing/routeConfiguration';
import { LinkTabNavHorizontal } from '../../components';

import css from './UserNav.module.css';
import ReactDropdown from 'react-dropdown';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withViewport } from '../../util/uiHelpers';

const UserNavCom = props => {
  const { className, rootClassName, currentPage,currentUser } = props;
  const classes = classNames(rootClassName || css.root, className);
  const role = currentUser?.attributes?.profile?.protectedData?.role ;

const onSelect = (e)=>{
  e.preventDefault();
  
}

const manageListings = role === "Seller"? "UserNav.yourJobs":"UserNav.yourGigs";

  const tabs = [

    {
      text: <FormattedMessage id="UserNav.dashboard" />,
      selected: currentPage === 'ProjectsPage',
      disabled: false,
      linkProps: {
        name: 'ProjectsPage',
      },
    },
   
    {
      text: <FormattedMessage id={manageListings} />,
      selected: currentPage === 'ManageListingsPage',
      linkProps: {
        name: 'ManageListingsPage',
      },
    },
    {
      text: <FormattedMessage id="UserNav.profileSettings" />,
      selected: currentPage === 'ProfileSettingsPage',
      disabled: false,
      linkProps: {
        name: 'ProfileSettingsPage',
      },
    },
   
  ];

  return (
    <>
    
       <LinkTabNavHorizontal className={classes} tabRootClassName={css.tab} tabs={tabs} skin="dark" />
   
    </>
   
  );
};

UserNavCom.defaultProps = {
  className: null,
  rootClassName: null,
};

const { string } = PropTypes;

UserNavCom.propTypes = {
  className: string,
  rootClassName: string,
  currentPage: string.isRequired,
};


const mapStateToProps = state => {
  const { currentUser } = state.user;
 
  return {
    currentUser,
  };
};

const UserNav = compose(
  connect(mapStateToProps),
  withViewport,
  injectIntl
)(UserNavCom);



export default UserNav;
