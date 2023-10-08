import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Navigate, useNavigate, useRoutes } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
// layouts
import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import DashboardAppPage from './pages/DashboardAppPage';
import { auth } from './config/firebase';
import Courses from './pages/Courses';
import Attendence from './pages/Attendence';

// ----------------------------------------------------------------------

export default function Router() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const listener = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    });

    return () => {
      listener();
    };
  }, []);
  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'app', element: <DashboardAppPage /> },
        { path: 'student', element: <UserPage /> },
        { path: 'courses', element: <Courses /> },
        { path: 'attendence', element: <Attendence /> },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
