import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppLayout from './layout/AppLayout';
import BuildingsPage from './pages/BuildingsPage';
import DepartmentsPage from './pages/DepartmentsPage';
import EmployeesPage from './pages/EmployeesPage';
import MovesPage from './pages/MovesPage';
import 'antd/dist/reset.css';
import './index.css';
import EmployeesByDepartmentPage from './pages/EmployeesByDepartmentPage';
import EmployeesByBuildingPage from './pages/EmployeesByBuildingPage';

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { path: '/buildings', element: <BuildingsPage /> },
      { path: '/departments', element: <DepartmentsPage /> },
      { path: '/employees', element: <EmployeesPage /> },
      { path: '/moves', element: <MovesPage /> },
      { path: '/reports/by-department', element: <EmployeesByDepartmentPage /> },
      { path: '/reports/by-building', element: <EmployeesByBuildingPage /> },
      { index: true, element: <BuildingsPage /> } 
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>

  </React.StrictMode>
);
