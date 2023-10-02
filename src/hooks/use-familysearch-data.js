import React, { useContext, useMemo } from 'react';
import useLocalStorageReducer from '@/hooks/use-local-storage-reducer';

// Reducers
const initialFamilySearchData = {
  accessToken: '',
  userPID: '',
  fsData: {},
};

const setToken = (state = {}, token = '') => {
  state.accessToken = token;
  return { ...state, accessToken: token };
};

const setUserPID = (state = {}, pid = '') => {
  state.userPID = pid;
  return { ...state, userPID: pid };
};

const setFSData = (state = {}, data = {}) => {
  state.fsData = data;
  return { ...state, fsData: data };
};

const familySearchDataReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return setToken(state, action.accessToken);
    case 'SET_USER_PID':
      return setUserPID(state, action.userPID);
    case 'SET_FS_DATA':
      return setFSData(state, action.fsData);
    default:
      return state;
  }
};

const FamilySearchDataContext = React.createContext();

export const FamilySearchDataProvider = ({ children }) => {
  const [familySearchData, dispatch] = useLocalStorageReducer(
    'familySearchData',
    familySearchDataReducer,
    initialFamilySearchData
  );

  const contextValue = useMemo(
    () => [
      {
        ...familySearchData,
      },
      dispatch,
    ],
    [familySearchData]
  );

  return (
    <FamilySearchDataContext.Provider value={contextValue}>
      {children}
    </FamilySearchDataContext.Provider>
  );
};

// Hook
export const useFamilySearchData = () => {
  const [state, dispatch] = useContext(FamilySearchDataContext);

  const setToken = (accessToken) =>
    dispatch({ type: 'SET_TOKEN', accessToken });

  const setUserPID = (userPID) => dispatch({ type: 'SET_USER_PID', userPID });

  const setFSData = (fsData) => dispatch({ type: 'SET_FS_DATA', fsData });

  const familySearchData = {
    ...state,
    setToken,
    setUserPID,
    setFSData,
  };

  return familySearchData;
};
