import React from 'react';
import RegisterForm from '../components/Register';

const RegisterPage: React.FC = () => {
  const handleRegister = (email: string, password: string) => {
    console.log(email, password);
    // Implement registration logic here
  };

  return (
    <div>
      <RegisterForm onSubmit={handleRegister} buttonText="Register" />
    </div>
  );
};

export default RegisterPage;