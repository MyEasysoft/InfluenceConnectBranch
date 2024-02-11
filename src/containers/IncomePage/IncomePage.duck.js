import { storableError } from '../../util/errors';
// import { salesUserAccount } from '../../util/api';

// ================ Action types ================ //

export const INCOME_REQUEST =
  'app/INCOMEPage/INCOME_REQUEST';
export const INCOME_SUCCESS =
  'app/INCOMEPage/INCOME_SUCCESS';
export const INCOME_ERROR =
  'app/INCOMEPage/INCOME_ERROR';
export const INCOME_CLEANUP =
  'app/INCOMEPage/INCOME_CLEANUP';

export const INCOME_CLEAR =
  'app/INCOMEPage/INCOME_CLEAR';

export const RESET_PASSWORD_REQUEST =
  'app/INCOMEPage/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS =
  'app/INCOMEPage/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR =
  'app/INCOMEPage/RESET_PASSWORD_ERROR';

// ================ Reducer ================ //

const initialState = {
  incomeError: null,
  incomeInProgress: false,
  accountDeleted: false,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case INCOME_REQUEST:
      return {
        ...state,
        incomeInProgress: true,
        incomeError: null,
        accountDeleted: false,
      };
    case INCOME_SUCCESS:
      return { ...state, incomeInProgress: false, accountDeleted: true };
    case INCOME_ERROR:
      return {
        ...state,
        incomeInProgress: false,
        incomeError: payload,
      };

    case INCOME_CLEAR:
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

export const incomeRequest = () => ({ type: INCOME_REQUEST });
export const incomeSuccess = () => ({ type: INCOME_SUCCESS });
export const incomeError = error => ({
  type: INCOME_ERROR,
  payload: error,
  error: true,
});

export const incomeClear = () => ({ type: INCOME_CLEAR });

export const resetPasswordRequest = () => ({ type: RESET_PASSWORD_REQUEST });

export const resetPasswordSuccess = () => ({ type: RESET_PASSWORD_SUCCESS });

export const resetPasswordError = e => ({
  type: RESET_PASSWORD_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

export const income = params => (dispatch, getState, sdk) => {
  dispatch(incomeRequest());
  const { currentPassword } = params;

  return salesUserAccount({ currentPassword })
    .then(() => {
      dispatch(incomeSuccess());
      return;
    })
    .catch(e => {
      dispatch(incomeError(storableError(storableError(e))));
      // This is thrown so that form can be cleared
      // after a timeout on income submit handler
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