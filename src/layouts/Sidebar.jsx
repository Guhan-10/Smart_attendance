import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export const Sidebar = ({ menuItems, onLogout }) => {
    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="avatar bg-primary text-white">S</div>
                <span className="text-lg">Syncedu</span>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={index}
                            to={item.path}
                            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            <div className="sidebar-footer">
                <button
                    onClick={onLogout}
                    className="nav-item w-full"
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                >
                    <LogOut size={20} className="text-danger" />
                    <span className="text-danger font-medium">Logout</span>
                </button>
            </div>
        </aside>
    );
};
