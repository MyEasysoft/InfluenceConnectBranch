import { storableError } from '../../util/errors';
// import { salesUserAccount } from '../../util/api';

// ================ Action types ================ //

export const PENDINGPROPOSALS_REQUEST =
  'app/PENDINGPROPOSALSPage/PENDINGPROPOSALS_REQUEST';
export const PENDINGPROPOSALS_SUCCESS =
  'app/PENDINGPROPOSALSPage/PENDINGPROPOSALS_SUCCESS';
export const PENDINGPROPOSALS_ERROR =
  'app/PENDINGPROPOSALSPage/PENDINGPROPOSALS_ERROR';
export const PENDINGPROPOSALS_CLEANUP =
  'app/PENDINGPROPOSALSPage/PENDINGPROPOSALS_CLEANUP';

export const PENDINGPROPOSALS_CLEAR =
  'app/PENDINGPROPOSALSPage/PENDINGPROPOSALS_CLEAR';

export const RESET_PASSWORD_REQUEST =
  'app/PENDINGPROPOSALSPage/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS =
  'app/PENDINGPROPOSALSPage/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR =
  'app/PENDINGPROPOSALSPage/RESET_PASSWORD_ERROR';

// ================ Reducer ================ //

const initialState = {
  pendingProposalsError: null,
  pendingProposalsInProgress: false,
  accountDeleted: false,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case PENDINGPROPOSALS_REQUEST:
      return {
        ...state,
        pendingProposalsInProgress: true,
        pendingProposalsError: null,
        accountDeleted: false,
      };
    case PENDINGPROPOSALS_SUCCESS:
      return { ...state, pendingProposalsInProgress: false, accountDeleted: true };
    case PENDINGPROPOSALS_ERROR:
      return {
        ...state,
        pendingProposalsInProgress: false,
        pendingProposalsError: payload,
      };

    case PENDINGPROPOSALS_CLEAR:
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

export const pendingProposalsRequest = () => ({ type: PENDINGPROPOSALS_REQUEST });
export const pendingProposalsSuccess = () => ({ type: PENDINGPROPOSALS_SUCCESS });
export const pendingProposalsError = error => ({
  type: PENDINGPROPOSALS_ERROR,
  payload: error,
  error: true,
});

export const pendingProposalsClear = () => ({ type: PENDINGPROPOSALS_CLEAR });

export const resetPasswordRequest = () => ({ type: RESET_PASSWORD_REQUEST });

export const resetPasswordSuccess = () => ({ type: RESET_PASSWORD_SUCCESS });

export const resetPasswordError = e => ({
  type: RESET_PASSWORD_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

export const pendingProposals = params => (dispatch, getState, sdk) => {
  dispatch(pendingProposalsRequest());
  const { currentPassword } = params;

  return salesUserAccount({ currentPassword })
    .then(() => {
      dispatch(pendingProposalsSuccess());
      return;
    })
    .catch(e => {
      dispatch(pendingProposalsError(storableError(storableError(e))));
      // This is thrown so that form can be cleared
      // after a timeout on pendingProposals submit handler
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