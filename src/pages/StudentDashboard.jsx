import React, { useState, useEffect } from 'react';
import { Card } from '../components/UI';
import { ProgressRing } from '../components/ProgressRing';
import { Shield, BookOpen, Clock, AlertTriangle } from 'lucide-react';

export const StudentDashboard = () => {
    const [stats, setStats] = useState({
        overallAttendance: 0,
        totalClasses: 0,
        classesAttended: 0,
        leavesTaken: 0,
        pendingLeaves: 0,
        todayClasses: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                // Get the logged-in user from the browser's memory, fallback to Guhan for testing
                const sessionStr = localStorage.getItem("syncedu_user");
                const session = sessionStr ? JSON.parse(sessionStr) : { name: "Guhan" };
                const studentName = session.name;

                const response = await fetch(`http://localhost:8000/student/${studentName}/dashboard`);
                
                if (response.ok) {
                    const data = await response.json();
                    setStats(data);
                }
            } catch (error) {
                console.error("Error fetching student dashboard:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudentData();
    }, []);

    if (isLoading) return <div className="p-8 text-center text-primary font-bold">Loading Dashboard...</div>;

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            {/* Overview Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Attendance Ring Card */}
                <Card className="flex flex-col items-center justify-center p-6 text-center shadow-md">
                    <h3 className="text-lg font-bold text-primary mb-4">Overall Attendance</h3>
                    <ProgressRing percentage={stats.overallAttendance} size={180} strokeWidth={14} />
                    <p className={`mt-4 text-sm font-bold ${stats.overallAttendance >= 75 ? 'text-muted' : 'text-danger'}`}>
                        {stats.overallAttendance >= 75 ? 'You are above the 75% threshold.' : 'Warning: Attendance below threshold!'}
                    </p>
                </Card>

                {/* Quick Stats Grid */}
                <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <Card className="flex items-center gap-4">
                        <div className="p-3 bg-primary-light text-primary rounded-lg">
                            <Shield size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted font-medium">Total Working Days</p>
                            <h4 className="text-2xl font-bold">{stats.totalClasses}</h4>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4">
                        <div className="p-3 bg-success-bg text-success rounded-lg">
                            <BookOpen size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted font-medium">Days Attended</p>
                            <h4 className="text-2xl font-bold">{stats.classesAttended}</h4>
                        </div>
                    </Card>

                    <Card className="flex items-center gap-4">
                        <div className="p-3 bg-warning-bg text-warning rounded-lg">
                            <Clock size={24} />
                        </div>
                        <div>
                            <p className="text-sm text-muted font-medium">Leaves Taken (Approved)</p>
                            <h4 className="text-2xl font-bold">{stats.leavesTaken}</h4>
                        </div>
                    </Card>

                    <Card className={`flex items-center gap-4 border-l-4 ${stats.pendingLeaves > 0 ? 'border-danger' : 'border-success'}`}>
                        <div className={`p-3 rounded-lg ${stats.pendingLeaves > 0 ? 'bg-danger-bg text-danger' : 'bg-success-bg text-success'}`}>
                            {stats.pendingLeaves > 0 ? <AlertTriangle size={24} /> : <Shield size={24} />}
                        </div>
                        <div>
                            <p className={`text-sm font-medium ${stats.pendingLeaves > 0 ? 'text-danger' : 'text-success'}`}>
                                {stats.pendingLeaves > 0 ? 'Action Required' : 'All Clear'}
                            </p>
                            <p className="text-sm font-semibold">{stats.pendingLeaves} Pending Leave Request(s)</p>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Today's Schedule */}
            <h3 className="text-xl font-bold text-text-main mt-4">Today's CS Schedule</h3>
            <Card>
                <div className="table-container">
                    <table className="table w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="py-2">Time</th>
                                <th className="py-2">Subject</th>
                                <th className="py-2">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.todayClasses.map((cls, idx) => (
                                <tr key={idx} className="border-b hover:bg-slate-50 transition-colors">
                                    <td className="font-medium text-primary py-3">{cls.time}</td>
                                    <td className="py-3">{cls.subject}</td>
                                    <td className="py-3">
                                        {cls.status === 'Present' ? (
                                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Present</span>
                                        ) : cls.status === 'Absent' ? (
                                            <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Absent</span>
                                        ) : (
                                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">Upcoming</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};