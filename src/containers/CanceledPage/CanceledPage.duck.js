import { storableError } from '../../util/errors';
// import { deleteUserAccount } from '../../util/api';

// ================ Action types ================ //

export const CANCELED_ACCOUNT_REQUEST =
  'app/CanceledPage/CANCELED_ACCOUNT_REQUEST';
export const CANCELED_ACCOUNT_SUCCESS =
  'app/CanceledPage/CANCELED_ACCOUNT_SUCCESS';
export const CANCELED_ACCOUNT_ERROR =
  'app/CanceledPage/CANCELED_ACCOUNT_ERROR';
export const CANCELED_ACCOUNT_CLEANUP =
  'app/CanceledPage/CANCELED_ACCOUNT_CLEANUP';

export const CANCELED_ACCOUNT_CLEAR =
  'app/CanceledPage/CANCELED_ACCOUNT_CLEAR';

export const RESET_PASSWORD_REQUEST =
  'app/CanceledPage/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS =
  'app/CanceledPage/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR =
  'app/CanceledPage/RESET_PASSWORD_ERROR';

// ================ Reducer ================ //

const initialState = {
  canceledError: null,
  canceledInProgress: false,
  accountDeleted: false,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case CANCELED_ACCOUNT_REQUEST:
      return {
        ...state,
        canceledInProgress: true,
        canceledError: null,
        accountDeleted: false,
      };
    case CANCELED_ACCOUNT_SUCCESS:
      return { ...state, canceledInProgress: false, accountDeleted: true };
    case CANCELED_ACCOUNT_ERROR:
      return {
        ...state,
        canceledInProgress: false,
        canceledError: payload,
      };

    case CANCELED_ACCOUNT_CLEAR:
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

export const canceledRequest = () => ({ type: CANCELED_ACCOUNT_REQUEST });
export const canceledSuccess = () => ({ type: CANCELED_ACCOUNT_SUCCESS });
export const canceledError = error => ({
  type: CANCELED_ACCOUNT_ERROR,
  payload: error,
  error: true,
});

export const canceledClear = () => ({ type: CANCELED_ACCOUNT_CLEAR });

export const resetPasswordRequest = () => ({ type: RESET_PASSWORD_REQUEST });

export const resetPasswordSuccess = () => ({ type: RESET_PASSWORD_SUCCESS });

export const resetPasswordError = e => ({
  type: RESET_PASSWORD_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

export const canceled = params => (dispatch, getState, sdk) => {
  dispatch(canceledRequest());
  const { currentPassword } = params;

  return deleteUserAccount({ currentPassword })
    .then(() => {
      dispatch(canceledSuccess());
      return;
    })
    .catch(e => {
      dispatch(canceledError(storableError(storableError(e))));
      // This is thrown so that form can be cleared
      // after a timeout on canceled submit handler
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