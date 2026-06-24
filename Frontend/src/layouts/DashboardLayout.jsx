import React from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Home, PlusCircle, List, User, HelpCircle, LogOut, Bell } from 'lucide-react';

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => navigate('/');

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Create Request', path: '/request/create', icon: PlusCircle },
    { name: 'My Requests', path: '/requests', icon: List },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Help & Support', path: '/support', icon: HelpCircle },
  ];

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      
      {/* Sidebar */}
      <aside style={{ width: '260px', backgroundColor: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '2rem', paddingBottom: '3rem' }}>
          {/* Using a strong blue similar to the reference brand */}
          <h1 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#0f4c81', margin: 0, letterSpacing: '1px' }}>
            PORTAL
          </h1>
        </div>

        <nav style={{ flex: 1, padding: '0 1rem' }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '1rem', width: '100%',
                  padding: '0.875rem 1rem', marginBottom: '0.5rem', borderRadius: '8px',
                  backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  color: isActive ? '#2563eb' : '#4b5563',
                  border: 'none', cursor: 'pointer', textAlign: 'left',
                  fontSize: '0.95rem', fontWeight: isActive ? '600' : '500',
                  transition: 'all 0.2s'
                }}
              >
                <Icon size={20} color={isActive ? '#2563eb' : '#6b7280'} />
                {item.name}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '1rem' }}>
          <button 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '1rem', width: '100%', padding: '0.875rem 1rem', color: '#4b5563', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.95rem', fontWeight: '500' }}
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#f8f9fa' }}>
        
        {/* Top Header */}
        <header style={{ height: '70px', backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '0 2rem', gap: '1.5rem' }}>
          <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}>
            <Bell size={20} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e5e7eb', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <User size={20} color="#6b7280" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#111827' }}>Vansh Gujral</span>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>CL3 - Engineering</span>
            </div>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: '2rem 3rem' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;