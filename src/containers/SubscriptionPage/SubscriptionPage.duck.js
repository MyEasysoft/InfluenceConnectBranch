import { storableError } from '../../util/errors';
// import { subscription } from '../../util/api';

// ================ Action types ================ //

export const SUBSCRIPTION_REQUEST =
  'app/SUBSCRIPTIONPage/SUBSCRIPTION_REQUEST';
export const SUBSCRIPTION_SUCCESS =
  'app/SUBSCRIPTIONPage/SUBSCRIPTION_SUCCESS';
export const SUBSCRIPTION_ERROR =
  'app/SUBSCRIPTIONPage/SUBSCRIPTION_ERROR';
export const SUBSCRIPTION_CLEANUP =
  'app/SUBSCRIPTIONPage/SUBSCRIPTION_CLEANUP';

export const SUBSCRIPTION_CLEAR =
  'app/SUBSCRIPTIONPage/SUBSCRIPTION_CLEAR';

export const RESET_PASSWORD_REQUEST =
  'app/SUBSCRIPTIONPage/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS =
  'app/SUBSCRIPTIONPage/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR =
  'app/SUBSCRIPTIONPage/RESET_PASSWORD_ERROR';

// ================ Reducer ================ //

const initialState = {
  subscriptionError: null,
  subscriptionInProgress: false,
  accountDeleted: false,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case SUBSCRIPTION_REQUEST:
      return {
        ...state,
        subscriptionInProgress: true,
        subscriptionError: null,
        accountDeleted: false,
      };
    case SUBSCRIPTION_SUCCESS:
      return { ...state, subscriptionInProgress: false, accountDeleted: true };
    case SUBSCRIPTION_ERROR:
      return {
        ...state,
        subscriptionInProgress: false,
        subscriptionError: payload,
      };

    case SUBSCRIPTION_CLEAR:
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

export const subscriptionRequest = () => ({ type: SUBSCRIPTION_REQUEST });
export const subscriptionSuccess = () => ({ type: SUBSCRIPTION_SUCCESS });
export const subscriptionError = error => ({
  type: SUBSCRIPTION_ERROR,
  payload: error,
  error: true,
});

export const subscriptionClear = () => ({ type: SUBSCRIPTION_CLEAR });

export const resetPasswordRequest = () => ({ type: RESET_PASSWORD_REQUEST });

export const resetPasswordSuccess = () => ({ type: RESET_PASSWORD_SUCCESS });

export const resetPasswordError = e => ({
  type: RESET_PASSWORD_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

export const subscription = params => (dispatch, getState, sdk) => {
  dispatch(subscriptionRequest());
  const { currentPassword } = params;

  return subscription({ currentPassword })
    .then(() => {
      dispatch(subscriptionSuccess());
      return;
    })
    .catch(e => {
      dispatch(subscriptionError(storableError(storableError(e))));
      // This is thrown so that form can be cleared
      // after a timeout on subscription submit handler
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