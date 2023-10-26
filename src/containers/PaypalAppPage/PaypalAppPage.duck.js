import { storableError } from '../../util/errors';
// import { salesUserAccount } from '../../util/api';

// ================ Action types ================ //

export const PAYPALAPP_REQUEST =
  'app/PAYPALAPPPage/PAYPALAPP_REQUEST';
export const PAYPALAPP_SUCCESS =
  'app/PAYPALAPPPage/PAYPALAPP_SUCCESS';
export const PAYPALAPP_ERROR =
  'app/PAYPALAPPPage/PAYPALAPP_ERROR';
export const PAYPALAPP_CLEANUP =
  'app/PAYPALAPPPage/PAYPALAPP_CLEANUP';

export const PAYPALAPP_CLEAR =
  'app/PAYPALAPPPage/PAYPALAPP_CLEAR';

export const RESET_PASSWORD_REQUEST =
  'app/PAYPALAPPPage/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS =
  'app/PAYPALAPPPage/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR =
  'app/PAYPALAPPPage/RESET_PASSWORD_ERROR';

// ================ Reducer ================ //

const initialState = {
  paypalAppError: null,
  paypalAppInProgress: false,
  accountDeleted: false,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case PAYPALAPP_REQUEST:
      return {
        ...state,
        paypalAppInProgress: true,
        paypalAppError: null,
        accountDeleted: false,
      };
    case PAYPALAPP_SUCCESS:
      return { ...state, paypalAppInProgress: false, accountDeleted: true };
    case PAYPALAPP_ERROR:
      return {
        ...state,
        paypalAppInProgress: false,
        paypalAppError: payload,
      };

    case PAYPALAPP_CLEAR:
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

export const paypalAppRequest = () => ({ type: PAYPALAPP_REQUEST });
export const paypalAppSuccess = () => ({ type: PAYPALAPP_SUCCESS });
export const paypalAppError = error => ({
  type: PAYPALAPP_ERROR,
  payload: error,
  error: true,
});

export const paypalAppClear = () => ({ type: PAYPALAPP_CLEAR });

export const resetPasswordRequest = () => ({ type: RESET_PASSWORD_REQUEST });

export const resetPasswordSuccess = () => ({ type: RESET_PASSWORD_SUCCESS });

export const resetPasswordError = e => ({
  type: RESET_PASSWORD_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

export const paypalApp = params => (dispatch, getState, sdk) => {
  dispatch(paypalAppRequest());
  const { currentPassword } = params;

  return salesUserAccount({ currentPassword })
    .then(() => {
      dispatch(paypalAppSuccess());
      return;
    })
    .catch(e => {
      dispatch(paypalAppError(storableError(storableError(e))));
      // This is thrown so that form can be cleared
      // after a timeout on paypalApp submit handler
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