import { fetchPageAssets } from '../../ducks/hostedAssets.duck';
export const ASSET_NAME = 'landing-page';

import { addMarketplaceEntities, addMarketplaceEntities2 } from '../../ducks/marketplaceData.duck';
import { createImageVariantConfig } from '../../util/sdkLoader';
import { parse } from '../../util/urlHelpers';
import { getAllTransitionsForEveryProcess } from '../../transactions/transaction';
import { storableError } from '../../util/errors';


// ================ Thunks ================ //
const INBOX_PAGE_SIZE = 10;

const sortedTransactions = txs =>
  reverse(
    sortBy(txs, tx => {
      return tx.attributes ? tx.attributes.lastTransitionedAt : null;
    })
  );

// ================ Action types ================ //

export const FETCH_ORDERS_OR_SALES_REQUEST = 'app/InboxPage/FETCH_ORDERS_OR_SALES_REQUEST';
export const FETCH_ORDERS_OR_SALES_SUCCESS = 'app/InboxPage/FETCH_ORDERS_OR_SALES_SUCCESS';
export const FETCH_ORDERS_OR_SALES_ERROR = 'app/InboxPage/FETCH_ORDERS_OR_SALES_ERROR';

// ================ Reducer ================ //

const entityRefs = entities =>
  entities.map(entity => ({
    id: entity.id,
    type: entity.type,
  }));

const initialState = {
  fetchInProgress: false,
  fetchOrdersOrSalesError: null,
  pagination: null,
  transactionRefs: [],
};

export default function inboxPageReducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case FETCH_ORDERS_OR_SALES_REQUEST:
      return { ...state, fetchInProgress: true, fetchOrdersOrSalesError: null };
    case FETCH_ORDERS_OR_SALES_SUCCESS: {
      const transactions = sortedTransactions(payload.data.data);
      console.log("vvvvvvvvvvvvvvvvvvvvvvvvvvccccccccccccccccccccccccccccc");
      return {
        ...state,
        fetchInProgress: false,
        transactionRefs: entityRefs(transactions),
        pagination: payload.data.meta,
      };
    }
    case FETCH_ORDERS_OR_SALES_ERROR:
      console.error(payload); // eslint-disable-line
      return { ...state, fetchInProgress: false, fetchOrdersOrSalesError: payload };

    default:
      return state;
  }
}

// ================ Action creators ================ //

const fetchOrdersOrSalesRequest = () => ({ type: FETCH_ORDERS_OR_SALES_REQUEST });


const fetchOrdersOrSalesSuccess = response => ({
  type: FETCH_ORDERS_OR_SALES_SUCCESS,
  payload: response,
});
const fetchOrdersOrSalesError = e => ({
  type: FETCH_ORDERS_OR_SALES_ERROR,
  error: true,
  payload: e,
});



export const loadData = (params, search,config) => (dispatch, getState, sdk) => {
  const pageAsset = { landingPage: `content/pages/${ASSET_NAME}.json` };

  const {
    aspectWidth = 1,
    aspectHeight = 1,
    variantPrefix = 'listing-card',
  } = config.layout.listingImage;
  const aspectRatio = aspectHeight / aspectWidth;
  
  // sdk.listings.query({
  //   perPage: 5
  // }).then(res => {
  //   // res.data contains the response data
  //   console.log("Request Success with status:------------------------------------------" + JSON.stringify(res.data.data));
  // });

  sdk.listings
  .query({ perPage: 5 ,
    include: ['images'],
    'fields.listing': [
      'title',
      'geolocation',
      'price',
      'publicData.listingType',
      'publicData.transactionProcessAlias',
      'publicData.unitType',
      // These help rendering of 'purchase' listings,
      // when transitioning from search page to listing page
      'publicData.pickupEnabled',
      'publicData.shippingEnabled',
    ],
    'fields.user': ['profile.displayName', 'profile.abbreviatedName'],
    'fields.image': [
      'variants.scaled-small',
      'variants.scaled-medium',
      `variants.${variantPrefix}`,
      `variants.${variantPrefix}-2x`,
    ],
    ...createImageVariantConfig(`${variantPrefix}`, 400, aspectRatio),
    ...createImageVariantConfig(`${variantPrefix}-2x`, 800, aspectRatio),
    'limit.images': 1,


  })
  .then(response => {

    const listingFields = config?.listing?.listingFields;
    const sanitizeConfig = { listingFields };
    console.log("Request Success with status:------------------------------------------" + response.data.data);
    dispatch(addMarketplaceEntities2(response));
    console.log("Request Savedd with status:---oooooooooooooooooooooooooooooooooooooooooooo    " + response.data.data);
    
  })
  .catch(res => {
    // An error occurred
    console.log(`Request failed with status: ${res.status} ${res.statusText}`);
  });


  const currentUser = getState().user.currentUser;
  if(currentUser === null){
    return dispatch(fetchPageAssets(pageAsset, true));
  }

  const tab  = "sales";
  const onlyFilterValues = {
    orders: 'order',
    sales: 'sale',
  };
  //console.log("Request Savedd with status:---xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    ");

  const onlyFilter = onlyFilterValues[tab];
  if (!onlyFilter) {
    return Promise.reject(new Error(`Invalid tab for InboxPage: ${tab}`));
  }
  //console.log("Request Savedd with status:---------------------------111---------------------------    ");

 dispatch(fetchOrdersOrSalesRequest());
  const { page = 1 } = parse(search);
  //console.log("Request Savedd with status:---------------------------2222---------------------------    ");

  const apiQueryParams = {
    only: onlyFilter,
    lastTransitions: getAllTransitionsForEveryProcess(),
    include: [
      'listing',
      'provider',
      'provider.profileImage',
      'customer',
      'customer.profileImage',
      'booking',
    ],
    'fields.transaction': [
      'processName',
      'lastTransition',
      'lastTransitionedAt',
      'transitions',
      'payinTotal',
      'payoutTotal',
      'lineItems',
    ],
    'fields.listing': ['title', 'availabilityPlan', 'publicData.listingType'],
    'fields.user': ['profile.displayName', 'profile.abbreviatedName'],
    'fields.image': ['variants.square-small', 'variants.square-small2x'],
    page,
    perPage: INBOX_PAGE_SIZE,
  };
  console.log("Request Savedd with status:---jjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj    ");

   sdk.transactions
    .query(apiQueryParams)
    .then(response => {
     dispatch(addMarketplaceEntities(response));
      dispatch(fetchOrdersOrSalesSuccess(response));
      console.log("Request Savedd with status:---hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh    ");
      //return response;
    })
    .catch(e => {
      console.log(e +"             eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee");
      dispatch(fetchOrdersOrSalesError(storableError(e)));
      throw e;
    });

  return dispatch(fetchPageAssets(pageAsset, true));
};
