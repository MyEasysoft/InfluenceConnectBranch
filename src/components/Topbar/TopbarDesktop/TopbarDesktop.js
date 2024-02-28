import React, { useState, useEffect } from 'react';
import { bool, func, object, number, string } from 'prop-types';
import classNames from 'classnames';

import { FormattedMessage, intlShape } from '../../../util/reactIntl';
import { ACCOUNT_SETTINGS_PAGES } from '../../../routing/routeConfiguration';
import { propTypes } from '../../../util/types';
import {
  Avatar,
  InlineTextButton,
  LinkedLogo,
  Menu,
  MenuLabel,
  MenuContent,
  MenuItem,
  NamedLink,
} from '../../../components';

import TopbarSearchForm from '../TopbarSearchForm/TopbarSearchForm';

import css from './TopbarDesktop.module.css';
import csss from './TopbarNav.module.css';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';

const TopbarDesktop = props => {
  const {
    className,
    appConfig,
    currentUser,
    currentPage,
    rootClassName,
    currentUserHasListings,
    notificationCount,
    intl,
    isAuthenticated,
    onLogout,
    onSearchSubmit,
    initialSearchFormValues,
    noOfUnseenMessages,
  } = props;
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const history = useHistory();

  const marketplaceName = appConfig.marketplaceName;
  const authenticatedOnClientSide = mounted && isAuthenticated;
  const isAuthenticatedOrJustHydrated = isAuthenticated || !mounted;
  const isLandingPage =(currentPage===null||currentPage.includes("LandingPage"))?true:false;
  const role = currentUser?.attributes?.profile?.protectedData?.role ;

  const classes = classNames(rootClassName || css.root, className);

  const search = (
    <TopbarSearchForm
      className={css.searchLink }
      desktopInputRoot={css.topbarSearchWithLeftPadding}
      onSubmit={onSearchSubmit}
      initialValues={initialSearchFormValues}
      appConfig={appConfig}
    />
  );

  console.log(noOfUnseenMessages +"----------------------------------------------------------------------------");
  const notificationDot = noOfUnseenMessages > 0 ? <div className={css.notificationDot} >{noOfUnseenMessages}</div> : null;

  const inboxLink = authenticatedOnClientSide ? (
    <NamedLink
      className={css.inboxLink}
      name="InboxPage"
      params={{ tab: currentUserHasListings ? 'sales' : 'orders' }}
    >
      <span className={css.inbox}>
        <FormattedMessage id="TopbarDesktop.inbox" />
        {notificationDot}
      </span>
    </NamedLink>
  ) : null;

  const currentPageClass = page => {
    const isAccountSettingsPage =
      page === 'AccountSettingsPage' && ACCOUNT_SETTINGS_PAGES.includes(currentPage);
    return currentPage === page || isAccountSettingsPage ? css.currentPage : null;
  };

  const profileMenu = authenticatedOnClientSide ? (
    <Menu>
      <MenuLabel className={css.profileMenuLabel} isOpenClassName={css.profileMenuIsOpen}>
        <Avatar className={css.avatar} user={currentUser} disableProfileLink />
      </MenuLabel>
      <MenuContent className={css.profileMenuContent}>
        <MenuItem key="ManageListingsPage">
          <NamedLink
            className={classNames(css.yourListingsLink, currentPageClass('ManageListingsPage'))}
            name="ManageListingsPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.yourListingsLink" />
          </NamedLink>
        </MenuItem>
        <MenuItem key="ProfileSettingsPage">
          <NamedLink
            className={classNames(css.profileSettingsLink, currentPageClass('ProfileSettingsPage'))}
            name="ProfileSettingsPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.profileSettingsLink" />
          </NamedLink>
        </MenuItem>
        <MenuItem key="AccountSettingsPage">
          <NamedLink
            className={classNames(css.yourListingsLink, currentPageClass('ProjectsPage'))}
            name="ProjectsPage"
          >
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.projectPageLink" />
          </NamedLink>
        </MenuItem>
        <MenuItem key="logout">
          <InlineTextButton rootClassName={css.logoutButton} onClick={onLogout}>
            <span className={css.menuItemBorder} />
            <FormattedMessage id="TopbarDesktop.logout" />
          </InlineTextButton>
        </MenuItem>
      </MenuContent>
    </Menu>
  ) : null;

  const signupLink = isAuthenticatedOrJustHydrated ? null : (
    <NamedLink name="SignupPage" className={css.signupLink}>
      <span className={css.signup}>
        <FormattedMessage id="TopbarDesktop.signup" />
      </span>
    </NamedLink>
  );

  const loginLink = isAuthenticatedOrJustHydrated ? null : (
    <NamedLink name="LoginPage" className={css.loginLink}>
      <span className={css.login}>
        <FormattedMessage id="TopbarDesktop.login" />
      </span>
    </NamedLink>
  );

  
  const profileMenuContainer = isLandingPage && isAuthenticatedOrJustHydrated ? "" :  (
    <div className={csss.iconRow}>
      {inboxLink}
      {profileMenu}
    </div>
  );

  const location = useLocation();
  const path = location.pathname;

  const listingText = role === "Seller"?"TopbarDesktop.createJob":"TopbarDesktop.createGig";
//(path==="/" || path==="/login" || path==="/account/seller-instruction" || path==="/signup" || path==="/s")?"":
  const newListLink = 
    <NamedLink className={css.createListingLink} name="NewListingPage">
      <span className={css.createListing}>
        <FormattedMessage id={listingText} />
      </span>
    </NamedLink>
  ;

  const findProduct = (event)=>{
    event.preventDefault();
    
    history.push("/s?pub_role=Sellers")
    
  }

  const findInfluencers = (event)=>{
    event.preventDefault();
    
    history.push("/s?pub_role=Influencers")
    
  }

  const findSellers = (event)=>{
    event.preventDefault();
    
    history.push("/s?pub_role=Sellers")
    
  }

 

  return (


    <div className='container-main main-bg'>
    <section className="hero">
        <nav className={csss}>
           
           
            <div className={csss.links}>
            <LinkedLogo
              className={css.logoLink}
              format="desktop"
              alt={intl.formatMessage({ id: 'TopbarDesktop.logo' }, { marketplaceName })}
            />
              
              <div className={css.findBtnContainer}>
               
                <button onClick={findProduct}>
                 Find Products
                </button>

                <button onClick={findInfluencers}>
                  Find Influencers
                </button>

                <button onClick={findSellers}>
                  Find Sellers
                </button>
              </div>
             
            </div>
           
            <div className={csss.search}>
              <div className={csss.searchcontrol}>
                 {search}
              </div>
              {loginLink}
              {newListLink}
              {inboxLink}
              {profileMenu}
     
            </div>

            
           
        </nav>
      
     
    </section>

  </div>


    
  );
};

TopbarDesktop.defaultProps = {
  rootClassName: null,
  className: null,
  currentUser: null,
  currentPage: null,
  notificationCount: 0,
  initialSearchFormValues: {},
  appConfig: null,
  noOfUnseenMessages:0,
};

TopbarDesktop.propTypes = {
  rootClassName: string,
  className: string,
  currentUserHasListings: bool.isRequired,
  currentUser: propTypes.currentUser,
  currentPage: string,
  isAuthenticated: bool.isRequired,
  onLogout: func.isRequired,
  notificationCount: number,
  onSearchSubmit: func.isRequired,
  initialSearchFormValues: object,
  intl: intlShape.isRequired,
  appConfig: object,
  noOfUnseenMessages:number
};

export default TopbarDesktop;
