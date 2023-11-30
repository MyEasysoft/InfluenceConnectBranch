import React from 'react';
import loadable from '@loadable/component';

import { bool, object } from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { camelize } from '../../util/string';
import { propTypes } from '../../util/types';

import FallbackPage from './FallbackPage';
import { ASSET_NAME } from './LandingPage.duck';
import { getMarketplaceEntities } from '../../ducks/marketplaceData.duck';

const PageBuilder = loadable(() =>
  import(/* webpackChunkName: "PageBuilder" */ '../PageBuilder/PageBuilder')
);

export const LandingPageComponent = props => {
  const { pageAssetsData, inProgress, error } = props;

  const {
    currentUser,
    fetchInProgress,
    fetchOrdersOrSalesError,
    intl,
    pagination,
    params,
    providerNotificationCount,
    scrollingDisabled,
    transactions,
  } = props;

  const onUpdateStateInboxCount = val =>{

  }

  const seenMessages = currentUser?.attributes?.profile?.protectedData?.seenMessages;

  const countUnseenMsg = (obj,seenMsg) => {
    let count = 0;
    if(obj === undefined || obj === null)return[];
    const keys = Object?.keys(obj);
    keys.forEach(key => {
      try{
        const seen = checkIfSeen(seenMsg,obj[key].id.uuid);
          if(seen){
            count+=1;
          }
      }catch(error){}
    });

    const countt = parseInt(keys.length) - parseInt(count);
    return countt;
  };

  const checkIfSeen = (listOfSeenMsg,idToCheck)=>{
    let flag = false;
    if(listOfSeenMsg === undefined || listOfSeenMsg === null)return[];
    const keys = Object?.keys(listOfSeenMsg);
    keys.forEach(key => {
      try{
          if(parseInt(listOfSeenMsg[0]) !== undefined && listOfSeenMsg[key].id === idToCheck && !flag){
            flag = true;
          }
      }catch(error){}
    });
    return flag;
  }

  let noOfUnseenMessages = 0;

  if(transactions != null  && transactions != undefined && transactions[0] != undefined){
    noOfUnseenMessages = countUnseenMsg(transactions,seenMessages);
    console.log(noOfUnseenMessages +"ggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg");
    onUpdateStateInboxCount(noOfUnseenMessages);
  }

  return (
    <PageBuilder
      pageAssetsData={pageAssetsData?.[camelize(ASSET_NAME)]?.data}
      inProgress={inProgress}
      error={error}
      fallbackPage={<FallbackPage error={error} />}
      noOfUnseenMessages={noOfUnseenMessages}
    />
  );
};

LandingPageComponent.propTypes = {
  pageAssetsData: object,
  inProgress: bool,
  error: propTypes.error,
};

const mapStateToProps = state => {
  const { pageAssetsData, inProgress, error } = state.hostedAssets || {};
  const { fetchInProgress, fetchOrdersOrSalesError, pagination, transactionRefs } = state.InboxPage;
  const { currentUser, currentUserNotificationCount: providerNotificationCount } = state.user;
  return {
    pageAssetsData,
    inProgress,
    error,
    currentUser,
    fetchInProgress,
    fetchOrdersOrSalesError,
    pagination,
    providerNotificationCount,
    transactions: getMarketplaceEntities(state, transactionRefs),
  };



};

// Note: it is important that the withRouter HOC is **outside** the
// connect HOC, otherwise React Router won't rerender any Route
// components since connect implements a shouldComponentUpdate
// lifecycle hook.
//
// See: https://github.com/ReactTraining/react-router/issues/4671
const LandingPage = compose(connect(mapStateToProps))(LandingPageComponent);

export default LandingPage;
