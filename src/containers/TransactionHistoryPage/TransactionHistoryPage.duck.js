import { storableError } from '../../util/errors';
// import { transactionHistory } from '../../util/api';

// ================ Action types ================ //

export const TRANSACTION_HISTORY_REQUEST =
  'app/TRANSACTION_HISTORYPage/TRANSACTION_HISTORY_REQUEST';
export const TRANSACTION_HISTORY_SUCCESS =
  'app/TRANSACTION_HISTORYPage/TRANSACTION_HISTORY_SUCCESS';
export const TRANSACTION_HISTORY_ERROR =
  'app/TRANSACTION_HISTORYPage/TRANSACTION_HISTORY_ERROR';
export const TRANSACTION_HISTORY_CLEANUP =
  'app/TRANSACTION_HISTORYPage/TRANSACTION_HISTORY_CLEANUP';

export const TRANSACTION_HISTORY_CLEAR =
  'app/TRANSACTION_HISTORYPage/TRANSACTION_HISTORY_CLEAR';

export const RESET_PASSWORD_REQUEST =
  'app/TRANSACTION_HISTORYPage/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS =
  'app/TRANSACTION_HISTORYPage/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR =
  'app/TRANSACTION_HISTORYPage/RESET_PASSWORD_ERROR';

// ================ Reducer ================ //

const initialState = {
  transactionHistoryError: null,
  transactionHistoryInProgress: false,
  accountDeleted: false,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case TRANSACTION_HISTORY_REQUEST:
      return {
        ...state,
        transactionHistoryInProgress: true,
        transactionHistoryError: null,
        accountDeleted: false,
      };
    case TRANSACTION_HISTORY_SUCCESS:
      return { ...state, transactionHistoryInProgress: false, accountDeleted: true };
    case TRANSACTION_HISTORY_ERROR:
      return {
        ...state,
        transactionHistoryInProgress: false,
        transactionHistoryError: payload,
      };

    case TRANSACTION_HISTORY_CLEAR:
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

export const transactionHistoryRequest = () => ({ type: TRANSACTION_HISTORY_REQUEST });
export const transactionHistorySuccess = () => ({ type: TRANSACTION_HISTORY_SUCCESS });
export const transactionHistoryError = error => ({
  type: TRANSACTION_HISTORY_ERROR,
  payload: error,
  error: true,
});

export const transactionHistoryClear = () => ({ type: TRANSACTION_HISTORY_CLEAR });

export const resetPasswordRequest = () => ({ type: RESET_PASSWORD_REQUEST });

export const resetPasswordSuccess = () => ({ type: RESET_PASSWORD_SUCCESS });

export const resetPasswordError = e => ({
  type: RESET_PASSWORD_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

export const transactionHistory = params => (dispatch, getState, sdk) => {
  dispatch(transactionHistoryRequest());
  const { currentPassword } = params;

  return transactionHistory({ currentPassword })
    .then(() => {
      dispatch(transactionHistorySuccess());
      return;
    })
    .catch(e => {
      dispatch(transactionHistoryError(storableError(storableError(e))));
      // This is thrown so that form can be cleared
      // after a timeout on transactionHistory submit handler
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