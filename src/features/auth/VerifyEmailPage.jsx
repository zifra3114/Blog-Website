import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.js';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const {
    verifyEmail,
    resendVerification,
    loading,
    error,
    message,
    clearError,
    clearMessage,
  } = useAuth();

  const [showResend, setShowResend] = useState(false);
  const [resendEmail, setResendEmail] = useState('');

  useEffect(() => {
    if (token) {
      clearError();
      clearMessage();
      verifyEmail(token).then((result) => {
        if (result.error) {
          setShowResend(true);
        }
      });
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResend = async (e) => {
    e.preventDefault();
    clearError();
    clearMessage();
    await resendVerification(resendEmail);
  };

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Verify your email
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Check your inbox for a verification link. The link will expire in 24
          hours.
        </p>
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-3">
            Didn&apos;t receive the email?
          </p>
          <form onSubmit={handleResend} className="flex gap-2">
            <input
              type="email"
              value={resendEmail}
              onChange={(e) => setResendEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button type="submit" loading={loading} className="w-auto px-4">
              Resend
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      {loading && (
        <>
          <div className="flex justify-center mb-4">
            <svg
              className="animate-spin h-12 w-12 text-blue-600"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verifying your email...
          </h1>
          <p className="text-sm text-gray-500">Please wait a moment.</p>
        </>
      )}

      {!loading && message && (
        <>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Email verified!
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Your email has been verified successfully.
          </p>
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-medium text-sm"
          >
            Continue to sign in
          </Link>
        </>
      )}

      {!loading && error && (
        <>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Verification failed
          </h1>
          <p className="text-sm text-gray-500 mb-6">{error}</p>

          {showResend && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-3">
                Request a new verification link:
              </p>
              <form onSubmit={handleResend} className="flex gap-2">
                <input
                  type="email"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button type="submit" loading={loading} className="w-auto px-4">
                  Resend
                </Button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default VerifyEmailPage;
