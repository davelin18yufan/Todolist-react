import { useAuth } from "contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react"

//總導引頁
const HomePage = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  //決定導向頁面
  useEffect(() => {
    if(isAuthenticated){
      navigate("/todos")
    }else {
      navigate("/login")
    }
  },[navigate, isAuthenticated])
};

export default HomePage;
