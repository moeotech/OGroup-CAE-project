import { useAuth } from '../contexts/AuthContext';
import BusinessDashboard from './dashboards/BusinessDashboard';
import CreatorDashboard from './dashboards/CreatorDashboard';
import SalesDashboard from './dashboards/SalesDashboard';
import AdminDashboard from './dashboards/AdminDashboard';
import SalesManager from './SalesManager';

export default function Dashboard() {
  const { user } = useAuth();
  
  switch(user.role) {
    case 'creator': return <CreatorDashboard />;
    case 'sales': return <SalesDashboard />;
    case 'sales_manager': return <SalesManager />;
    case 'admin': return <AdminDashboard />;
    case 'business':
    default: return <BusinessDashboard />;
  }
}

