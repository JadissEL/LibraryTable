import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  TableCellsIcon, 
  CalendarIcon, 
  BookOpenIcon 
} from '@heroicons/react/24/outline';

interface NavbarProps {
  isAuthenticated: boolean;
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ isAuthenticated, user, onLogout }) => {
  const location = useLocation();
  useEffect(() => {
    // Initialize Bootstrap components after mount
    const dropdownElementList = document.querySelectorAll('.dropdown-toggle');
    dropdownElementList.forEach((dropdownToggleEl) => {
      new window.bootstrap.Dropdown(dropdownToggleEl);
    });
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: HomeIcon, current: location.pathname === '/' },
    { name: 'Book a Table', href: '/book', icon: TableCellsIcon, current: location.pathname === '/book' },
    { name: 'My Bookings', href: '/my-bookings', icon: CalendarIcon, current: location.pathname === '/my-bookings' },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <div className="bg-white bg-opacity-10 p-2 rounded me-2">
            <BookOpenIcon style={{ width: '1.5rem', height: '1.5rem' }} className="text-white" />
          </div>
          <span className="fw-semibold">Library Booking System</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          {isAuthenticated && (
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {navigation.map((item) => (
                <li className="nav-item" key={item.name}>
                  <Link
                    to={item.href}
                    className={`nav-link d-flex align-items-center ${item.current ? 'active' : ''}`}
                    aria-current={item.current ? 'page' : undefined}
                  >
                    <item.icon style={{ width: '1.25rem', height: '1.25rem' }} className="me-2" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}

          <div className="d-flex align-items-center">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-link text-white text-decoration-none dropdown-toggle d-flex align-items-center"
                  type="button"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user?.name || "User"}
                      className="rounded-circle me-2"
                      style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="rounded-circle bg-white bg-opacity-25 me-2 d-flex align-items-center justify-content-center"
                      style={{ width: '32px', height: '32px' }}
                    >
                      <span className="fw-bold text-white">{user?.name?.charAt(0) || "U"}</span>
                    </div>
                  )}
                  <span className="d-none d-lg-inline">{user?.name}</span>
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                  <li>
                    <div className="dropdown-header">
                      <div className="fw-semibold">{user?.name}</div>
                      <div className="small text-muted">{user?.email}</div>
                    </div>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={onLogout}
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <div className="d-flex gap-2">
                <Link to="/login" className="btn btn-outline-light btn-sm">
                  Log in
                </Link>
                <Link to="/register" className="btn btn-light btn-sm">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
