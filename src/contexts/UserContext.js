import { createContext, useContext, useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
import UserService from '@/services/user-service';
import { useAuth } from '@/contexts/AuthContext';
import { useLoading } from '@/contexts/LoadingContext';

const UserContext = createContext();
export function useUser() {
  return useContext(UserContext);
}

export const UserProvider = ({ children }) => {
  const { accessToken } = useAuth();
  const [userFSData, setUserFSData] = useState(null);
  const { updateLoading } = useLoading();
  // const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      if (accessToken && !userFSData) {
        console.log(accessToken);
        updateLoading(true);
        const familySearchData = await UserService.getFamilySearchData(
          accessToken
        );
        console.log(familySearchData);

        updateUserFSData(familySearchData.personMap);
      }
    }
    fetchData();
  }, [accessToken]);

  const updateUserFSData = (val) => {
    setUserFSData(val);
  };

  const context = {
    userFSData,
    updateUserFSData,
  };

  return (
    <UserContext.Provider value={context}>{children}</UserContext.Provider>
  );
};
