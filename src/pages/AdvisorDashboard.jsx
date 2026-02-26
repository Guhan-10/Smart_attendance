import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/UI';
import { Users, AlertTriangle, Send, CheckCircle, Search, FileDown } from 'lucide-react';

export const AdvisorDashboard = () => {
    const [notificationStatus, setNotificationStatus] = useState(null);
    const [students, setStudents] = useState([]);
    const [dashboardStats, setDashboardStats] = useState({
        totalStrength: 0,
        classAverage: 0,
        belowThreshold: 0,
        todayAbsentees: 0,
        todayDate: new Date().toLocaleDateString()
    });
    const [isLoading, setIsLoading] = useState(true);

    // 1. Fetch real data from Python Backend
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // ⚠️ REPLACE WITH YOUR LAPTOP'S IP
                const BACKEND_URL = "http://192.168.X.X:8000/advisor/dashboard";
                const response = await fetch(BACKEND_URL);
                const data = await response.json();

                if (response.ok) {
                    setStudents(data.students);
                    setDashboardStats(data.stats);
                }
            } catch (error) {
                console.error("Error fetching advisor data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleNotify = () => {
        setNotificationStatus('Sending SMS to Parents...');
        setTimeout(() => {
            setNotificationStatus('Notifications Sent Successfully!');
            setTimeout(() => setNotificationStatus(null), 3000);
        }, 1500);
    };

    if (isLoading) return <div className="p-8 text-center text-primary font-bold">Loading Live Analytics...</div>;

    return (
        <div className="flex flex-col gap-6 animate-fade-in">

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="flex items-center gap-4 border-l-4 border-primary">
                    <div className="p-3 bg-primary-light text-primary rounded-lg">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted font-medium">Active Students (Logged)</p>
                        <h4 className="text-2xl font-bold">{dashboardStats.totalStrength}</h4>
                    </div>
                </Card>

                <Card className="flex items-center gap-4 border-l-4 border-success">
                    <div className="p-3 bg-success-bg text-success rounded-lg">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted font-medium">Class Average %</p>
                        <h4 className="text-2xl font-bold">{dashboardStats.classAverage}%</h4>
                    </div>
                </Card>

                <Card className="flex items-center gap-4 border-l-4 border-danger">
                    <div className="p-3 bg-danger-bg text-danger rounded-lg">
                        <AlertTriangle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-muted font-medium">Below 75% Threshold</p>
                        <h4 className="text-2xl font-bold text-danger">{dashboardStats.belowThreshold} Students</h4>
                    </div>
                </Card>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Col: Class List */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <Card>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-lg text-primary">Class Attendance Review</h3>
                            <div className="flex gap-2">
                                <Input placeholder="Search Name..." className="mb-0" style={{ padding: '0.4rem 0.75rem' }} />
                                <Button variant="secondary" style={{ padding: '0.4rem' }}><Search size={18} /></Button>
                            </div>
                        </div>

                        <div className="table-container max-h-[400px] overflow-y-auto">
                            <table className="table w-full text-left">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-2">Name</th>
                                        <th className="py-2 text-center">Days Present</th>
                                        <th className="py-2 text-center">Overall %</th>
                                        <th className="py-2 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, idx) => (
                                        <tr key={idx} className="border-b hover:bg-slate-50">
                                            <td className="py-3 font-medium">{student.name}</td>
                                            <td className="py-3 text-center">{student.days_present}</td>
                                            <td className="py-3 text-center">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${student.percentage >= 75 ? 'bg-green-100 text-green-700' : student.percentage >= 65 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                                    {student.percentage}%
                                                </span>
                                            </td>
                                            <td className="py-3 text-right">
                                                <Button variant="secondary" className="text-sm py-1 px-3">View</Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr><td colSpan="4" className="text-center py-4 text-muted">No attendance data found yet.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Right Col: Notifications & Actions */}
                <div className="flex flex-col gap-4">
                    <Card className="border-t-4 border-t-danger">
                        <h3 className="font-bold text-danger flex items-center gap-2 mb-2">
                            <AlertTriangle size={18} /> Parent Notification System
                        </h3>
                        <p className="text-sm text-muted mb-4">
                            {dashboardStats.belowThreshold} students are currently below the 75% attendance threshold. Notify their parents via SMS.
                        </p>
                        <Button
                            variant="danger"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={handleNotify}
                            disabled={!!notificationStatus || dashboardStats.belowThreshold === 0}
                        >
                            <Send size={18} /> {notificationStatus ? 'Processing...' : 'Send SMS Warnings'}
                        </Button>
                        {notificationStatus && (
                            <div className="mt-4 p-3 rounded bg-green-100 text-green-700 text-sm flex items-center justify-center gap-2">
                                <CheckCircle size={16} /> {notificationStatus}
                            </div>
                        )}
                    </Card>

                    <Card>
                        <h3 className="font-bold text-primary mb-2">Daily Summary</h3>
                        <p className="text-sm text-muted mb-4">Date: {dashboardStats.todayDate}</p>
                        <p className="text-sm font-bold text-danger mb-4">Estimated Absentees: {dashboardStats.todayAbsentees}</p>
                        <Button variant="secondary" className="w-full">Review Today's Logs</Button>
                    </Card>
                </div>
            </div>
        </div>
    );
};