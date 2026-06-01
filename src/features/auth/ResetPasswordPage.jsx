import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams } from 'react-router-dom';
import { resetPasswordSchema } from '../../utils/validators.js';
import { useAuth } from '../../hooks/useAuth.js';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { resetPassword, loading, error, message, clearError, clearMessage } =
    useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data) => {
    clearError();
    clearMessage();
    await resetPassword(token, data.password);
  };

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Invalid reset link
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          This password reset link is invalid or missing.
        </p>
        <Link
          to="/forgot-password"
          className="text-blue-600 hover:text-blue-700 font-medium text-sm"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        Reset your password
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Enter your new password below.
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          {message}
          <div className="mt-3">
            <Link
              to="/login"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Sign in with your new password
            </Link>
          </div>
        </div>
      )}

      {!message && (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Input
            label="New Password"
            name="password"
            type="password"
            placeholder="Min. 8 characters"
            register={register}
            error={errors.password?.message}
          />

          <Input
            label="Confirm New Password"
            name="confirmPassword"
            type="password"
            placeholder="Re-enter your password"
            register={register}
            error={errors.confirmPassword?.message}
          />

          <Button type="submit" loading={loading} className="mt-2">
            Reset password
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-gray-500">
        <Link
          to="/login"
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Back to sign in
        </Link>
      </p>
    </div>
  );
};

export default ResetPasswordPage;
