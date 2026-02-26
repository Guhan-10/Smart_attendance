import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Outlet, useNavigate } from 'react-router-dom';

export const DashboardLayout = ({ menuItems, userName, subText, role }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // In a real app we'd clear auth state.
        navigate('/');
    };

    return (
        <div className="dashboard-layout animate-fade-in">
            <Sidebar menuItems={menuItems} onLogout={handleLogout} />
            <main className="main-content">
                <Topbar userName={userName} subText={subText} role={role} />
                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
