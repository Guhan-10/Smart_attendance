import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, Input } from '../components/UI';

export const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // For handling faculty/advisor choice after login
    const [userData, setUserData] = useState(null);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Save user session — backend returns data inside data.user
                const u = data.user;
                const userSession = {
                    name: u.name,
                    role: u.role,
                    identifier: identifier,
                    email: u.email,
                    department: u.department
                };

                if (u.role === 'student') {
                    localStorage.setItem("syncedu_user", JSON.stringify(userSession));
                    navigate('/student');
                } else if (u.role === 'faculty' || u.role === 'advisor') {
                    // Show the intermediate step
                    setUserData(userSession);
                }
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

    const handleRoleSelection = (selectedRole) => {
        const finalSession = { ...userData, role: selectedRole };
        localStorage.setItem("syncedu_user", JSON.stringify(finalSession));
        if (selectedRole === 'advisor') navigate('/advisor');
        else navigate('/faculty');
    };

    return (
        <div className="auth-wrapper animate-fade-in flex items-center justify-center min-h-screen bg-slate-50">
            <Card className="auth-card max-w-md w-full shadow-xl">
                <div className="text-center mb-6">
                    <h1 className="text-3xl text-primary font-bold mb-2">Syncedu</h1>
                    <p className="text-muted text-sm">
                        {userData ? `Welcome back, ${userData.name}!` : 'Welcome back! Please enter your details.'}
                    </p>
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

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
            </Card>
        </div>
    );
};