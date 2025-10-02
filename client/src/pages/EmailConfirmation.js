import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { CheckCircle, XCircle } from 'lucide-react';
import logo from '../assets/ilmpluslogo.png';
import '../styles/EmailConfirmation.css';

const EmailConfirmation = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [message, setMessage] = useState('');
  const hasAttemptedConfirmation = useRef(false);
  
  const token = searchParams.get('token');

  useEffect(() => {
    const confirmEmail = async () => {
      // Prevent duplicate API calls (especially in React StrictMode)
      if (hasAttemptedConfirmation.current) {
        return;
      }
      hasAttemptedConfirmation.current = true;

      if (!token) {
        setStatus('error');
        setMessage('Invalid confirmation link');
        return;
      }

      try {
        const response = await authAPI.confirmEmail(token);
        setStatus('success');
        setMessage(response.data.message);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Email confirmation failed');
      }
    };

    confirmEmail();
  }, [token]);

  return (
    <div className="confirmation-container">
      <div className="confirmation-content">
        <div className="confirmation-header">
          <div className="confirmation-logo">
            <div className="confirmation-logo-icon">
              <img src={logo} alt="ILM+ Logo" />
            </div>
            <div className="confirmation-logo-text">
              <h1>ILM+</h1>
              <p>Connecting Students in the Pursuit of Knowledge</p>
            </div>
          </div>
        </div>

        <div className="confirmation-card">
          <div className="confirmation-card-body">
            {status === 'loading' && (
              <>
                <div className="confirmation-icon-wrapper loading">
                  <div className="confirmation-loading"></div>
                </div>
                <h2 className="confirmation-title">Confirming Email...</h2>
                <p className="confirmation-message">Please wait while we verify your email address.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="confirmation-icon-wrapper success">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="confirmation-title">Email Confirmed!</h2>
                <p className="confirmation-message">{message}</p>
                <Link to="/login" className="confirmation-button-primary">
                  Continue to Login
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="confirmation-icon-wrapper error">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="confirmation-title">Confirmation Failed</h2>
                <p className="confirmation-message">{message}</p>
                <div className="confirmation-actions">
                  <Link to="/register" className="confirmation-button-primary">
                    Try Registering Again
                  </Link>
                  <Link to="/login" className="confirmation-button-outline">
                    Back to Login
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmation;
