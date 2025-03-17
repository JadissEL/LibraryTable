import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpenIcon,
  ClockIcon,
  UserGroupIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline';

const LandingPage: React.FC = () => {
  const features = [
    {
      icon: ClockIcon,
      title: "24/7 Availability",
      description: "Book your study space anytime, day or night. Our system is always available."
    },
    {
      icon: TableCellsIcon,
      title: "Multiple Table Options",
      description: "Choose from various table sizes and locations to suit your study needs."
    },
    {
      icon: UserGroupIcon,
      title: "Group Bookings",
      description: "Perfect for group study sessions and collaborative work."
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-primary text-white py-5">
        <div className="container">
          <div className="row align-items-center g-5 py-5">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold lh-1 mb-3">
                Library Table Booking System
              </h1>
              <p className="lead mb-4">
                Easily book your study space in advance. Find the perfect table for individual study or group work with our simple booking system.
              </p>
              <div className="d-grid gap-2 d-md-flex justify-content-md-start">
                <Link to="/register" className="btn btn-primary btn-lg px-4 me-md-2">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline-light btn-lg px-4">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <div className="bg-white bg-opacity-10 rounded-circle p-5 d-inline-block">
                <BookOpenIcon className="text-white" style={{ width: '200px', height: '200px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5">
        <h2 className="text-center mb-5">Why Choose Our Booking System?</h2>
        <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
          {features.map((feature, index) => (
            <div className="col" key={index}>
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 rounded-circle mb-3 p-3">
                    <feature.icon style={{ width: '2rem', height: '2rem' }} className="text-primary" />
                  </div>
                  <h3 className="fs-4 fw-bold mb-3">{feature.title}</h3>
                  <p className="text-muted mb-0">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-light">
        <div className="container py-5">
          <div className="p-5 text-center">
            <h2 className="fw-bold mb-3">Ready to get started?</h2>
            <p className="lead mb-4">Create an account now and book your perfect study space.</p>
            <Link to="/register" className="btn btn-primary btn-lg px-5">
              Sign Up Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
