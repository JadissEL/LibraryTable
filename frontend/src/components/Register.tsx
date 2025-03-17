import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Formik, Form, Field, ErrorMessage, FormikProps } from 'formik';
import * as Yup from 'yup';
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  ExclamationCircleIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), undefined], 'Passwords must match')
    .required('Confirm password is required'),
});

interface RegisterProps {
  onLogin: (token: string, userData: any) => void;
}

const Register: React.FC<RegisterProps> = ({ onLogin }) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const initialValues: RegisterFormData = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="text-center mb-4">
            <div className="d-inline-block bg-primary p-3 rounded-circle mb-3">
              <BookOpenIcon style={{ width: '2rem', height: '2rem' }} className="text-white" />
            </div>
            <h2 className="h3 mb-2">Create Account</h2>
            <p className="text-muted">Join the library booking system to reserve your study space</p>
          </div>

          <div className="card">
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger d-flex align-items-center" role="alert">
                  <ExclamationCircleIcon style={{ width: '1.25rem', height: '1.25rem' }} className="me-2" />
                  <div>{error}</div>
                </div>
              )}

              <Formik<RegisterFormData>
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={async (values, { setSubmitting }) => {
                  setError(null);
                  try {
                    const response = await axios.post('/users/register', {
                      name: values.name,
                      email: values.email,
                      password: values.password,
                    });

                    if (response.data.success) {
                      const { token, user } = response.data.data;
                      onLogin(token, user);
                      navigate('/dashboard');
                    } else {
                      setError(response.data.message || 'Registration failed.');
                    }
                  } catch (err: any) {
                    setError(err.response?.data?.message || 'Registration failed.');
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {({ isSubmitting, errors, touched, handleChange, handleBlur }: FormikProps<RegisterFormData>) => (
                  <Form>
                    {/* Name field */}
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <UserIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                        </span>
                        <Field
                          type="text"
                          name="name"
                          id="name"
                          className={`form-control ${touched.name && errors.name ? 'is-invalid' : ''}`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage name="name" component="div" className="invalid-feedback" />
                      </div>
                    </div>

                    {/* Email field */}
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email Address</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <EnvelopeIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                        </span>
                        <Field
                          type="email"
                          name="email"
                          id="email"
                          className={`form-control ${touched.email && errors.email ? 'is-invalid' : ''}`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage name="email" component="div" className="invalid-feedback" />
                      </div>
                    </div>

                    {/* Password field */}
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <LockClosedIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                        </span>
                        <Field
                          type="password"
                          name="password"
                          id="password"
                          className={`form-control ${touched.password && errors.password ? 'is-invalid' : ''}`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage name="password" component="div" className="invalid-feedback" />
                      </div>
                    </div>

                    {/* Confirm Password field */}
                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <ShieldCheckIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                        </span>
                        <Field
                          type="password"
                          name="confirmPassword"
                          id="confirmPassword"
                          className={`form-control ${touched.confirmPassword && errors.confirmPassword ? 'is-invalid' : ''}`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mb-3" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <span className="d-flex align-items-center justify-content-center">
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Creating account...
                        </span>
                      ) : (
                        <span className="d-flex align-items-center justify-content-center">
                          Create account
                          <ArrowRightIcon style={{ width: '1.25rem', height: '1.25rem' }} className="ms-2" />
                        </span>
                      )}
                    </button>
                  </Form>
                )}
              </Formik>

              <div className="text-center">
                <p className="text-muted mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-primary">
                    Sign in instead
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
