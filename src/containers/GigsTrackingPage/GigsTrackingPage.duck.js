import { storableError } from '../../util/errors';
// import { salesUserAccount } from '../../util/api';

// ================ Action types ================ //

export const GIGS_TRACKING_REQUEST =
  'app/GIGS_TRACKINGPage/GIGS_TRACKING_REQUEST';
export const GIGS_TRACKING_SUCCESS =
  'app/GIGS_TRACKINGPage/GIGS_TRACKING_SUCCESS';
export const GIGS_TRACKING_ERROR =
  'app/GIGS_TRACKINGPage/GIGS_TRACKING_ERROR';
export const GIGS_TRACKING_CLEANUP =
  'app/GIGS_TRACKINGPage/GIGS_TRACKING_CLEANUP';

export const GIGS_TRACKING_CLEAR =
  'app/GIGS_TRACKINGPage/GIGS_TRACKING_CLEAR';

export const RESET_PASSWORD_REQUEST =
  'app/GIGS_TRACKINGPage/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS =
  'app/GIGS_TRACKINGPage/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR =
  'app/GIGS_TRACKINGPage/RESET_PASSWORD_ERROR';

// ================ Reducer ================ //

const initialState = {
  gigsTrackingError: null,
  gigsTrackingInProgress: false,
  accountDeleted: false,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case GIGS_TRACKING_REQUEST:
      return {
        ...state,
        gigsTrackingInProgress: true,
        gigsTrackingError: null,
        accountDeleted: false,
      };
    case GIGS_TRACKING_SUCCESS:
      return { ...state, gigsTrackingInProgress: false, accountDeleted: true };
    case GIGS_TRACKING_ERROR:
      return {
        ...state,
        gigsTrackingInProgress: false,
        gigsTrackingError: payload,
      };

    case GIGS_TRACKING_CLEAR:
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

export const gigsTrackingRequest = () => ({ type: GIGS_TRACKING_REQUEST });
export const gigsTrackingSuccess = () => ({ type: GIGS_TRACKING_SUCCESS });
export const gigsTrackingError = error => ({
  type: GIGS_TRACKING_ERROR,
  payload: error,
  error: true,
});

export const gigsTrackingClear = () => ({ type: GIGS_TRACKING_CLEAR });

export const resetPasswordRequest = () => ({ type: RESET_PASSWORD_REQUEST });

export const resetPasswordSuccess = () => ({ type: RESET_PASSWORD_SUCCESS });

export const resetPasswordError = e => ({
  type: RESET_PASSWORD_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

export const gigsTracking = params => (dispatch, getState, sdk) => {
  dispatch(gigsTrackingRequest());
  const { currentPassword } = params;

  return salesUserAccount({ currentPassword })
    .then(() => {
      dispatch(gigsTrackingSuccess());
      return;
    })
    .catch(e => {
      dispatch(gigsTrackingError(storableError(storableError(e))));
      // This is thrown so that form can be cleared
      // after a timeout on gigsTracking submit handler
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