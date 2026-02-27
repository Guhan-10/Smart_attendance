import React, { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Avatar } from '../components/UI';

export const Topbar = () => {
    // 1. Create a state to hold whoever is currently logged in
    const [userProfile, setUserProfile] = useState({ 
        name: 'Loading...', 
        role: 'student',
        email: '',
        roll_number: ''
    });

    // 2. When the Topbar loads, grab the real user from memory
    useEffect(() => {
        const sessionStr = localStorage.getItem("syncedu_user");
        if (sessionStr) {
            setUserProfile(JSON.parse(sessionStr));
        }
    }, []);

    // 3. Helper to get the first 1 or 2 letters of the name
    const getInitials = (name) => {
        if (!name || name === 'Loading...') return 'U';
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    // 4. Figure out their exact role from the database
    const currentRole = userProfile.role ? userProfile.role.toLowerCase() : "student";
    
    // 5. Check if they are any type of staff member (Faculty or Advisor)
    const isStaff = ["faculty", "teacher", "advisor"].includes(currentRole);
    
    // 6. Set the specific badge text
    let displayRole = "STUDENT";
    if (currentRole === "advisor") displayRole = "ADVISOR";
    else if (isStaff) displayRole = "FACULTY";
    
    // 7. Subtext: Show Dept for staff, or Email/Roll Number for students
    const subText = isStaff 
        ? `${displayRole.charAt(0) + displayRole.slice(1).toLowerCase()} • IT Dept` 
        : (userProfile.email || userProfile.roll_number || "Student");

    return (
        <header className="topbar flex justify-between items-center p-4 bg-white shadow-sm">
            {/* College Name Logo Area */}
            <div className="text-lg font-bold text-primary">KONGU ENGINEERING COLLEGE</div>

            <div className="user-profile flex items-center">
                
                {/* Dynamic Role Badge */}
                <div className={`badge mr-4 ${isStaff ? 'bg-indigo-100 text-indigo-700' : 'bg-blue-100 text-blue-700'} px-3 py-1 rounded-full text-xs font-bold`}>
                    {displayRole}
                </div>

                <button className="btn btn-secondary flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors" style={{ width: '36px', height: '36px', borderRadius: '50%' }}>
                    <Bell size={18} />
                </button>

                <div className="flex items-center gap-3 ml-4">
                    {/* We pass the dynamic initials to your Avatar component */}
                    <Avatar initials={getInitials(userProfile.name)} />
                    
                    <div className="user-info flex flex-col">
                        <span className="user-name font-bold text-slate-800 text-sm leading-tight">
                            {userProfile.name}
                        </span>
                        <span className="user-role text-xs text-slate-500 font-medium">
                            {subText}
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
};