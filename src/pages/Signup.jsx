import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, Input, Select } from '../components/UI';

export const Signup = () => {
    const [role, setRole] = useState('student');
    const [rollNumber, setRollNumber] = useState('');
    const [detectedYear, setDetectedYear] = useState('');
    const navigate = useNavigate();

    // Form States
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [department, setDepartment] = useState('CSE');
    const [dob, setDob] = useState('');
    const [mobile, setMobile] = useState('');

    // Student specific states
    const [programme, setProgramme] = useState('');
    const [parentMobile, setParentMobile] = useState('');
    const [parentEmail, setParentEmail] = useState('');

    // Faculty/Advisor specific states
    const [designation, setDesignation] = useState('');

    // Advisor specific states
    const [section, setSection] = useState('A');
    const [advisorYear, setAdvisorYear] = useState('1st Year');

    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (role === 'student' && rollNumber.length >= 2) {
            const prefix = rollNumber.substring(0, 2);
            if (prefix === '25') setDetectedYear('First Year');
            else if (prefix === '24') setDetectedYear('Second Year');
            else if (prefix === '23') setDetectedYear('Third Year');
            else if (prefix === '22') setDetectedYear('Fourth Year');
            else setDetectedYear('');
        } else {
            setDetectedYear('');
        }
    }, [rollNumber, role]);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Determine the primary identifier for login
        const identifier = role === 'student' ? rollNumber : email;

        const payload = {
            name,
            role,
            identifier,
            password,
            email,
            department,
            // Advisor-specific top-level fields
            ...(role === 'advisor' && { section, advisorYear }),
            // Include extra profile data in the database for later use
            profileData: {
                dob,
                mobile,
                ...(role === 'student' && { rollNumber, programme, parentMobile, parentEmail, year: detectedYear }),
                ...(role !== 'student' && { designation })
            }
        };

        try {
            const response = await fetch("http://localhost:8000/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok) {
                alert("Account created successfully! Please log in.");
                navigate('/'); // Send them back to the login page
            } else {
                setError(data.detail || "Registration failed.");
            }
        } catch (err) {
            console.error("Signup Error:", err);
            setError("Cannot connect to server.");
        } finally {
            setIsLoading(false);
        }
    };

    const departments = ['CSE', 'ECE', 'AIDS', 'AIML', 'EEE', 'IT', 'EIE', 'Civil', 'Mechanical', 'CSD'];

    return (
        <div className="auth-wrapper animate-fade-in flex items-center justify-center min-h-screen bg-slate-50 py-8 px-4">
            <Card className="auth-card max-w-2xl w-full shadow-xl">
                <div className="text-center mb-6">
                    <h1 className="text-3xl text-primary font-bold mb-2">Create Account</h1>
                    <p className="text-muted text-sm">Join Syncedu to access the platform.</p>
                </div>

                <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
                    {['student', 'advisor', 'faculty'].map((r) => (
                        <button
                            key={r}
                            type="button"
                            className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${role === r ? 'bg-white shadow text-primary' : 'text-muted hover:text-text-main'}`}
                            onClick={() => setRole(r)}
                        >
                            {r.charAt(0).toUpperCase() + r.slice(1)}
                        </button>
                    ))}
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSignup} className="flex flex-col">
                    {role === 'student' && (
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                            <Input label="Roll Number" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} placeholder="e.g. 24CSR097" required />
                            {detectedYear && (
                                <div className="md:col-span-2">
                                    <div className="bg-green-100 text-green-700 px-3 py-1 rounded inline-block text-xs font-bold">Detected: {detectedYear}</div>
                                </div>
                            )}
                            <Input label="Programme" placeholder="e.g. B.E" value={programme} onChange={e => setProgramme(e.target.value)} required />
                            <Select label="Department" options={departments} value={department} onChange={e => setDepartment(e.target.value)} required />
                            <Input label="Date of Birth" type="date" value={dob} onChange={e => setDob(e.target.value)} required />
                            <Input label="Mobile Number" type="tel" value={mobile} onChange={e => setMobile(e.target.value)} required />
                            <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                            <Input label="Parent Mobile" type="tel" value={parentMobile} onChange={e => setParentMobile(e.target.value)} required />
                            <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
                                <Input label="Parent Email" type="email" value={parentEmail} onChange={e => setParentEmail(e.target.value)} />
                                <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                        </div>
                    )}

                    {(role === 'advisor' || role === 'faculty') && (
                        <div className="grid md:grid-cols-2 gap-4">
                            <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
                            <Input label="Faculty Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                            <Select label="Department" options={departments} value={department} onChange={e => setDepartment(e.target.value)} required />
                            <Input label="Designation" value={designation} onChange={e => setDesignation(e.target.value)} required />
                            <Input label="Date of Birth" type="date" value={dob} onChange={e => setDob(e.target.value)} required />
                            <Input label="Mobile Number" type="tel" value={mobile} onChange={e => setMobile(e.target.value)} required />
                            {role === 'advisor' && (
                                <>
                                    <Select label="Section" options={['A', 'B', 'C']} value={section} onChange={e => setSection(e.target.value)} required />
                                    <Select label="Year" options={['1st Year', '2nd Year', '3rd Year', '4th Year']} value={advisorYear} onChange={e => setAdvisorYear(e.target.value)} required />
                                </>
                            )}
                            <div className="md:col-span-2">
                                <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                            </div>
                        </div>
                    )}

                    <Button type="submit" className="w-full mt-6 py-3" variant="primary" disabled={isLoading}>
                        {isLoading ? 'Creating Account...' : 'Sign Up'}
                    </Button>

                    <div className="text-center mt-6 text-sm text-muted">
                        Already have an account? <Link to="/" className="text-primary font-semibold hover:underline">Login</Link>
                    </div>
                </form>
            </Card>
        </div>
    );
};