import axios from 'axios';

const baseUrl = 'http://localhost:3001';


export const getTodos = async () => {
  try{
    //用res來接回傳結果
    const res = await axios.get(`${baseUrl}/todos`);
    return res.data
  }catch(err){
    console.error("[Get Todos Failed] : ", err)
  }
};

//變數 payload 通常用來表示「打包後的資訊」，在這裡打包了想要新增的 todo 內容
export const createTodo = async (payload) => {
  const {title, isDone} = payload  //把參數解構
  try{
    const res = await axios.post(`${baseUrl}/todos`, {
      title,
      isDone
    })
    return res.data
  }catch(err){
    console.error("[Create Todo Failed] : ", err)
  }
};

export const patchTodo = async (payload) => {
  const { id, title, isDone} = payload
  try{
    const res = await axios.patch(`${baseUrl}/todos/${id}`, {
      title,
      isDone
    })
    return res.data
  }catch(err){
    console.log("[Patch Todo Failed] :", err)
  }
};

export const deleteTodo = async (id) => {
  try{
    const res = await axios.delete(`${baseUrl}/todos/${id}`)
    return res.data
  }catch(err){
    console.log("[Delete Todo Failed] :", err)
  }
};
