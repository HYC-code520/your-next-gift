import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { supabase } from '../lib/supabaseClient';
import { LayoutGrid, Package, Users, Cake, Palette, Heart, TrendingUp } from 'lucide-react';

// Local image map for projects
const localImageMap = {
  '1': '/images/Wavy-photo-frame-coverphoto.PNG',
  '2': '/images/dog-pizza.JPG',
  '3': '/images/customize-twistt-sticks-pet-bouquet.png',
  '4': '/images/Flower-balloon.PNG',
  '5': '/images/7-11-coverphoto-1.PNG',
  '6': '/images/weaved-black-crossbody-bag.PNG',
  '9': '/images/Cookie-cusion.JPG',
  '10': '/images/Ham-hideout.PNG',
  '11': '/images/cat-hideout1.png',
  '12': '/images/AH-DAI-pen-holder.PNG',
  '14': '/images/flower-box-with-jellycat.JPG',
  '15': '/images/Fuji-Mountain-weaved-bag.png',
  '16': '/images/icecream-cake.JPG',
  '17': '/images/Kawaii-twisty-sticks-keychain.PNG',
  '18': '/images/Miffy-clock2.png',
  '19': '/images/twistysticks-flower.PNG',
  '20': '/images/Chiikawa-frame2.png',
  '21': '/images/Crossbodybag-1.JPG',
  '22': '/images/Cat-bow-frame.png',
  '23': '/images/double-frame-clay-frame.PNG',
  '24': '/images/Fancy-fruit-basket1.png',
  '25': '/images/2nd-shape-wavy-mirror-frame.JPG',
  '26': '/images/white-weaving-handbag.png',
  '27': '/images/cat-pizza01.png',
  '28': '/images/custom-pet-inscense-stick-holder-01.PNG',
};
import OrdersManager from './admin/OrdersManager';
import AdditionalRequestsManager from './admin/AdditionalRequestsManager';
import BirthdaysManager from './admin/BirthdaysManager';
import ProjectsManager from './admin/ProjectsManager';
import CustomersManager from './admin/CustomersManager';

function AdminDashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    upcomingBirthdays: 0,
    totalCustomers: 0,
    totalProjects: 0
  });
  const [topLikedProjects, setTopLikedProjects] = useState([]);
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

      const { data: orders } = await supabase
        .from('orders')
        .select('id, status');

      const today = new Date();
      const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      const { data: birthdays } = await supabase
        .from('birthdays')
        .select('id, date');

      const upcomingBirthdays = birthdays?.filter(b => {
        const bDate = new Date(b.date);
        const thisYear = new Date(today.getFullYear(), bDate.getMonth(), bDate.getDate());
        return thisYear >= today && thisYear <= thirtyDaysLater;
      }) || [];

      const { data: customers } = await supabase
        .from('profiles')
        .select('id');

      const { data: projects } = await supabase
        .from('diy_projects')
        .select('id');

      const { data: likes } = await supabase
        .from('likes')
        .select('project_id');

      const likeCounts = {};
      likes?.forEach(like => {
        likeCounts[like.project_id] = (likeCounts[like.project_id] || 0) + 1;
      });

      const topProjectIds = Object.entries(likeCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([id, count]) => ({ id: parseInt(id), count }));

      if (topProjectIds.length > 0) {
        const { data: topProjects } = await supabase
          .from('diy_projects')
          .select('id, project_name, images')
          .in('id', topProjectIds.map(p => p.id));

        const topLiked = topProjectIds.map(({ id, count }) => {
          const project = topProjects?.find(p => p.id === id);
          return {
            id,
            name: project?.project_name || 'Unknown',
            image: localImageMap[String(id)] || null,
            likes: count
          };
        });
        setTopLikedProjects(topLiked);
      }

      setStats({
        totalOrders: orders?.length || 0,
        pendingOrders: orders?.filter(o => o.status === 'pending').length || 0,
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

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutGrid },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'birthdays', label: 'Birthdays', icon: Cake },
    { id: 'projects', label: 'Projects', icon: Palette }
  ];

  return (
    <div className="flex-1 bg-background">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Mobile Nav */}
        <div className="md:hidden flex gap-2 mb-6 overflow-x-auto pb-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  activeTab === item.id
                    ? 'bg-muted text-foreground font-medium'
                    : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex gap-10">
          {/* Left Sidebar */}
          <aside className="w-48 shrink-0 hidden md:block">
            <div className="space-y-1 sticky top-24">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      activeTab === item.id
                        ? 'bg-muted text-foreground font-medium'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
          {activeTab === 'overview' && (
            <div className="space-y-10">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wide">Orders</span>
                  </div>
                  <p className="text-3xl font-semibold tracking-tight">{stats.totalOrders}</p>
                  <p className="text-xs text-muted-foreground">{stats.pendingOrders} pending</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wide">Customers</span>
                  </div>
                  <p className="text-3xl font-semibold tracking-tight">{stats.totalCustomers}</p>
                  <p className="text-xs text-muted-foreground">registered</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Cake className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wide">Birthdays</span>
                  </div>
                  <p className="text-3xl font-semibold tracking-tight">{stats.upcomingBirthdays}</p>
                  <p className="text-xs text-muted-foreground">next 30 days</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Palette className="w-4 h-4" />
                    <span className="text-xs uppercase tracking-wide">Projects</span>
                  </div>
                  <p className="text-3xl font-semibold tracking-tight">{stats.totalProjects}</p>
                  <p className="text-xs text-muted-foreground">available</p>
                </div>
              </div>

              {/* Top Liked - Clean list */}
              {topLikedProjects.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                    <h2 className="text-sm font-medium">Most Popular</h2>
                  </div>
                  <div className="space-y-3">
                    {topLikedProjects.map((project, index) => (
                      <div key={project.id} className="flex items-center gap-4 group">
                        <span className="text-xs text-muted-foreground w-4">{index + 1}</span>
                        {project.image && (
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-10 h-10 object-cover rounded-md"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{project.name}</p>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Heart className="w-3.5 h-3.5" />
                          <span className="text-xs">{project.likes}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex gap-3 pt-4 border-t border-border/50">
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  View all orders →
                </button>
                <button
                  onClick={() => setActiveTab('projects')}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Manage projects →
                </button>
              </div>
            </div>
          )}

          {activeTab === 'orders' && <OrdersManager />}

          {activeTab === 'customers' && (
            <div className="space-y-8">
              <CustomersManager />
              <div className="pt-8 border-t border-border/50">
                <AdditionalRequestsManager />
              </div>
            </div>
          )}

          {activeTab === 'birthdays' && <BirthdaysManager />}

          {activeTab === 'projects' && <ProjectsManager />}
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
