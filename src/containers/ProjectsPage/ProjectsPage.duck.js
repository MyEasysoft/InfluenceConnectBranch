import { storableError } from '../../util/errors';
// import { deleteUserAccount } from '../../util/api';

// ================ Action types ================ //

export const PROJECTS_REQUEST =
  'app/ProjectsPage/PROJECTS_REQUEST';
export const PROJECTS_SUCCESS =
  'app/ProjectsPage/PROJECTS_SUCCESS';
export const PROJECTS_ERROR =
  'app/ProjectsPage/PROJECTS_ERROR';
export const PROJECTS_CLEANUP =
  'app/ProjectsPage/PROJECTS_CLEANUP';

export const PROJECTS_CLEAR =
  'app/ProjectsPage/PROJECTS_CLEAR';

export const RESET_PASSWORD_REQUEST =
  'app/ProjectsPage/RESET_PASSWORD_REQUEST';
export const RESET_PASSWORD_SUCCESS =
  'app/ProjectsPage/RESET_PASSWORD_SUCCESS';
export const RESET_PASSWORD_ERROR =
  'app/ProjectsPage/RESET_PASSWORD_ERROR';

// ================ Reducer ================ //

const initialState = {
  projectsError: null,
  projectsInProgress: false,
  accountDeleted: false,
  resetPasswordInProgress: false,
  resetPasswordError: null,
};

export default function reducer(state = initialState, action = {}) {
  const { type, payload } = action;
  switch (type) {
    case PROJECTS_REQUEST:
      return {
        ...state,
        projectsInProgress: true,
        projectsError: null,
        accountDeleted: false,
      };
    case PROJECTS_SUCCESS:
      return { ...state, projectsInProgress: false, accountDeleted: true };
    case PROJECTS_ERROR:
      return {
        ...state,
        projectsInProgress: false,
        projectsError: payload,
      };

    case PROJECTS_CLEAR:
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

export const projectsRequest = () => ({ type: PROJECTS_REQUEST });
export const projectsSuccess = () => ({ type: PROJECTS_SUCCESS });
export const projectsError = error => ({
  type: PROJECTS_ERROR,
  payload: error,
  error: true,
});

export const projectsClear = () => ({ type: PROJECTS_CLEAR });

export const resetPasswordRequest = () => ({ type: RESET_PASSWORD_REQUEST });

export const resetPasswordSuccess = () => ({ type: RESET_PASSWORD_SUCCESS });

export const resetPasswordError = e => ({
  type: RESET_PASSWORD_ERROR,
  error: true,
  payload: e,
});

// ================ Thunks ================ //

export const projects = params => (dispatch, getState, sdk) => {
  dispatch(projectsRequest());
  const { currentPassword } = params;

  return deleteUserAccount({ currentPassword })
    .then(() => {
      dispatch(projectsSuccess());
      return;
    })
    .catch(e => {
      dispatch(projectsError(storableError(storableError(e))));
      // This is thrown so that form can be cleared
      // after a timeout on projects submit handler
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


export const sendReviewsNew = data => (dispatch, getState, sdk) => {
  console.log("Reviewing-------------------------------------------");
  sendReviewsApi(data);
};


const  sendReviewsApi = async(data)=>{
  const response =await fetch('/api/v1/api/current_user/update_profile_review_influencer', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res=>{
    console.log(res);
    return res;

  }).catch(err=>{
    console.log(err);
  });
}