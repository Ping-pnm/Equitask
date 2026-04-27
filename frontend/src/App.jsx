import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Register from './pages/Register.jsx';
import Login from './pages/Login.jsx';
import HomePage from './pages/HomePage.jsx';
import Classwork from './pages/Classwork.jsx';
import People from './pages/People.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AssignmentDetail from './components/Work/AssignmentDetail.jsx';

import RootLayout from './components/RootLayout.jsx';
import ProtectedLayout from './components/ProtectedLayout.jsx';

const router = createBrowserRouter([
    {
        element: <RootLayout />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
            {
                element: <ProtectedLayout />,
                children: [
                    { path: "/", element: <HomePage /> },
                    { path: "/classwork", element: <Classwork /> },
                    { path: "/people", element: <People /> },
                    { path: "/dashboard", element: <Dashboard /> },
                    { path: "/assignment/:assignmentId", element: <AssignmentDetail /> }
                ]
            }
        ]
    }
]);

export default function App() {
    return (
        <RouterProvider router={router} />
    );
}