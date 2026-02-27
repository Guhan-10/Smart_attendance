import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, Input } from '../components/UI';

export const Login = () => {
<<<<<<< HEAD
=======
    const [role, setRole] = useState('student');
>>>>>>> 707c1a61a0b75343c5a72cbc6d763196a4964721
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
<<<<<<< HEAD

    // For handling faculty/advisor choice after login
    const [userData, setUserData] = useState(null);

=======
    
>>>>>>> 707c1a61a0b75343c5a72cbc6d763196a4964721
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
<<<<<<< HEAD
                body: JSON.stringify({ identifier, password })
=======
                body: JSON.stringify({ role, identifier, password })
>>>>>>> 707c1a61a0b75343c5a72cbc6d763196a4964721
            });

            const data = await response.json();

            if (response.ok) {
<<<<<<< HEAD
                // Save user session temporarily or permanently based on role
                const userSession = {
                    name: data.name,
                    role: data.role,
                    identifier: data.identifier
                };

                if (data.role === 'student') {
                    localStorage.setItem("syncedu_user", JSON.stringify(userSession));
                    navigate('/student');
                } else if (data.role === 'faculty' || data.role === 'advisor') {
                    // Show the intermediate step
                    setUserData(userSession);
                }
=======
                // Save user session in the browser!
                localStorage.setItem("syncedu_user", JSON.stringify({
                    name: data.name,
                    role: data.role,
                    identifier: data.identifier
                }));

                // Route them to the correct dashboard
                if (role === 'student') navigate('/student');
                else if (role === 'advisor') navigate('/advisor');
                else if (role === 'faculty') navigate('/faculty');
>>>>>>> 707c1a61a0b75343c5a72cbc6d763196a4964721
            } else {
                setError(data.detail || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            console.error("Login Error:", err);
            setError("Cannot connect to server.");
        } finally {
            setIsLoading(false);
        }
    };

<<<<<<< HEAD
    const handleRoleSelection = (selectedRole) => {
        const finalSession = { ...userData, role: selectedRole };
        localStorage.setItem("syncedu_user", JSON.stringify(finalSession));
        if (selectedRole === 'advisor') navigate('/advisor');
        else navigate('/faculty');
    };

=======
>>>>>>> 707c1a61a0b75343c5a72cbc6d763196a4964721
    return (
        <div className="auth-wrapper animate-fade-in flex items-center justify-center min-h-screen bg-slate-50">
            <Card className="auth-card max-w-md w-full shadow-xl">
                <div className="text-center mb-6">
                    <h1 className="text-3xl text-primary font-bold mb-2">Syncedu</h1>
<<<<<<< HEAD
                    <p className="text-muted text-sm">
                        {userData ? `Welcome back, ${userData.name}!` : 'Welcome back! Please enter your details.'}
                    </p>
=======
                    <p className="text-muted text-sm">Welcome back! Please enter your details.</p>
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
>>>>>>> 707c1a61a0b75343c5a72cbc6d763196a4964721
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

<<<<<<< HEAD
                {!userData ? (
                    <form onSubmit={handleLogin} className="flex flex-col gap-4">
                        <Input
                            label="Email OR Roll Number"
                            placeholder="e.g. 24CSR097 or Harisanth"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                            required
                        />
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <Button type="submit" className="w-full mt-2" variant="primary" disabled={isLoading}>
                            {isLoading ? 'Verifying...' : 'Sign In'}
                        </Button>

                        <div className="text-center mt-4 text-sm text-muted">
                            Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
                        </div>
                    </form>
                ) : (
                    <div className="flex flex-col gap-4 animate-fade-in">
                        <h3 className="text-center text-lg font-semibold mb-2">Continue as:</h3>
                        <Button
                            type="button"
                            className="w-full py-3"
                            variant="primary"
                            onClick={() => handleRoleSelection('faculty')}
                        >
                            Faculty
                        </Button>
                        <Button
                            type="button"
                            className="w-full py-3 bg-slate-200 text-slate-800 hover:bg-slate-300"
                            onClick={() => handleRoleSelection('advisor')}
                        >
                            Advisor
                        </Button>
                        <button
                            className="mt-4 text-sm text-muted hover:text-text-main underline w-full text-center"
                            onClick={() => setUserData(null)}
                        >
                            Back to Login
                        </button>
                    </div>
                )}
=======
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <Input
                        label={role === 'student' ? 'Email OR Roll Number' : 'Email OR Name'}
                        placeholder={role === 'student' ? 'e.g. 24CSR097' : 'e.g. Harisanth'}
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        required
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <Button type="submit" className="w-full mt-2" variant="primary" disabled={isLoading}>
                        {isLoading ? 'Verifying...' : `Sign In as ${role.charAt(0).toUpperCase() + role.slice(1)}`}
                    </Button>

                    <div className="text-center mt-4 text-sm text-muted">
                        Don't have an account? <Link to="/signup" className="text-primary font-semibold hover:underline">Sign up</Link>
                    </div>
                </form>
>>>>>>> 707c1a61a0b75343c5a72cbc6d763196a4964721
            </Card>
        </div>
    );
};