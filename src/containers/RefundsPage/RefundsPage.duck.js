import { storableError } from '../../util/errors';
// import { projectsUserAccount } from '../../util/api';

// ================ Action types ================ //

export const REFUNDS_REQUEST =
  'app/RefundsPage/REFUNDS_REQUEST';
export const REFUNDS_SUCCESS =
  'app/RefundsPage/REFUNDS_SUCCESS';
export const REFUNDS_ERROR =
  'app/RefundsPage/REFUNDS_ERROR';
export const REFUNDS_CLEANUP =
  'app/RefundsPage/REFUNDS_CLEANUP';

export const REFUNDS_CLEAR =
  'app/RefundsPage/REFUNDS_CLEAR';

export const RESET_PASSWORD_REQUEST =
  'app/RefundsPage/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS =
  'app/RefundsPage/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR =
  'app/RefundsPage/RESET_PASSWORD_ERROR';

// ================ Reducer ================ //

const initialState = {
  refundsError: null,
  refundsInProgress: false,
  accountDeleted: false,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case REFUNDS_REQUEST:
      return {
        ...state,
        refundsInProgress: true,
        refundsError: null,
        accountDeleted: false,
      };
    case REFUNDS_SUCCESS:
      return { ...state, refundsInProgress: false, accountDeleted: true };
    case REFUNDS_ERROR:
      return {
        ...state,
        refundsInProgress: false,
        refundsError: payload,
      };

    case REFUNDS_CLEAR:
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

export const refundsRequest = () => ({ type: REFUNDS_REQUEST });
export const refundsSuccess = () => ({ type: REFUNDS_SUCCESS });
export const refundsError = error => ({
  type: REFUNDS_ERROR,
  payload: error,
  error: true,
});

export const refundsClear = () => ({ type: REFUNDS_CLEAR });

export const resetPasswordRequest = () => ({ type: RESET_PASSWORD_REQUEST });

export const resetPasswordSuccess = () => ({ type: RESET_PASSWORD_SUCCESS });

export const resetPasswordError = e => ({
  type: RESET_PASSWORD_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

export const refunds = params => (dispatch, getState, sdk) => {
  dispatch(refundsRequest());
  const { currentPassword } = params;

  return projectsUserAccount({ currentPassword })
    .then(() => {
      dispatch(refundsSuccess());
      return;
    })
    .catch(e => {
      dispatch(refundsError(storableError(storableError(e))));
      // This is thrown so that form can be cleared
      // after a timeout on refunds submit handler
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