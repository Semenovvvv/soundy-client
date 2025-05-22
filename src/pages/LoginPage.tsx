// pages/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthCard, AuthContainer, Subtitle, Title } from '../components/Auth/AuthContainer';
import FormInput from '../components/Auth/FormInput';
import authService from '../services/authService';
import styled from 'styled-components';

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #1db954;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
  transition: all 0.2s;
  
  &:hover {
    background-color: #1ed760;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ErrorMessage = styled.div`
  color: #ff3030;
  padding: 0.5rem;
  margin-bottom: 1rem;
  background: rgba(255, 0, 0, 0.07);
  border-radius: 4px;
`;

const LoginLink = styled(Link)`
  color: #1db954;
  text-decoration: underline;
  
  &:hover {
    text-decoration: none;
  }
`;

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Отправляем запрос на вход
      const response = await authService.login({
        username,
        password
      });
      
      // Сохраняем токены и ID пользователя в localStorage
      authService.saveAuth(
        response.userId,
        response.accessToken,
        response.refreshToken
      );
      
      // Перенаправляем пользователя на главную или на коллекцию
      navigate('/collection');
      
    } catch (err: unknown) {
      console.error('Ошибка входа:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла ошибка при входе');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <Title>Вход</Title>
        <Subtitle>Добро пожаловать обратно!</Subtitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <form onSubmit={handleLogin}>
          <FormInput
            label="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <FormInput
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Выполняется вход...' : 'Войти'}
          </Button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          Нет аккаунта?{' '}
          <LoginLink to="/register">
            Зарегистрироваться
          </LoginLink>
        </p>
      </AuthCard>
    </AuthContainer>
  );
};

export default LoginPage;