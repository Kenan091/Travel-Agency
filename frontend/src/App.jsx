import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './pages/home/Home';
import Destinations from './pages/destinations/Destinations';
import Booking from './pages/booking/Booking';
import Experiences from './pages/experiences/Experiences';
import ContactUs from './pages/contact-us/ContactUs';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import DestinationDetails from './pages/destination-details/DestinationDetails';
import AccountDetails from './pages/account-details/AccountDetails';
import AdminDestinations from './pages/admin-destinations/AdminDestinations';
import AdminBookings from './pages/admin-bookings/AdminBookings';
import AdminFeedback from './pages/admin-feedback/AdminFeedback';
import AdminUsers from './pages/admin-users/AdminUsers';
import ForgotPassword from './pages/forgot-password/ForgotPassword';
import ProtectedRoute from './utils/ProtectedRoute';
import AdminProtectedRoute from './utils/AdminProtectedRoute';
import ResetPassword from './pages/reset-password/ResetPassword';

function App() {
  const { user } = useSelector(state => state?.auth);

  const userRole = user?.user?.role;
  return (
    <>
      <Router>
        <Routes>
          {userRole === 'admin' ? (
            <Route
              path='/'
              element={<Navigate to='/admin/destinations' />}
            />
          ) : (
            <Route
              path='/'
              element={<Home />}
            />
          )}
          <Route
            path='/destinations'
            element={<Destinations />}
          />
          <Route
            path='/destinations/:id'
            element={<DestinationDetails />}
          />
          <Route
            path='/experiences'
            element={<Experiences />}
          />
          <Route
            path='/contact-us'
            element={<ContactUs />}
          />
          <Route
            path='/auth/login'
            element={<Login />}
          />
          <Route
            path='/auth/register'
            element={<Register />}
          />
          <Route
            path='/auth/forgotpassword'
            element={<ForgotPassword />}
          />
          <Route
            path='/auth/resetpassword/:resetToken'
            element={<ResetPassword />}
          />

          {/* User Routes */}
          <Route
            path='/bookings/:id'
            element={<ProtectedRoute children={<Booking />} />}
          />
          <Route
            path='/auth/me'
            element={<ProtectedRoute children={<AccountDetails />} />}
          />

          {/* Admin Routes */}
          <Route
            path='/admin/*'
            element={
              <AdminProtectedRoute
                children={
                  <Routes>
                    <Route
                      path='/destinations'
                      element={<AdminDestinations />}
                    />
                    <Route
                      path='/bookings'
                      element={<AdminBookings />}
                    />
                    <Route
                      path='/feedback'
                      element={<AdminFeedback />}
                    />
                    <Route
                      path='/users'
                      element={<AdminUsers />}
                    />
                  </Routes>
                }
              />
            }
          />

          {/* Redirect to Home if none of the routes match */}
          {/* <Route
            path='*'
            element={<Navigate to='/' />}
          /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;
