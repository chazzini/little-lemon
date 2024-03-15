import React, { useReducer } from "react";

const ProfileContext = React.createContext();

const actions = {
  updateProfileImage: "updateProfileImage",
  updateProfile: "updateProfile",
  clearProfile: "clearProfile",
  onboardingCompleted: "onboardingCompleted",
};

const reducer = (state, action) => {
  switch (action.type) {
    case actions.updateProfileImage:
      return { ...state, profileImage: action.payload };
    case actions.updateProfile:
      return { ...state, profile: { ...state.profile, ...action.payload } };
    case actions.clearProfile:
      return { ...state, profile: {} };
    case actions.onboardingCompleted:
      return { ...state, onboardingCompleted: action.payload };

    default:
      return state;
  }
};

export const ProfileProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    onboardingCompleted: false,
    profileImage: null,
    profile: {},
  });

  return (
    <ProfileContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext;
