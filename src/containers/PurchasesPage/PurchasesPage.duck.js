import { storableError } from '../../util/errors';
// import { salesUserAccount } from '../../util/api';

// ================ Action types ================ //

export const PURCHASES_REQUEST =
  'app/PurchasesPage/PURCHASES_REQUEST';
export const PURCHASES_SUCCESS =
  'app/PurchasesPage/PURCHASES_SUCCESS';
export const PURCHASES_ERROR =
  'app/PurchasesPage/PURCHASES_ERROR';
export const PURCHASES_CLEANUP =
  'app/PurchasesPage/PURCHASES_CLEANUP';

export const PURCHASES_CLEAR =
  'app/PurchasesPage/PURCHASES_CLEAR';

export const RESET_PASSWORD_REQUEST =
  'app/PurchasesPage/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS =
  'app/PurchasesPage/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR =
  'app/PurchasesPage/RESET_PASSWORD_ERROR';

// ================ Reducer ================ //

const initialState = {
  purchasesError: null,
  purchasesInProgress: false,
  accountDeleted: false,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case PURCHASES_REQUEST:
      return {
        ...state,
        purchasesInProgress: true,
        purchasesError: null,
        accountDeleted: false,
      };
    case PURCHASES_SUCCESS:
      return { ...state, purchasesInProgress: false, accountDeleted: true };
    case PURCHASES_ERROR:
      return {
        ...state,
        purchasesInProgress: false,
        purchasesError: payload,
      };

    case PURCHASES_CLEAR:
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

export const purchasesRequest = () => ({ type: PURCHASES_REQUEST });
export const purchasesSuccess = () => ({ type: PURCHASES_SUCCESS });
export const purchasesError = error => ({
  type: PURCHASES_ERROR,
  payload: error,
  error: true,
});

export const purchasesClear = () => ({ type: PURCHASES_CLEAR });

export const resetPasswordRequest = () => ({ type: RESET_PASSWORD_REQUEST });

export const resetPasswordSuccess = () => ({ type: RESET_PASSWORD_SUCCESS });

export const resetPasswordError = e => ({
  type: RESET_PASSWORD_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

export const purchases = params => (dispatch, getState, sdk) => {
  dispatch(purchasesRequest());
  const { currentPassword } = params;

  return salesUserAccount({ currentPassword })
    .then(() => {
      dispatch(purchasesSuccess());
      return;
    })
    .catch(e => {
      dispatch(purchasesError(storableError(storableError(e))));
      // This is thrown so that form can be cleared
      // after a timeout on purchases submit handler
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