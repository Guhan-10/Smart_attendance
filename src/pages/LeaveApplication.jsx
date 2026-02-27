import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select } from '../components/UI';
import { UploadCloud, FileText, CheckCircle, Clock } from 'lucide-react';

export const LeaveApplication = () => {
    const [leaveStatus, setLeaveStatus] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form States
    const [studentName] = useState("Guhan"); // Simulating a logged-in student
    const [leaveType, setLeaveType] = useState('Medical Leave');
    const [dayType, setDayType] = useState('single');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    
    // History State
    const [applications, setApplications] = useState([]);

    const BACKEND_URL = "http://localhost:8000/leave";

    // Fetch leave history on load
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch(`${BACKEND_URL}/${studentName}`);
                if (response.ok) {
                    const data = await response.json();
                    setApplications(data);
                }
            } catch (error) {
                console.error("Error fetching leave history:", error);
            }
        };
        fetchHistory();
    }, [studentName]);

    const handleApply = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const newLeave = {
            student_name: studentName,
            leave_type: leaveType,
            day_type: dayType,
            from_date: fromDate,
            to_date: dayType === 'single' ? fromDate : toDate,
            reason: reason,
            description: description,
            status: "Pending"
        };

        try {
            const response = await fetch(`${BACKEND_URL}/apply`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newLeave)
            });

            if (response.ok) {
                const savedLeave = await response.json();
                setApplications([savedLeave, ...applications]);
                setLeaveStatus('submitted');
                
                // Reset form
                setReason('');
                setDescription('');
                setFromDate('');
                setToDate('');
                
                setTimeout(() => setLeaveStatus(null), 4000);
            }
        } catch (error) {
            console.error("Error submitting leave:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <h2 className="text-xl font-bold text-primary mb-2">Leave Management &gt; Apply for Leave</h2>

            {leaveStatus === 'submitted' && (
                <div className="bg-green-100 border border-green-500 text-green-700 p-4 rounded-lg flex items-center gap-3 animate-fade-in">
                    <CheckCircle size={24} />
                    <div>
                        <h4 className="font-bold">Application Submitted!</h4>
                        <p className="text-sm">Your leave application has been sent to your Class Advisor for approval.</p>
                    </div>
                </div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">

                {/* Application Form */}
                <Card className="lg:col-span-2">
                    <form onSubmit={handleApply} className="flex flex-col gap-5">
                        <h3 className="font-bold border-b pb-2 mb-2 uppercase text-muted tracking-wider text-sm">Leave Application Form</h3>

                        <div className="grid lg:grid-cols-2 gap-4">
                            <Select
                                label="Leave Type *"
                                options={['Medical Leave', 'Casual Leave', 'On Duty (OD)']}
                                value={leaveType}
                                onChange={(e) => setLeaveType(e.target.value)}
                                required
                            />

                            <div className="input-group">
                                <span className="input-label block text-sm font-medium mb-1">Day Type *</span>
                                <div className="flex gap-4 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="dayType" value="single" checked={dayType === 'single'} onChange={() => setDayType('single')} /> Single Day
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="dayType" value="multi" checked={dayType === 'multi'} onChange={() => setDayType('multi')} /> Multi Day
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-4">
                            <Input label={dayType === 'single' ? 'Date *' : 'From Date *'} type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} required />
                            {dayType === 'multi' && <Input label="To Date *" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} required />}
                        </div>

                        <Input label="Leave Reason *" placeholder="Short reason..." value={reason} onChange={(e) => setReason(e.target.value)} required />

                        <div className="input-group">
                            <label className="input-label block text-sm font-medium mb-1">Detailed Description</label>
                            <textarea
                                className="w-full border rounded p-2 min-h-[100px] resize-y"
                                placeholder="Elaborate your reason..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                maxLength={500}
                            ></textarea>
                        </div>

                        <div className="flex justify-end mt-4">
                            <Button type="submit" variant="primary" className="px-8 shadow-md" disabled={isLoading}>
                                {isLoading ? 'Submitting...' : 'Submit Application'}
                            </Button>
                        </div>
                    </form>
                </Card>

                {/* History Sidebar */}
                <div className="flex flex-col gap-4">
                    <Card className="bg-blue-50 border-blue-100">
                        <h3 className="font-bold text-primary flex items-center gap-2 mb-2"><FileText size={18} /> Leave Balance</h3>
                        <div className="flex justify-between items-center text-sm border-b border-blue-200 pb-2 mb-2">
                            <span>Casual Leave</span>
                            <span className="font-bold">4 / 12</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                            <span>Medical Leave</span>
                            <span className="font-bold text-muted">Unlimited</span>
                        </div>
                    </Card>

                    <h3 className="font-bold text-muted uppercase text-sm tracking-wider mt-2">Recent Applications</h3>
                    {applications.length === 0 && <p className="text-sm text-muted">No recent applications.</p>}
                    {applications.map((app, idx) => (
                        <Card key={idx} className="p-4 relative overflow-hidden group border-l-4 border-l-primary">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-sm text-primary">{app.from_date}</span>
                                <span className={`px-2 py-0.5 rounded text-xs flex items-center gap-1 font-bold ${app.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {app.status === 'Approved' ? <CheckCircle size={10} /> : <Clock size={10} />}
                                    {app.status}
                                </span>
                            </div>
                            <p className="font-medium text-sm">{app.reason}</p>
                            <p className="text-xs text-muted mt-1">{app.leave_type}</p>
                        </Card>
                    ))}
                </div>

            </div>
        </div>
    );
};