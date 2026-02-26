import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, Select } from '../components/UI';
import { Plus, PlayCircle, Grid } from 'lucide-react';

export const FacultyDashboard = () => {
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [newClass, setNewClass] = useState({ dept: 'CSE', year: 'First Year', section: '', subject: '' });
    const [isLoading, setIsLoading] = useState(false);

    const BACKEND_URL = "http://localhost:8000/faculty/classes";

    // 1. Fetch saved classes from MongoDB when the page loads
    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await fetch(BACKEND_URL);
                if (response.ok) {
                    const data = await response.json();
                    setClasses(data);
                }
            } catch (error) {
                console.error("Error fetching classes:", error);
            }
        };
        fetchClasses();
    }, []);

    // 2. Send new class to MongoDB
    const handleAddClass = async (e) => {
        e.preventDefault();
        if (newClass.dept && newClass.year && newClass.section && newClass.subject) {
            setIsLoading(true);
            try {
                // Get the logged-in faculty's name from localStorage
                const sessionStr = localStorage.getItem("syncedu_user");
                const session = sessionStr ? JSON.parse(sessionStr) : { name: "Unknown Faculty" };
                
                // Attach it to the data we are sending to Python
                const payload = {
                    ...newClass,
                    faculty_name: session.name
                };

                const response = await fetch(BACKEND_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload) // Send the updated payload here
                });

                if (response.ok) {
                    const savedClass = await response.json();
                    setClasses([...classes, savedClass]);
                    setNewClass({ dept: 'CSE', year: 'First Year', section: '', subject: '' });
                }
            } catch (error) {
                console.error("Error saving class:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const startLiveSession = (cls) => {
        navigate('/faculty/live', { state: { classInfo: cls } });
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold text-primary">Faculty Dashboard &gt; Classes Handled</h2>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* Add Class Form */}
                <Card className="lg:col-span-1 h-fit border-t-4 border-t-primary">
                    <h3 className="font-bold border-b pb-2 mb-4 uppercase text-muted tracking-wider text-sm flex items-center gap-2">
                        <Plus size={16} /> Add New Class
                    </h3>
                    <form onSubmit={handleAddClass} className="flex flex-col gap-4">
                        <Select
                            label="Department"
                            options={['CSE', 'ECE', 'IT', 'AIDS', 'AIML', 'EEE']}
                            value={newClass.dept}
                            onChange={(e) => setNewClass({ ...newClass, dept: e.target.value })}
                            required
                        />
                        <Select
                            label="Year"
                            options={['First Year', 'Second Year', 'Third Year', 'Fourth Year']}
                            value={newClass.year}
                            onChange={(e) => setNewClass({ ...newClass, year: e.target.value })}
                            required
                        />
                        <Input
                            label="Section"
                            placeholder="e.g. A, B, C"
                            value={newClass.section}
                            onChange={(e) => setNewClass({ ...newClass, section: e.target.value.toUpperCase() })}
                            maxLength={1}
                            required
                        />
                        <Input
                            label="Subject Name"
                            placeholder="e.g. Data Structures"
                            value={newClass.subject}
                            onChange={(e) => setNewClass({ ...newClass, subject: e.target.value })}
                            required
                        />
                        <Button type="submit" variant="primary" className="mt-2 w-full" disabled={isLoading}>
                            {isLoading ? 'Saving...' : 'Save Class Setup'}
                        </Button>
                    </form>
                </Card>

                {/* Classes List */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                    <h3 className="font-bold text-muted uppercase tracking-wider text-sm flex items-center gap-2">
                        <Grid size={16} /> Configured Classes
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-4">
                        {classes.length === 0 ? (
                            <Card className="sm:col-span-2 text-center p-8 text-muted border-dashed border-2">
                                No classes configured yet. Add a class to get started.
                            </Card>
                        ) : (
                            classes.map((cls) => (
                                <Card key={cls.id} className="flex flex-col justify-between hover:border-primary transition-colors border-l-4 border-l-primary shadow-sm hover:shadow-md">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="bg-primary-light text-primary px-2 py-1 rounded text-xs font-bold">{cls.dept}</span>
                                            <span className="text-xs font-bold text-muted uppercase">{cls.year}</span>
                                        </div>
                                        <h4 className="font-bold text-lg text-primary mb-1">{cls.subject}</h4>
                                        <p className="text-sm font-medium text-muted">Section: <span className="text-text-main font-bold">{cls.section}</span></p>
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-slate-100">
                                        <Button
                                            variant="primary"
                                            className="w-full flex items-center justify-center gap-2 shadow-sm hover:-translate-y-1 transition-transform"
                                            onClick={() => startLiveSession(cls)}
                                        >
                                            <PlayCircle size={18} /> Start Live Session
                                        </Button>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};