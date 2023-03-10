import { AuthProvider } from 'contexts/AuthContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.scss';
import { TodoPage, LoginPage, SignUpPage, HomePage } from './pages';

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="login" element={<LoginPage />}/>
            <Route path="signup" element={<SignUpPage />}/>
            <Route path="todos" element={<TodoPage />}/>
            <Route path="*" element={<HomePage />}/>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
