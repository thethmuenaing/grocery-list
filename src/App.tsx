import { useState } from 'react';
import './i18n/i18n';
import { useAuth } from './hooks/useAuth';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { GroceryApp } from './GroceryApp';

export default function App() {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [authScreen, setAuthScreen] = useState<'login' | 'register'>(() =>
    new URLSearchParams(window.location.search).get('screen') === 'register'
      ? 'register'
      : 'login'
  );

  if (!isAuthenticated || !user) {
    if (authScreen === 'register') {
      return (
        <RegisterPage
          onRegister={register}
          onGoToLogin={() => {
            setAuthScreen('login');
            window.history.replaceState(null, '', window.location.pathname);
          }}
        />
      );
    }

    return (
      <LoginPage
        onLogin={login}
        onGoToRegister={() => {
          setAuthScreen('register');
          window.history.replaceState(null, '', '?screen=register');
        }}
      />
    );
  }

  return <GroceryApp user={user} onLogout={logout} />;
}
