/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './pages/Dashboard';
import OFlow from './pages/OFlow';
import CustomerProfile360 from './pages/CustomerProfile360';
import Campaigns from './pages/Campaigns';
import CreateCampaign from './pages/CreateCampaign';
import CRM from './pages/CRM';
import Videos from './pages/Videos';
import Insights from './pages/Insights';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Commerce from './pages/Commerce';
import Booking from './pages/Booking';
import Wallet from './pages/Wallet';
import Sales from './pages/Sales';
import Employees from './pages/Employees';
import SalesManager from './pages/SalesManager';
import OVideoProfile from './pages/OVideoProfile';

import Storefront from './pages/Storefront';
import PublicBookingForm from './pages/PublicBookingForm';
import PublicOVideoViewer from './pages/PublicOVideoViewer';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
          <Route path="/login" element={<Login />} />
          {/* Public OVideo Smart Viewer Page */}
          <Route path="/ovideo/:id" element={<PublicOVideoViewer />} />
          {/* Public OVideo Profile Page */}
          <Route path="/p/:slug" element={<OVideoProfile />} />
          {/* Public Storefront Page */}
          <Route path="/store/:storeId" element={<Storefront />} />
          {/* Public Booking Form Page */}
          <Route path="/book/:formId" element={<PublicBookingForm />} />
          {/* Dashboard Routes wrapped in Layout */}
          <Route path="/*" element={
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/oflow" element={<OFlow />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/campaigns/new" element={<CreateCampaign />} />
                <Route path="/crm" element={<CRM />} />
                <Route path="/crm/customer/360" element={<CustomerProfile360 />} />
                <Route path="/videos" element={<Videos />} />
                <Route path="/insights" element={<Insights />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/commerce" element={<Commerce />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/sales" element={<Sales />} />
                <Route path="/employees" element={<Employees />} />
                <Route path="/sales-manager" element={<SalesManager />} />
              </Routes>
            </Layout>
          } />
        </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
