import React from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/authSlice';
// import AuthForm from '../components/AuthForm';
import LoginForm from '../components/LoginForm';
const LoginPage: React.FC = () => {
  const dispatch = useDispatch();

  const handleLogin = (email: string, password: string) => {
    // Implement login logic here
    console.log(email, password);
    dispatch(login());
  };

  return (
    <div>
      {/* <AuthForm onSubmit={handleLogin} buttonText="Login" /> */}
      <LoginForm onSubmit={handleLogin} buttonText="Login" />
    </div>
  );
};

export default LoginPage;