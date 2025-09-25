import { apiConfig } from "@/config/api.config";
import axios from "axios";
import { useEffect, useState } from "react";

export default function useGetSession() {
  const [user, setUser] = useState();
  const [checking, setChecking] = useState(false);

  const checkUser = async () => {
    setChecking(true);
    try {
        const res = await axios.get(apiConfig.rmuAPI + "/auth/check-user",{withCredentials:true});
        if(res?.status === 200){
            setUser(res?.data);
        }
    } catch (error) {
      console.error(error);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkUser();
  },[]);

  return {
    user,checking
  }
}
