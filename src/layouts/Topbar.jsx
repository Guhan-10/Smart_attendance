import React from 'react';
import { Bell } from 'lucide-react';
import { Avatar } from '../components/UI';

export const Topbar = ({ userName, subText, role }) => {
    const getInitials = (name) => {
        if (!name) return 'K';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    return (
        <header className="topbar">
            <div className="text-lg font-bold text-primary">KONGU ENGINEERING COLLEGE</div>

            <div className="user-profile">
                <div className="badge badge-primary mr-4">{role}</div>
                <button className="btn btn-secondary" style={{ padding: '0.5rem', borderRadius: '50%' }}>
                    <Bell size={18} />
                </button>
                <div className="flex items-center gap-2 ml-4">
                    <Avatar initials={getInitials(userName)} />
                    <div className="user-info">
                        <span className="user-name">{userName}</span>
                        <span className="user-role">{subText}</span>
                    </div>
                </div>
            </div>
        </header>
    );
};
