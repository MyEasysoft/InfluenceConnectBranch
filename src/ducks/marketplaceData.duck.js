import { useDispatch } from 'react-redux';
import { updatedEntities, denormalisedEntities } from '../util/data';


// ================ Action types ================ //

export const ADD_MARKETPLACE_ENTITIES = 'app/marketplaceData/ADD_MARKETPLACE_ENTITIES';
export const ADD_MARKETPLACE_ENTITIES_LAND = 'app/marketplaceData/ADD_MARKETPLACE_ENTITIES_LAND';
export const ADD_MARKETPLACE_ENTITIES_SELLER = 'app/marketplaceData/ADD_MARKETPLACE_ENTITIES_SELLER';
export const ADD_MARKETPLACE_ENTITIES_CHANGE_USER_TO_BE_PAID = 'app/marketplaceData/ADD_MARKETPLACE_ENTITIES_CHANGE_USER_TO_BE_PAID';

// ================ Reducer ================ //

const initialState = {
  // Database of all the fetched entities.
  entities: {},
};

const merge = (state, payload) => {
  const { sdkResponse, sanitizeConfig } = payload;
  const apiResponse = sdkResponse.data;
  return {
    ...state,
    entities: updatedEntities({ ...state.entities }, apiResponse, sanitizeConfig),
  };
};

const mergeLand = (state, payload) => {
  const { sdkResponse, sanitizeConfig } = payload;
  const apiResponse = sdkResponse.data;
  const included = sdkResponse.data.included;
  
  return {
    ...state,
    data: apiResponse,
    images:included,
  };
};

const changeUserToPay = (state, payload) => {
  const { sdkResponse, sanitizeConfig } = payload;
  const userr = sdkResponse.data;
  const included = sdkResponse.included;
  return {
    ...state,
    userToPay: userr,
    userToPayImages:included,
  };
};

export default function marketplaceDataReducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case ADD_MARKETPLACE_ENTITIES:
      return merge(state, payload);

    case ADD_MARKETPLACE_ENTITIES_LAND:
      return mergeLand(state, payload);

    case ADD_MARKETPLACE_ENTITIES_SELLER:
    return merge(state, payload);

    case ADD_MARKETPLACE_ENTITIES_CHANGE_USER_TO_BE_PAID:
      return changeUserToPay(state, payload);

    default:
      return state;
  }
}



// ================ Selectors ================ //

/**
 * Get the denormalised listing entities with the given IDs
 *
 * @param {Object} state the full Redux store
 * @param {Array<UUID>} listingIds listing IDs to select from the store
 */
export const getListingsById = (state, listingIds) => {
  const { entities } = state.marketplaceData;
  const resources = listingIds.map(id => ({
    id,
    type: 'listing',
  }));
  const throwIfNotFound = false;
  return denormalisedEntities(entities, resources, throwIfNotFound);
};

/**
 * Get the denormalised entities from the given entity references.
 *
 * @param {Object} state the full Redux store
 *
 * @param {Array<{ id, type }} entityRefs References to entities that
 * we want to query from the data. Currently we expect that all the
 * entities have the same type.
 *
 * @return {Array<Object>} denormalised entities
 */
export const getMarketplaceEntities = (state, entityRefs) => {
  const { entities } = state.marketplaceData;
  const throwIfNotFound = false;
  return denormalisedEntities(entities, entityRefs, throwIfNotFound);
};


// ================ Action creators ================ //

export const addMarketplaceEntities = (sdkResponse, sanitizeConfig) => ({
  type: ADD_MARKETPLACE_ENTITIES,
  payload: { sdkResponse, sanitizeConfig },
});

export const addMarketplaceEntities2 = (sdkResponse) => ({
  type: ADD_MARKETPLACE_ENTITIES_LAND,
  payload: { sdkResponse },
});

export const addMarketplaceEntitiesForSellerPayment = (sdkResponse) => ({
  type: ADD_MARKETPLACE_ENTITIES_SELLER,
  payload: { sdkResponse },
});

export const changeMarketPlaceUserToPay = (sdkResponse) => ({
  type: ADD_MARKETPLACE_ENTITIES_CHANGE_USER_TO_BE_PAID,
  payload: { sdkResponse },
});
