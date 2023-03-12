import axios from 'axios';

const baseUrl = 'https://todo-list.alphacamp.io/api';

//// Create an instance using the config defaults provided by the library
const axiosInstance = axios.create({
  baseURL: baseUrl
})

// Add a request interceptor
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken")
  if(token){
    //送出req/res前把headers裡面的Authorization放進token
    config.headers["Authorization"] = `Bearer ${token}`
  }
  return config;
  }, (error) => {
    console.log(error)
  });


export const getTodos = async () => {
  try{
    //用res來接回傳結果
    const res = await axiosInstance.get(`${baseUrl}/todos`);
    //回傳結果裡面還有個data包住
    return res.data.data
  }catch(err){
    console.error("[Get Todos Failed] : ", err)
  }
};

//變數 payload 通常用來表示「打包後的資訊」，在這裡打包了想要新增的 todo 內容
export const createTodo = async (payload) => {
  const {title, isDone} = payload  //把參數解構
  try{
    const res = await axiosInstance.post(`${baseUrl}/todos`, {
      title,
      isDone,
    });
    return res.data
  }catch(err){
    console.error("[Create Todo Failed] : ", err)
  }
};

export const patchTodo = async (payload) => {
  const { id, title, isDone} = payload
  try{
    const res = await axiosInstance.patch(`${baseUrl}/todos/${id}`, {
      title,
      isDone,
    });
    return res.data
  }catch(err){
    console.log("[Patch Todo Failed] :", err)
  }
};

export const deleteTodo = async (id) => {
  try{
    const res = await axiosInstance.delete(`${baseUrl}/todos/${id}`);
    return res.data
  }catch(err){
    console.log("[Delete Todo Failed] :", err)
  }
};
