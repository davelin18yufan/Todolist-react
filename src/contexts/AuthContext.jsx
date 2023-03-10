import { checkPermission, login, register } from "../api/auth"
import { createContext, useState, useEffect } from 'react';
import * as jwt from "jsonwebtoken"
import { useLocation } from "react-router-dom";
import { useContext } from "react";

//需要讓全部頁面都能取的的Context
const defaultAuthContext = {
  isAuthenticated: false,  
  currentMember: null,  //現在的使用者資料
  register: null,  //註冊串接
  login: null,    //登入串接
  logout: null  // 登出函式
}

const AuthContext = createContext(defaultAuthContext)
export const useAuth = () => useContext(AuthContext) //讓每個頁面直接使用不用在個別import
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [payload, setPayload] = useState(null);
  const { pathname } = useLocation(); //這個方法可以取得瀏覽器網址列中的路徑資訊

  //跳轉畫面就要驗證
  useEffect(() => {
    const checkTokenIsValid = async () => {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        setIsAuthenticated(false);
        setPayload(null);
        return;
      }

      //若token存在，檢查
      const result = await checkPermission(authToken);
      if (result) {
        setIsAuthenticated(true);
        const tempPayload = jwt.decode(authToken);
        setPayload(tempPayload);
      } else {
        setIsAuthenticated(false);
        setPayload(null);
      }
    };
    checkTokenIsValid();
  }, [pathname]); //一旦 pathname 有改變，就需要重新驗證 token

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        currentMember: payload && {
          //如果拿到之後補上Id,帳號
          id: payload.id, // 使用者註冊時，由後端產的 uuid，可以做為使用者 id
          name: payload.name, // 同註冊時使用者輸入的 username
        },
        register: async (data) => {
          const { success, authToken } = await register({
            username: data.username,
            email: data.email,
            password: data.password,
          });
          //為了要製作 currentMember，需要從 authToken 解析使用者的資訊
          const tempPayload = jwt.decode(authToken); // 取得payload 內容
          if (tempPayload) {
            //有成功代表有登入
            setIsAuthenticated(true);
            setPayload(tempPayload);
            localStorage.setItem('authToken', authToken);
          } else {
            setIsAuthenticated(false);
            setPayload(null);
          }
          return success; //給事件處理判斷
        },
        login: async (data) => {
          const { success, authToken } = await login({
            username: data.username,
            password: data.password,
          });
          const tempPayload = jwt.decode(authToken);
          if (tempPayload) {
            //有成功代表有登入
            setIsAuthenticated(true);
            setPayload(tempPayload);
            localStorage.setItem('authToken', authToken);
          } else {
            setIsAuthenticated(false);
            setPayload(null);
          }
          return success; //給事件處理判斷
        },
        logout: () => {
          localStorage.removeItem('authToken'); //移除Token
          setPayload(null);
          setIsAuthenticated(false);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}