import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/UI';
import { CheckCircle, XCircle, Clock, Search, FileText } from 'lucide-react';

export const LeaveApprovals = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const BACKEND_URL = "http://localhost:8000/leave";

    // 1. Fetch ALL leave requests for the Advisor
    useEffect(() => {
        const fetchAllLeaves = async () => {
            try {
                // We will create a new /all endpoint for the advisor
                const response = await fetch(`${BACKEND_URL}/all`);
                if (response.ok) {
                    const data = await response.json();
                    setRequests(data);
                }
            } catch (error) {
                console.error("Error fetching all leaves:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllLeaves();
    }, []);

    // 2. Update the status in MongoDB
    const handleAction = async (id, action) => {
        try {
            const response = await fetch(`${BACKEND_URL}/${id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: action })
            });

            if (response.ok) {
                // Update the UI instantly if the database update succeeded
                setRequests(requests.map(req =>
                    req.id === id ? { ...req, status: action } : req
                ));
            } else {
                alert("Failed to update status in the database.");
            }
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-primary">Leave Management &gt; Approvals</h2>
                <div className="flex gap-2">
                    <input type="text" placeholder="Search Name..." className="input-field py-1 px-3 text-sm h-full mx-0" />
                    <Button variant="secondary" className="py-1 px-3"><Search size={16} /></Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Pending Requests Column */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <h3 className="font-bold text-muted uppercase tracking-wider text-sm flex items-center gap-2">
                        <Clock size={16} /> Pending Requests
                    </h3>
                    
                    {isLoading && <p className="text-muted">Loading requests...</p>}
                    
                    {!isLoading && requests.filter(r => r.status === 'Pending').length === 0 ? (
                        <Card className="text-center p-8 text-muted border-dashed border-2">No pending leave requests.</Card>
                    ) : (
                        requests.filter(r => r.status === 'Pending').map(req => (
                            <Card key={req.id} className="border-l-4 border-l-warning flex flex-col sm:flex-row justify-between gap-4 shadow-sm">
                                <div className="flex flex-col gap-1 flex-1">
                                    <div className="flex items-center justify-between shadow-sm pb-2 border-b">
                                        <span className="font-bold text-lg text-primary">{req.student_name}</span>
                                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs font-bold">{req.leave_type}</span>
                                    </div>
                                    <div className="grid grid-cols-2 mt-2 gap-2 text-sm">
                                        <div>
                                            <span className="text-muted block text-xs font-medium">Dates Requested</span>
                                            <span className="font-semibold">{req.from_date} {req.to_date !== req.from_date ? `to ${req.to_date}` : ''}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted block text-xs font-medium">Reason</span>
                                            <span className="font-medium italic">"{req.reason}"</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex sm:flex-col gap-2 justify-center sm:min-w-[120px] sm:border-l pl-4">
                                    <Button
                                        variant="primary"
                                        className="flex-1 bg-green-500 hover:bg-green-600 text-xs py-1 text-white border-0"
                                        onClick={() => handleAction(req.id, 'Approved')}
                                    >
                                        <CheckCircle size={14} /> Approve
                                    </Button>
                                    <Button
                                        variant="danger"
                                        className="flex-1 text-xs py-1"
                                        onClick={() => handleAction(req.id, 'Rejected')}
                                    >
                                        <XCircle size={14} /> Reject
                                    </Button>
                                </div>
                            </Card>
                        ))
                    )}
                </div>

                {/* History/Actioned Log Column */}
                <div className="flex flex-col gap-4">
                    <h3 className="font-bold text-muted uppercase tracking-wider text-sm flex items-center gap-2">
                        <FileText size={16} /> Action History
                    </h3>

                    {requests.filter(r => r.status !== 'Pending').length === 0 ? (
                        <Card className="text-center p-8 text-muted text-sm border-dashed border-2">No recent actions.</Card>
                    ) : (
                        requests.filter(r => r.status !== 'Pending').map(req => (
                            <Card key={req.id} className={`p-4 border-l-4 ${req.status === 'Approved' ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                                <div className="flex justify-between items-start mb-1">
                                    <span className="font-bold text-sm text-primary">{req.student_name}</span>
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${req.status === 'Approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {req.status}
                                    </span>
                                </div>
                                <p className="font-medium text-sm">{req.reason}</p>
                                <p className="text-xs text-muted mt-1">{req.from_date} • {req.leave_type}</p>
                            </Card>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
};