import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, Button, Input } from '../components/UI';

export const Login = () => {
    const [role, setRole] = useState('student');
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role, identifier, password })
            });

            const data = await response.json();

            if (response.ok) {
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

    return (
        <div className="auth-wrapper animate-fade-in flex items-center justify-center min-h-screen bg-slate-50">
            <Card className="auth-card max-w-md w-full shadow-xl">
                <div className="text-center mb-6">
                    <h1 className="text-3xl text-primary font-bold mb-2">Syncedu</h1>
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
                </div>

                {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">{error}</div>}

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
            </Card>
        </div>
    );
};