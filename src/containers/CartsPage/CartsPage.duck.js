import { storableError } from '../../util/errors';
// import { cartsUserAccount } from '../../util/api';

// ================ Action types ================ //

export const CARTS_ACCOUNT_REQUEST =
  'app/CartsPage/CARTS_ACCOUNT_REQUEST';
export const CARTS_ACCOUNT_SUCCESS =
  'app/CartsPage/CARTS_ACCOUNT_SUCCESS';
export const CARTS_ACCOUNT_ERROR =
  'app/CartsPage/CARTS_ACCOUNT_ERROR';
export const CARTS_ACCOUNT_CLEANUP =
  'app/CartsPage/CARTS_ACCOUNT_CLEANUP';

export const CARTS_ACCOUNT_CLEAR =
  'app/CartsPage/CARTS_ACCOUNT_CLEAR';

export const RESET_PASSWORD_REQUEST =
  'app/CartsPage/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS =
  'app/CartsPage/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR =
  'app/CartsPage/RESET_PASSWORD_ERROR';

// ================ Reducer ================ //

const initialState = {
  cartsError: null,
  cartsInProgress: false,
  accountDeleted: false,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case CARTS_ACCOUNT_REQUEST:
      return {
        ...state,
        cartsInProgress: true,
        cartsError: null,
        accountDeleted: false,
      };
    case CARTS_ACCOUNT_SUCCESS:
      return { ...state, cartsInProgress: false, accountDeleted: true };
    case CARTS_ACCOUNT_ERROR:
      return {
        ...state,
        cartsInProgress: false,
        cartsError: payload,
      };

    case CARTS_ACCOUNT_CLEAR:
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

export const cartsRequest = () => ({ type: CARTS_ACCOUNT_REQUEST });
export const cartsSuccess = () => ({ type: CARTS_ACCOUNT_SUCCESS });
export const cartsError = error => ({
  type: CARTS_ACCOUNT_ERROR,
  payload: error,
  error: true,
});

export const cartsClear = () => ({ type: CARTS_ACCOUNT_CLEAR });

export const resetPasswordRequest = () => ({ type: RESET_PASSWORD_REQUEST });

export const resetPasswordSuccess = () => ({ type: RESET_PASSWORD_SUCCESS });

export const resetPasswordError = e => ({
  type: RESET_PASSWORD_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

export const carts = params => (dispatch, getState, sdk) => {
  dispatch(cartsRequest());
  const { currentPassword } = params;

  return cartsUserAccount({ currentPassword })
    .then(() => {
      dispatch(cartsSuccess());
      return;
    })
    .catch(e => {
      dispatch(cartsError(storableError(storableError(e))));
      // This is thrown so that form can be cleared
      // after a timeout on carts submit handler
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