import React, { useState } from 'react';
import { bool, node, string } from 'prop-types';
import classNames from 'classnames';
import { compose } from 'redux';
import { connect } from 'react-redux';

import LayoutComposer from '../LayoutComposer';
import LayoutWrapperAccountSettingsSideNav from './LayoutWrapperAccountSettingsSideNav';

import css from './LayoutSideNavigation.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleDown, faCircleDollarToSlot, faContactBook, faDollar, faDollarSign, faEnvelope, faEnvelopeCircleCheck, faEnvelopesBulk, faHistory, faKey, faListSquares, faNetworkWired, faProjectDiagram, faRemove, faTimeline } from '@fortawesome/free-solid-svg-icons';
import NamedLink from '../../NamedLink/NamedLink';
import { injectIntl } from 'react-intl';
import { useLocation, withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import Profile from '../../Profile/Profile';
import { getMarketplaceEntities } from '../../../ducks/marketplaceData.duck';


// Commonly used layout
const LayoutSideNavigationCom = props => {
  const {
    currentUser,
    user,
    className,
    rootClassName,
    containerClassName,
    mainColumnClassName,
    sideNavClassName,
    children,
    topbar: topbarContent,
    footer: footerContent,
    sideNav: sideNavContent,
    useAccountSettingsNav,
    currentPage,
    ...rest
  } = props;

  let roleData = {};
  let role = "";
  if(currentUser !== null){
    roleData = JSON.stringify(currentUser.attributes.profile.protectedData);
    role = JSON.parse(roleData)["role"];
    //console.log(role+"mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm");
 }


  const classes = classNames(rootClassName || css.root, className);
  const containerClasses = containerClassName || css.container;

  // TODO: since responsiveAreas are still experimental,
  //       we don't separate "aside" through layoutComposer
  const layoutAreas = `
    topbar
    main
    footer
  `;

  const ProjectsPage = {
    name: 'ProjectsPage',
    match: { url: '/' },
  };

  const EarningsPage = {
    name: 'EarningsPage',
    match: { url: '/' },
  };

  const PendingProposalsPage = {
    name: 'PendingProposalsPage',
    match: { url: '/' },
  };

  const InboxBasePage = {
    
    match: { url: '/' },
    name: 'InboxPage',
    params: { tab: 'sales' },
  };

  const InboxAsCustomer = {
    
    match: { url: '/' },
    name: 'InboxPage',
    params: { tab: 'orders' },
  };

  const PaypalAppPage = {
    name: 'PaypalAppPage',
    match: { url: '/' },
  };
  
  
  
  const[show,setShow] = useState(false);
  const[showEarningsAction,setShowEarningsAction] = useState(false);
  const[showProjectAction,setShowProjectAction] = useState(false);
  const[showPropsalAction,setShowPropsalAction] = useState(false);
  

  const showMenu = ()=>{
    setShow((show) => true);
  }

  const hideMenu = ()=>{
    setShow((show) => !show);
  }

  const handleShowEarningsAction = (e)=>{
    e.preventDefault();
    setShowEarningsAction(!showEarningsAction);
  }

  const handleShowProjectAction = ()=>{
    setShowProjectAction(!showProjectAction);
  }

  const handleShowPropsalAction = ()=>{
    setShowPropsalAction(!showPropsalAction);
  }

  const location = useLocation();
  const path = location.pathname;

  const isListingProfile = (path.indexOf('u')===1);
  const isPaymentPage = (path ==="/payment" || path ==="/account/projects" || path ==="/account/pending-proposals");


  if(user !== null && user !== undefined){
    user.attributes.profile.protectedData = user.attributes.profile.publicData;
  }

  const showStore = role === 'Seller';

  const userProfileToShow = user && isListingProfile?user:currentUser;

  const profil = userProfileToShow?.profileImage?<Profile user={userProfileToShow} showStore={showStore} />:"";
  const profile = isPaymentPage?"":profil;

  const influencerActions = <>
                        <div  className={classNames(css.dropDown,css.accountSetting)}>
                           
                            <FontAwesomeIcon icon={faDollar}/>
                            <NamedLink {...EarningsPage} className={css.accountSetting} >My Earnings</NamedLink>
                          
                          {
                            showEarningsAction?<>
                              <button onClick={hideMenu}  className={classNames(css.dropDown,css.accountSetting)}>
                                <FontAwesomeIcon icon={faCircleDollarToSlot}/>
                                <NamedLink {...EarningsPage} className={css.accountSetting} >Earnings</NamedLink>
                              </button>
                              <button onClick={hideMenu}  className={classNames(css.dropDown,css.accountSetting)}>
                                <FontAwesomeIcon icon={faListSquares}/>
                                <NamedLink {...EarningsPage} className={css.accountSetting} >Transaction History</NamedLink>
                              </button>
                            </>:""
                          }
                           
                            
                        </div>

                        <div  className={classNames(css.dropDown,css.accountSetting)}>
                           
                            <FontAwesomeIcon icon={faContactBook}/>
                            <NamedLink {...ProjectsPage} className={css.accountSetting} >My projects</NamedLink>
                          
                          {
                            showProjectAction?<>
                              <button onClick={hideMenu}  className={classNames(css.dropDown,css.accountSetting)}>
                                <FontAwesomeIcon icon={faNetworkWired}/>
                                <NamedLink {...ProjectsPage} className={css.accountSetting} >Track Gig</NamedLink>
                              </button>
                              <button onClick={hideMenu}  className={classNames(css.dropDown,css.accountSetting)}>
                                <FontAwesomeIcon icon={faProjectDiagram}/>
                                <NamedLink {...ProjectsPage} className={css.accountSetting} >Projects</NamedLink>
                              </button>
                            </>:""
                          }
                        </div>



                      

                        <div  className={classNames(css.dropDown,css.accountSetting)}>
                          <FontAwesomeIcon icon={faHistory}/>
                          <NamedLink {...PendingProposalsPage} className={css.accountSetting} >Pending Proposal</NamedLink>
                        
                          
                          {
                            showPropsalAction?<>
                              <button onClick={hideMenu}  className={classNames(css.dropDown,css.accountSetting)}>
                                <FontAwesomeIcon icon={faEnvelopeCircleCheck}/>
                                <NamedLink {...PendingProposalsPage} className={css.accountSetting} >Gig Proposal</NamedLink>
                              </button>
                              <button onClick={hideMenu}  className={classNames(css.dropDown,css.accountSetting)}>
                                <FontAwesomeIcon icon={faEnvelopesBulk}/>
                                <NamedLink {...PendingProposalsPage} className={css.accountSetting} >Pending Proposal</NamedLink>
                              </button>
                            </>:""
                          }
                        
                        </div>

                        <button onClick={hideMenu}  className={classNames(css.dropDown,css.accountSetting)}>
                          <FontAwesomeIcon icon={faEnvelope}/>
                          <NamedLink {...InboxAsCustomer} className={css.accountSetting} >Messages</NamedLink>
                        </button>

                       
  </>;

  const sellerActions = <>
        

                        <button onClick={hideMenu}  className={classNames(css.dropDown,css.accountSetting)}>
                          <FontAwesomeIcon icon={faContactBook}/>
                          <NamedLink {...ProjectsPage} className={css.accountSetting} >My Jobs</NamedLink>
                        </button>

                        <button onClick={hideMenu}  className={classNames(css.dropDown,css.accountSetting)}>
                          <FontAwesomeIcon icon={faDollarSign}/>
                          <NamedLink {...PaypalAppPage} className={css.accountSetting} >Payments</NamedLink>
                        </button>

                        <button onClick={hideMenu}  className={classNames(css.dropDown,css.accountSetting)}>
                          <FontAwesomeIcon icon={faEnvelope}/>
                          <NamedLink {...InboxBasePage} className={css.accountSetting} >Messages</NamedLink>
                        </button>
  </>
  
  const userAction = role === "Seller"?sellerActions:influencerActions;

  return (
    <LayoutComposer areas={layoutAreas} className={classes} {...rest}>
      {layoutProps => {
        const { Topbar, Main, Footer } = layoutProps;
        return (
          <>
            <Topbar as="header" className={css.topbar}>
              {topbarContent}
            </Topbar>
            <Main as="div" className={containerClasses}>
              <aside className={classNames(css.sideNav, sideNavClassName)}>
                    <div className={css.navMenu} onClick={hideMenu} >
                    <h3 className={classNames(css.role,css.dropDownmain)}>{role}</h3>

                       {userAction}
                        
                    </div>
              

              </aside>
              <div className={classNames(css.main, mainColumnClassName)}>
                
                <main className={css.magL2} >{children}</main>
              </div>
              
              {profile}
              
            </Main>
            <Footer>{footerContent}</Footer>
          </>
        );
      }}
    </LayoutComposer>
  );
};

LayoutSideNavigationCom.displayName = 'LayoutSideNavigation';

LayoutSideNavigationCom.defaultProps = {
  className: null,
  rootClassName: null,
  sideNav: null,
  footer: null,
  useAccountSettingsNav: false,
  currentPage: null,
};

LayoutSideNavigationCom.propTypes = {
  className: string,
  rootClassName: string,
  children: node.isRequired,
  topbar: node.isRequired,
  sideNav: node,
  footer: node,
  useAccountSettingsNav: bool,
  currentPage: string,
};


const mapStateToProps = state => {
  
  const { currentUser } = state.user;
  const {
    userId,
    userListingRefs,
    reviews,
  } = state.ProfilePage;
  const userMatches = getMarketplaceEntities(state, [{ type: 'user', id: userId }]);
  const user = userMatches.length === 1 ? userMatches[0] : null;
  const listings = getMarketplaceEntities(state, userListingRefs);
  return {
    currentUser,
    user,
    listings,
    reviews,
    
  };
};



// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const LayoutSideNavigation = compose(
  withRouter,
  connect(
    mapStateToProps
  ),
  injectIntl
)(LayoutSideNavigationCom);

export default LayoutSideNavigation;
