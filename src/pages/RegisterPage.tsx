// pages/RegisterPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContainer, AuthCard, Title, Subtitle } from '../components/Auth/AuthContainer';
import FormInput from '../components/Auth/FormInput';
import authService from '../services/authService';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Валидация
    if (!username || !email || !password || !confirmPassword) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 4) {
      setError('Пароль должен быть не менее 4 символов');
      return;
    }

    try {
      setIsLoading(true);
      
      // Отправляем запрос на регистрацию
      const response = await authService.register({
        username,
        email,
        password,
        bio
      });
      
      // Сохраняем токены и ID пользователя
      authService.saveAuth(
        response.userId,
        response.accessToken,
        response.refreshToken
      );
      
      // Перенаправляем пользователя на главную
      navigate('/collection');
      
    } catch (err: unknown) {
      console.error('Ошибка регистрации:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Произошла неизвестная ошибка при регистрации');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <Title>Регистрация</Title>
        <Subtitle>Создайте свой аккаунт</Subtitle>
        {error && (
          <div style={{ 
            color: '#ff3030', 
            padding: '0.5rem', 
            marginBottom: '1rem',
            background: 'rgba(255, 0, 0, 0.07)',
            borderRadius: '4px' 
          }}>
            {error}
          </div>
        )}
        <form onSubmit={handleRegister}>
          <FormInput
            label="Имя пользователя"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <FormInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormInput
            label="Пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FormInput
            label="Подтвердите пароль"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <FormInput
            label="О себе (необязательно)"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Расскажите немного о себе"
          />
          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: isLoading ? '#cccccc' : '#1db954',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '1rem',
            }}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          Уже есть аккаунт?{' '}
          <a href="/login" style={{ color: '#1db954', textDecoration: 'underline' }}>
            Войти
          </a>
        </p>
      </AuthCard>
    </AuthContainer>
  );
};

export default RegisterPage;