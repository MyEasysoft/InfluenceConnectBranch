import { storableError } from '../../util/errors';
// import { salesUserAccount } from '../../util/api';

// ================ Action types ================ //

export const WISHLIST_REQUEST =
  'app/WishlistPage/WISHLIST_REQUEST';
export const WISHLIST_SUCCESS =
  'app/WishlistPage/WISHLIST_SUCCESS';
export const WISHLIST_ERROR =
  'app/WishlistPage/WISHLIST_ERROR';
export const WISHLIST_CLEANUP =
  'app/WishlistPage/WISHLIST_CLEANUP';

export const WISHLIST_CLEAR =
  'app/WishlistPage/WISHLIST_CLEAR';

export const RESET_PASSWORD_REQUEST =
  'app/WishlistPage/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS =
  'app/WishlistPage/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR =
  'app/WishlistPage/RESET_PASSWORD_ERROR';

// ================ Reducer ================ //

const initialState = {
  wishlistError: null,
  wishlistInProgress: false,
  accountDeleted: false,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case WISHLIST_REQUEST:
      return {
        ...state,
        wishlistInProgress: true,
        wishlistError: null,
        accountDeleted: false,
      };
    case WISHLIST_SUCCESS:
      return { ...state, wishlistInProgress: false, accountDeleted: true };
    case WISHLIST_ERROR:
      return {
        ...state,
        wishlistInProgress: false,
        wishlistError: payload,
      };

    case WISHLIST_CLEAR:
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

export const wishlistRequest = () => ({ type: WISHLIST_REQUEST });
export const wishlistSuccess = () => ({ type: WISHLIST_SUCCESS });
export const wishlistError = error => ({
  type: WISHLIST_ERROR,
  payload: error,
  error: true,
});

export const wishlistClear = () => ({ type: WISHLIST_CLEAR });

export const resetPasswordRequest = () => ({ type: RESET_PASSWORD_REQUEST });

export const resetPasswordSuccess = () => ({ type: RESET_PASSWORD_SUCCESS });

export const resetPasswordError = e => ({
  type: RESET_PASSWORD_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

export const wishlist = params => (dispatch, getState, sdk) => {
  dispatch(wishlistRequest());
  const { currentPassword } = params;

  return salesUserAccount({ currentPassword })
    .then(() => {
      dispatch(wishlistSuccess());
      return;
    })
    .catch(e => {
      dispatch(wishlistError(storableError(storableError(e))));
      // This is thrown so that form can be cleared
      // after a timeout on wishlist submit handler
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