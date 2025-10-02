import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authAPI } from '../utils/api';
import { CheckCircle, XCircle, Users } from 'lucide-react';

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-blue-600">MSAConnect</h1>
              <p className="text-sm text-gold font-medium">UCSD Muslim Student Association</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body text-center">
            {status === 'loading' && (
              <>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <div className="loading"></div>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirming Email...</h2>
                <p className="text-gray-600">Please wait while we verify your email address.</p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Email Confirmed!</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <Link to="/login" className="btn btn-primary">
                  Continue to Login
                </Link>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <XCircle className="w-8 h-8 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Confirmation Failed</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <div className="space-y-3">
                  <Link to="/register" className="btn btn-primary w-full">
                    Try Registering Again
                  </Link>
                  <Link to="/login" className="btn btn-outline w-full">
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
