import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../components/UI';
import { Search, Info } from 'lucide-react';

export const DailyAttendance = () => {
    const [dates, setDates] = useState([]);
    const [studentName, setStudentName] = useState("Guhan"); // Default student to search
<<<<<<< HEAD

=======
    
>>>>>>> 707c1a61a0b75343c5a72cbc6d763196a4964721
    // Default dates
    const today = new Date().toISOString().split('T')[0];
    const pastMonth = new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(pastMonth);
    const [endDate, setEndDate] = useState(today);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDailyData = async () => {
        if (!studentName) return alert("Please enter a student name");
        setIsLoading(true);
<<<<<<< HEAD

        try {
            // ⚠️ REPLACE WITH YOUR LAPTOP'S IP
            const BACKEND_URL = `http://localhost:8000/attendance/daily?student_name=${studentName}&start_date=${startDate}&end_date=${endDate}`;
            const response = await fetch(BACKEND_URL);
            const data = await response.json();

=======
        
        try {
            // ⚠️ REPLACE WITH YOUR LAPTOP'S IP
            const BACKEND_URL = `http://192.168.X.X:8000/attendance/daily?student_name=${studentName}&start_date=${startDate}&end_date=${endDate}`;
            const response = await fetch(BACKEND_URL);
            const data = await response.json();
            
>>>>>>> 707c1a61a0b75343c5a72cbc6d763196a4964721
            if (response.ok) {
                setDates(data.data);
            } else {
                alert(data.detail || "Failed to fetch records");
            }
        } catch (error) {
            console.error("Error fetching daily report:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Load data on first mount
    useEffect(() => {
        fetchDailyData();
    }, []);

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <h2 className="text-xl font-bold text-primary mb-2">Daily Attendance (Calendar View)</h2>

            {/* Filters */}
            <Card className="flex flex-col md:flex-row gap-4 items-end">
<<<<<<< HEAD
                <Input
                    label="Student First Name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="flex-1 w-full"
                    placeholder="e.g. Harisanth"
                />
                <Input
                    label="From Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 w-full"
                />
                <Input
                    label="To Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 w-full"
=======
                <Input 
                    label="Student First Name" 
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="flex-1 w-full" 
                    placeholder="e.g. Harisanth"
                />
                <Input 
                    label="From Date" 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 w-full" 
                />
                <Input 
                    label="To Date" 
                    type="date" 
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)} 
                    className="flex-1 w-full" 
>>>>>>> 707c1a61a0b75343c5a72cbc6d763196a4964721
                />
                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => { setStartDate(pastMonth); setEndDate(today); }}>Reset</Button>
                    <Button variant="primary" onClick={fetchDailyData} disabled={isLoading}>
                        <Search size={18} /> {isLoading ? 'Searching...' : 'Search'}
                    </Button>
                </div>
            </Card>

            <div className="flex justify-end gap-2 text-sm">
                <Button variant="secondary" className="py-1">Print</Button>
                <Button variant="secondary" className="py-1">Export</Button>
            </div>

            <div className="text-muted text-sm flex items-center gap-2 mb-2 uppercase">
                <Info size={16} /> Viewing Records for {studentName} FROM {startDate} TO {endDate}
            </div>

            {/* The Calendar/Grid Table */}
            <Card className="p-0 overflow-hidden">
                <div className="table-container border-0 rounded-none w-full max-h-[500px]" style={{ overflowX: 'auto', overflowY: 'auto' }}>
                    <table className="table text-center whitespace-nowrap" style={{ minWidth: '800px' }}>
                        <thead className="bg-[#f8fafc] border-b sticky top-0 z-10 shadow-sm">
                            <tr>
                                <th className="font-semibold text-muted text-center w-32 border-r bg-[#f8fafc]">DATES</th>
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(h => (
                                    <th key={h} className="font-semibold text-muted text-center w-24 bg-[#f8fafc]">HOUR {h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {dates.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="py-8 text-muted">No working days found in this range.</td>
                                </tr>
                            )}
                            {dates.map((row, idx) => (
                                <tr key={idx} className="border-b last:border-0 hover:bg-slate-50 transition-colors">
                                    <td className="font-semibold border-r text-primary text-center">{row.dateStr}</td>
                                    {row.isHoliday ? (
                                        <td colSpan={8} className="text-danger font-medium text-center bg-red-50/50">
                                            {row.holidayName}
                                        </td>
                                    ) : (
                                        row.hours.map((status, hIdx) => (
                                            <td key={hIdx} className="font-bold text-center">
<<<<<<< HEAD
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full shadow-sm text-sm ${status === 'P' ? 'text-green-700 bg-green-100' :
                                                        status === 'A' ? 'text-red-700 bg-red-100' :
                                                            'text-yellow-700 bg-yellow-100'
                                                    }`}>
=======
                                                <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full shadow-sm text-sm ${
                                                    status === 'P' ? 'text-green-700 bg-green-100' :
                                                    status === 'A' ? 'text-red-700 bg-red-100' :
                                                    'text-yellow-700 bg-yellow-100'
                                                }`}>
>>>>>>> 707c1a61a0b75343c5a72cbc6d763196a4964721
                                                    {status}
                                                </span>
                                            </td>
                                        ))
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            <div className="flex gap-4 items-center justify-center mt-4">
                <span className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full bg-green-500"></span> Present</span>
                <span className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full bg-red-500"></span> Absent</span>
                <span className="flex items-center gap-2 text-sm"><span className="w-3 h-3 rounded-full bg-yellow-500"></span> Leave</span>
            </div>
        </div>
    );
};