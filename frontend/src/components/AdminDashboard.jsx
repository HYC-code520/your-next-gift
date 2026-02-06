import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import { 
  LayoutDashboard, 
  Package, 
  AlertCircle, 
  Cake, 
  Palette, 
  Users,
  LogOut,
  TrendingUp
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import OrdersManager from './admin/OrdersManager';
import AdditionalRequestsManager from './admin/AdditionalRequestsManager';
import BirthdaysManager from './admin/BirthdaysManager';
import ProjectsManager from './admin/ProjectsManager';
import CustomersManager from './admin/CustomersManager';
import '../styles/AdminDashboard.css';

function AdminDashboard() {
  const { user, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingRequests: 0,
    upcomingBirthdays: 0,
    totalCustomers: 0,
    totalProjects: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchStats();
  }, [user, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch total orders
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('id, status');
      
      // Fetch pending additional requests
      const { data: requests, error: requestsError } = await supabase
        .from('cart_items')
        .select('id')
        .eq('is_additional_request', true);

      // Fetch upcoming birthdays (next 30 days)
      const today = new Date();
      const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      const { data: birthdays, error: birthdaysError } = await supabase
        .from('birthdays')
        .select('id, date');

      // Filter birthdays in next 30 days
      const upcomingBirthdays = birthdays?.filter(b => {
        const bDate = new Date(b.date);
        const thisYear = new Date(today.getFullYear(), bDate.getMonth(), bDate.getDate());
        return thisYear >= today && thisYear <= thirtyDaysLater;
      }) || [];

      // Fetch total customers
      const { data: customers, error: customersError } = await supabase
        .from('profiles')
        .select('id');

      // Fetch total projects
      const { data: projects, error: projectsError } = await supabase
        .from('diy_projects')
        .select('id');

      setStats({
        totalOrders: orders?.length || 0,
        pendingOrders: orders?.filter(o => o.status === 'pending').length || 0,
        pendingRequests: requests?.length || 0,
        upcomingBirthdays: upcomingBirthdays.length,
        totalCustomers: customers?.length || 0,
        totalProjects: projects?.length || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const tabs = [
    { id: 'overview', label: t('statistics'), icon: LayoutDashboard },
    { id: 'orders', label: t('orders'), icon: Package },
    { id: 'customers', label: t('customers'), icon: Users },
    { id: 'birthdays', label: t('birthdays'), icon: Cake },
    { id: 'projects', label: t('projects'), icon: Palette }
  ];

  return (
    <div className="flex-1 bg-background">

      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Tab Navigation */}
        <div className="flex justify-center gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="admin-content">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t('totalOrders')}
                    </CardTitle>
                    <Package className="w-5 h-5 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalOrders}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.pendingOrders} {t('pending').toLowerCase()}
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t('pendingRequests')}
                    </CardTitle>
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.pendingRequests}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {t('additionalRequests').toLowerCase()}
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t('upcomingBirthdaysCount')}
                    </CardTitle>
                    <Cake className="w-5 h-5 text-pink-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.upcomingBirthdays}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Next 30 days
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t('customers')}
                    </CardTitle>
                    <Users className="w-5 h-5 text-blue-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalCustomers}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Total registered
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {t('projects')}
                    </CardTitle>
                    <Palette className="w-5 h-5 text-purple-600" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.totalProjects}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      DIY projects available
                    </p>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      Quick Actions
                    </CardTitle>
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('orders')}
                    >
                      {t('manageOrders')}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => setActiveTab('requests')}
                    >
                      {t('approveRequests')}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'orders' && <OrdersManager />}
          {activeTab === 'customers' && (
            <div className="space-y-8">
              <CustomersManager />
              <div className="border-t-2 border-border pt-8">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {t('additionalRequests')}
                </h3>
                <AdditionalRequestsManager />
              </div>
            </div>
          )}
          {activeTab === 'birthdays' && <BirthdaysManager />}
          {activeTab === 'projects' && <ProjectsManager />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
