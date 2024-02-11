import { storableError } from '../../util/errors';
// import { salesUserAccount } from '../../util/api';

// ================ Action types ================ //

export const PRODUCT_REQUEST =
  'app/ProductPage/PRODUCT_REQUEST';
export const PRODUCT_SUCCESS =
  'app/ProductPage/PRODUCT_SUCCESS';
export const PRODUCT_ERROR =
  'app/ProductPage/PRODUCT_ERROR';
export const PRODUCT_CLEANUP =
  'app/ProductPage/PRODUCT_CLEANUP';

export const PRODUCT_CLEAR =
  'app/ProductPage/PRODUCT_CLEAR';

export const RESET_PASSWORD_REQUEST =
  'app/ProductPage/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS =
  'app/ProductPage/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR =
  'app/ProductPage/RESET_PASSWORD_ERROR';

// ================ Reducer ================ //

const initialState = {
  productError: null,
  productInProgress: false,
  accountDeleted: false,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case PRODUCT_REQUEST:
      return {
        ...state,
        productInProgress: true,
        productError: null,
        accountDeleted: false,
      };
    case PRODUCT_SUCCESS:
      return { ...state, productInProgress: false, accountDeleted: true };
    case PRODUCT_ERROR:
      return {
        ...state,
        productInProgress: false,
        productError: payload,
      };

    case PRODUCT_CLEAR:
      return { ...initialState };

    case RESET_PASSWORD_REQUEST:
      return {
        ...state,
        resetPasswordInProgress: true,
        resetPasswordError: null,
      };
    case RESET_PASSWORD_SUCCESS:
      return { ...state, resetPasswordInProgress: false };
    case RESET_PASSWORD_ERROR:
      console.error(payload); // eslint-disable-line no-console
      return {
        ...state,
        resetPasswordInProgress: false,
        resetPasswordError: payload,
      };

    default:
      return state;
  }
}

// ================ Action creators ================ //

export const productRequest = () => ({ type: PRODUCT_REQUEST });
export const productSuccess = () => ({ type: PRODUCT_SUCCESS });
export const productError = error => ({
  type: PRODUCT_ERROR,
  payload: error,
  error: true,
});

export const productClear = () => ({ type: PRODUCT_CLEAR });

export const resetPasswordRequest = () => ({ type: RESET_PASSWORD_REQUEST });

export const resetPasswordSuccess = () => ({ type: RESET_PASSWORD_SUCCESS });

export const resetPasswordError = e => ({
  type: RESET_PASSWORD_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

export const product = params => (dispatch, getState, sdk) => {
  dispatch(productRequest());
  const { currentPassword } = params;

  return salesUserAccount({ currentPassword })
    .then(() => {
      dispatch(productSuccess());
      return;
    })
    .catch(e => {
      dispatch(productError(storableError(storableError(e))));
      // This is thrown so that form can be cleared
      // after a timeout on product submit handler
      throw e;
    });
};

export const resetPassword = email => (dispatch, getState, sdk) => {
  dispatch(resetPasswordRequest());
  return sdk.passwordReset
    .request({ email })
    .then(() => dispatch(resetPasswordSuccess()))
    .catch(e => dispatch(resetPasswordError(storableError(e))));
};