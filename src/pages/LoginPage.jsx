import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Swal from "sweetalert2"
import { useAuth } from 'contexts/AuthContext';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login, isAuthenticated } = useAuth();

  const handleClick = async () => {
    if (username.length === 0) {
      return;
    }
    if (password.length === 0) {
      return;
    }

    //注意回傳值變成只有一個布林值;
    const success = await login({
      username,
      password,
    });
    //判斷是否登入成功
    if (success) {
      Swal.fire({
        icon: 'success',
        title: '登入成功',
        showConfirmButton: false,
        timer: 1000,
        position: 'top',
      });
      return;
    }
    Swal.fire({
      icon: 'error',
      title: '登入失敗',
      showConfirmButton: false,
      timer: 1000,
      position: 'top',
    });
  };

  //每次畫面跳轉都要檢查Token
  //使用 isAuthenticated 判斷身分狀態，然後根據頁面需求，導引到 /todos
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/todos")
    }
  }, [navigate, isAuthenticated]);

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
      </div>
      <h1>登入 Todo</h1>

      <AuthInputContainer>
        <AuthInput
          type="text"
          label="帳號"
          placeholder="請輸入帳號"
          value={username}
          onChange={(usernameInputValue) => setUsername(usernameInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          type="password"
          label="密碼"
          placeholder="請輸入密碼"
          value={password}
          onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />
      </AuthInputContainer>
      <AuthButton onClick={handleClick}>登入</AuthButton>
      <Link to="/signup">
        <AuthLinkText>註冊</AuthLinkText>
      </Link>
    </AuthContainer>
  );
};

export default LoginPage;
