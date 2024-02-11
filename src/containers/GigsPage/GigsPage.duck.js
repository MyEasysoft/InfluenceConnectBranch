import { storableError } from '../../util/errors';
// import { salesUserAccount } from '../../util/api';

// ================ Action types ================ //

export const GIGS_REQUEST =
  'app/GIGSPage/GIGS_REQUEST';
export const GIGS_SUCCESS =
  'app/GIGSPage/GIGS_SUCCESS';
export const GIGS_ERROR =
  'app/GIGSPage/GIGS_ERROR';
export const GIGS_CLEANUP =
  'app/GIGSPage/GIGS_CLEANUP';

export const GIGS_CLEAR =
  'app/GIGSPage/GIGS_CLEAR';

export const RESET_PASSWORD_REQUEST =
  'app/GIGSPage/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS =
  'app/GIGSPage/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR =
  'app/GIGSPage/RESET_PASSWORD_ERROR';

// ================ Reducer ================ //

const initialState = {
  gigsError: null,
  gigsInProgress: false,
  accountDeleted: false,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case GIGS_REQUEST:
      return {
        ...state,
        gigsInProgress: true,
        gigsError: null,
        accountDeleted: false,
      };
    case GIGS_SUCCESS:
      return { ...state, gigsInProgress: false, accountDeleted: true };
    case GIGS_ERROR:
      return {
        ...state,
        gigsInProgress: false,
        gigsError: payload,
      };

    case GIGS_CLEAR:
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

export const gigsRequest = () => ({ type: GIGS_REQUEST });
export const gigsSuccess = () => ({ type: GIGS_SUCCESS });
export const gigsError = error => ({
  type: GIGS_ERROR,
  payload: error,
  error: true,
});

export const gigsClear = () => ({ type: GIGS_CLEAR });

export const resetPasswordRequest = () => ({ type: RESET_PASSWORD_REQUEST });

export const resetPasswordSuccess = () => ({ type: RESET_PASSWORD_SUCCESS });

export const resetPasswordError = e => ({
  type: RESET_PASSWORD_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

export const gigs = params => (dispatch, getState, sdk) => {
  dispatch(gigsRequest());
  const { currentPassword } = params;

  return salesUserAccount({ currentPassword })
    .then(() => {
      dispatch(gigsSuccess());
      return;
    })
    .catch(e => {
      dispatch(gigsError(storableError(storableError(e))));
      // This is thrown so that form can be cleared
      // after a timeout on gigs submit handler
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