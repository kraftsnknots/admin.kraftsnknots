import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginFailure, adminLogin } from '../features/authSlice';
import './styles/LoginPage.css'; // 👈 Add this line

function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isLoggedIn, user } = useSelector((state) => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const validateEmail = (value) => /\S+@\S+\.\S+/.test(value);


  useEffect(() => {
    if (isLoggedIn && user?.admin === true) {
      navigate('/dashboard');
    }
  }, [isLoggedIn, user]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      dispatch(loginFailure('Invalid email format'));
      return;
    }

    if (password.length < 6) {
      dispatch(loginFailure('Password must be at least 6 characters'));
      return;
    }

    dispatch(adminLogin({ email, password }));
  };



  return (
    <div className="login-page">
      <div className='login-box'>
        <div className="login-header">
          <h3>Admin Panel</h3>
        </div>
        <div className="login-card">
          <form className="login-form" onSubmit={handleSubmit}>
            {error && <p className="error-text">{error}</p>}

            <input
              type="email"
              placeholder="user@domain.com"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="E5tpxxbyz1"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="remember-row">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="slider round"></span>
              </label>
              <span className="remember-text" style={{ color: rememberMe ? '#000' : '#ccc' }}>Remember me</span>
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Loading...' : 'Sign in'}
            </button>

            <p className="forgot-text">
              <span onClick={() => navigate('/forgotPassword')}>Forgot Password</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
