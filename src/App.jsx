import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LayoutDashboard, Calendar, FileText, Settings, Users, CheckSquare, Presentation } from 'lucide-react';

// Auth Pages
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';

// Layout
import { DashboardLayout } from './layouts/DashboardLayout';

// Student Views
import { StudentDashboard } from './pages/StudentDashboard';
import { DailyAttendance } from './pages/DailyAttendance';
import { ConsolidatedReport } from './pages/ConsolidatedReport';
import { LeaveApplication } from './pages/LeaveApplication';

// Advisor Views
import { AdvisorDashboard } from './pages/AdvisorDashboard';
import { LeaveApprovals } from './pages/LeaveApprovals';

// Faculty Views
import { FacultyDashboard } from './pages/FacultyDashboard';
import { LiveSession } from './pages/LiveSession';

function App() {

  // Menu Definitions
  const studentMenu = [
    { label: 'Dashboard', path: '/student', icon: LayoutDashboard },
    { label: 'Daily Calendar', path: '/student/daily', icon: Calendar },
    { label: 'Consolidated', path: '/student/consolidated', icon: FileText },
    { label: 'Leave Apply', path: '/student/leave', icon: Settings },
  ];

  const advisorMenu = [
    { label: 'Class Overview', path: '/advisor', icon: Users },
    { label: 'Leave Approvals', path: '/advisor/approvals', icon: CheckSquare },
  ];

  const facultyMenu = [
    { label: 'My Classes', path: '/faculty', icon: Presentation },
  ];

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Student Routes */}
        <Route path="/student" element={
          <DashboardLayout
            menuItems={studentMenu}
            userName="Harisanth K"
            subText="24CSR097 • B.E CSE"
            role="STUDENT"
          />
        }>
          <Route index element={<StudentDashboard />} />
          <Route path="daily" element={<DailyAttendance />} />
          <Route path="consolidated" element={<ConsolidatedReport />} />
          <Route path="leave" element={<LeaveApplication />} />
        </Route>

        {/* Advisor Routes */}
        <Route path="/advisor" element={
          <DashboardLayout
            menuItems={advisorMenu}
            userName="Dr. Mahesh R"
            subText="Assoc. Prof • CSE A (2nd Yr)"
            role="ADVISOR"
          />
        }>
          <Route index element={<AdvisorDashboard />} />
          <Route path="approvals" element={<LeaveApprovals />} />
        </Route>

        {/* Faculty Routes */}
        <Route path="/faculty" element={
          <DashboardLayout
            menuItems={facultyMenu}
            userName="Prof. Vignesh T"
            subText="Asst. Prof • IT Dept"
            role="FACULTY"
          />
        }>
          <Route index element={<FacultyDashboard />} />
          {/* Note: In a real app we might hide the sidebar for live sessions, 
              but for this prototype keeping the layout is fine, or we can use a full screen layout.
              We'll use Dashboard layout for consistency, but you can also drop it outside. */}
          <Route path="live" element={<LiveSession />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
