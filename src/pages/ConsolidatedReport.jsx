import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Select } from '../components/UI';
import { Download, Search, Printer, Info } from 'lucide-react';

export const ConsolidatedReport = () => {
    const [tableData, setTableData] = useState([]);

    // Default dates (e.g., first day of current month to today)
    const today = new Date().toISOString().split('T')[0];
    const firstDay = new Date(new Date().setDate(1)).toISOString().split('T')[0];

    const [startDate, setStartDate] = useState(firstDay);
    const [endDate, setEndDate] = useState(today);
    const [isLoading, setIsLoading] = useState(false);

    const fetchReportData = async () => {
        setIsLoading(true);
        try {
            // ⚠️ REPLACE WITH YOUR LAPTOP'S IP
            const BACKEND_URL = `http://localhost:8000/attendance/report?start_date=${startDate}&end_date=${endDate}`;
            const response = await fetch(BACKEND_URL);
            const data = await response.json();

            if (response.ok) {
                setTableData(data.data);
            }
        } catch (error) {
            console.error("Error fetching report:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch data when component loads
    useEffect(() => {
        fetchReportData();
    }, []);

    // Calculate totals dynamically
    const totalConducted = tableData.length > 0 ? tableData[0].conducted : 0;
    const totalAttended = tableData.reduce((acc, curr) => acc + curr.attended, 0);
    const overallPercentage = totalConducted > 0
        ? ((totalAttended / (totalConducted * tableData.length)) * 100).toFixed(2)
        : 0;

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-primary uppercase">Attendance &gt; Consolidated Class Report</h2>
            </div>

            <Card className="flex flex-col md:flex-row gap-4 items-end">
                <Select label="Term" options={['S1', 'S2', 'S3', 'S4']} className="flex-1 w-full" defaultValue="S1" />
                <Input
                    label="Start Date"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="flex-1 w-full"
                />
                <Input
                    label="End Date"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="flex-1 w-full"
                />

                <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => { setStartDate(firstDay); setEndDate(today); }}>Reset</Button>
                    <Button variant="primary" onClick={fetchReportData} disabled={isLoading}>
                        <Search size={18} /> {isLoading ? 'Loading...' : 'Search'}
                    </Button>
                </div>
            </Card>

            <div className="flex justify-end gap-2 my-2">
                <Button variant="secondary" className="flex items-center gap-2"><Download size={16} /> Export CSV</Button>
                <Button variant="secondary" className="flex items-center gap-2"><Printer size={16} /> Print</Button>
            </div>

            <Card className="p-0 overflow-hidden shadow-md border-t-4 border-t-primary">
                <div className="bg-slate-100 p-4 text-center font-bold text-muted uppercase tracking-wider border-b">
                    Consolidated Student Report ({startDate} to {endDate})
                </div>
                <div className="table-container border-0 rounded-none max-h-[400px] overflow-y-auto">
                    <table className="table w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b">
                                <th className="py-3 px-4">Student Name</th>
                                <th className="text-center py-3">Days Conducted</th>
                                <th className="text-center py-3">Days Attended</th>
                                <th className="text-center py-3">Percentage %</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableData.map((row, idx) => (
                                <tr key={idx} className="hover:bg-primary-light transition-colors border-b">
                                    <td className="font-medium text-primary py-2 px-4">{row.name}</td>
                                    <td className="text-center py-2">{row.conducted}</td>
                                    <td className="text-center font-semibold py-2">{row.attended}</td>
                                    <td className="text-center py-2">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${row.percentage >= 90 ? 'bg-green-100 text-green-700' : row.percentage >= 75 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                            {row.percentage}%
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {tableData.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="text-center py-6 text-muted">No attendance data found for this date range.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};