import axios from "axios"

const authURL = 'https://todo-list.alphacamp.io/api/auth';

export const login = async ({username, password}) => {
  try{
    const { data } = await axios.post(`${authURL}/login`, {
      username,
      password,
    });

    // authToken 存在就代表登入成功，就回傳資料以便後續利用。在回傳資料時，一併整理資料格式，加上 success 屬性做為 flag，之後就能用 success 屬性來判斷是否登入成功。
    const { authToken } = data; //解構拿出token

    console.log(data)
    //觀察後端回傳的 API 格式，若後端認證成功，會回傳 authToken 和登入使用者資料，
    if (authToken) {
      return { success: true, ...data };
    }
    return data;
  }catch(err){ 
    console.error("[Login Failed]: ", err)
    return { success: false };
  }
}

export const register = async ({username, email, password}) => {
  try{
    const { data } = await axios.post(`${authURL}/register`, {
      username,
      email,
      password,
    });

    const { authToken } = data

    if(authToken){
      return{success: true, ...data}
    }
    return data
  }catch(err){
    console.error("[Register Failed]: ", err)
    return {success: false}
  }
}

//在 JWT 實作機制中，我們需要把 token 放在 HTTP Request Header 裡，並使用 Authorization 的 Bearer 類型來攜帶 token。
// 後端的回應  { "success": boolean, "error": string }
export const checkPermission = async (authToken) => {
  try{
    //在 React 專案裡則可以這樣寫，Axios 會協助轉換成規格要求的格式
    const response = await axios.get(`${authURL}/test-token`, {
      headers: {
        Authorization: 'Bearer ' + authToken, //'Bearer' 和 authToken 之間需要加入空格。
      },
    });
    return response.data.success;
  }catch(err){
    console.error("[Check Failed]: ", err)
  }
}