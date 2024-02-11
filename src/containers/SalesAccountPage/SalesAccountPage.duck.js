import { storableError } from '../../util/errors';
// import { salesUserAccount } from '../../util/api';

// ================ Action types ================ //

export const SALES_ACCOUNT_REQUEST =
  'app/DeleteAccountPage/SALES_ACCOUNT_REQUEST';
export const SALES_ACCOUNT_SUCCESS =
  'app/DeleteAccountPage/SALES_ACCOUNT_SUCCESS';
export const SALES_ACCOUNT_ERROR =
  'app/DeleteAccountPage/SALES_ACCOUNT_ERROR';
export const SALES_ACCOUNT_CLEANUP =
  'app/DeleteAccountPage/SALES_ACCOUNT_CLEANUP';

export const SALES_ACCOUNT_CLEAR =
  'app/DeleteAccountPage/SALES_ACCOUNT_CLEAR';

export const RESET_PASSWORD_REQUEST =
  'app/DeleteAccountPage/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS =
  'app/DeleteAccountPage/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR =
  'app/DeleteAccountPage/RESET_PASSWORD_ERROR';

// ================ Reducer ================ //

const initialState = {
  salesAccountError: null,
  salesAccountInProgress: false,
  accountDeleted: false,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case SALES_ACCOUNT_REQUEST:
      return {
        ...state,
        salesAccountInProgress: true,
        salesAccountError: null,
        accountDeleted: false,
      };
    case SALES_ACCOUNT_SUCCESS:
      return { ...state, salesAccountInProgress: false, accountDeleted: true };
    case SALES_ACCOUNT_ERROR:
      return {
        ...state,
        salesAccountInProgress: false,
        salesAccountError: payload,
      };

    case SALES_ACCOUNT_CLEAR:
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

export const salesAccountRequest = () => ({ type: SALES_ACCOUNT_REQUEST });
export const salesAccountSuccess = () => ({ type: SALES_ACCOUNT_SUCCESS });
export const salesAccountError = error => ({
  type: SALES_ACCOUNT_ERROR,
  payload: error,
  error: true,
});

export const salesAccountClear = () => ({ type: SALES_ACCOUNT_CLEAR });

export const resetPasswordRequest = () => ({ type: RESET_PASSWORD_REQUEST });

export const resetPasswordSuccess = () => ({ type: RESET_PASSWORD_SUCCESS });

export const resetPasswordError = e => ({
  type: RESET_PASSWORD_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

export const salesAccount = params => (dispatch, getState, sdk) => {
  dispatch(salesAccountRequest());
  const { currentPassword } = params;

  return salesUserAccount({ currentPassword })
    .then(() => {
      dispatch(salesAccountSuccess());
      return;
    })
    .catch(e => {
      dispatch(salesAccountError(storableError(storableError(e))));
      // This is thrown so that form can be cleared
      // after a timeout on salesAccount submit handler
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