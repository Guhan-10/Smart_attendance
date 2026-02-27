import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Card } from '../components/UI'; 
import { Camera, StopCircle, RefreshCw, CheckCircle, HelpCircle, Users, GraduationCap } from 'lucide-react';

export const LiveSession = () => {
    const location = useLocation();
    const classInfo = location.state?.classInfo || { dept: 'CSE', year: 'Second Year', section: 'B', subject: 'Unknown Subject' };
    const facultyName = classInfo.faculty_name || JSON.parse(localStorage.getItem("syncedu_user"))?.name || "Faculty";

    const totalStrength = 63;
    
    const [presentCount, setPresentCount] = useState(0);
    const [presentList, setPresentList] = useState([]);
    const [isScanning, setIsScanning] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // 1. Setup Camera AND Reset Stats
    useEffect(() => {
        setPresentCount(0);
        setPresentList([]);
        setIsScanning(false);

        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing webcam:", err);
            }
        };
        startCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // 2. The AI Scanning Loop (Silent 2-Minute Auto-Stop)
    useEffect(() => {
        let intervalId;
        let timeoutId;

        if (isScanning) {
            timeoutId = setTimeout(() => {
                setIsScanning(false); 
            }, 120000);

            intervalId = setInterval(async () => {
                if (videoRef.current && canvasRef.current) {
                    const video = videoRef.current;
                    const canvas = canvasRef.current;
                    
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;
                    canvas.getContext('2d').drawImage(video, 0, 0);

                    canvas.toBlob(async (blob) => {
                        const formData = new FormData();
                        formData.append("file", blob, "frame.jpg");

                        try {
                            const BACKEND_URL = "http://localhost:8000/attendance/mark";
                            
                            const response = await fetch(BACKEND_URL, {
                                method: "POST",
                                body: formData,
                            });
                            
                            const data = await response.json();

                            if (data.status === "success" && data.student_names) {
                                setPresentList(prevList => {
                                    const newUniqueNames = data.student_names.filter(name => 
                                        !prevList.some(student => student.name.toLowerCase() === name.toLowerCase())
                                    );

                                    if (newUniqueNames.length === 0) return prevList;

                                    const newEntries = newUniqueNames.map(name => ({
                                        roll: new Date().toLocaleTimeString(),
                                        name: name
                                    }));

                                    const updatedList = [...newEntries, ...prevList];
                                    setPresentCount(updatedList.length);
                                    return updatedList;
                                });
                            }
                        } catch (error) {
                            console.error("Backend connection error:", error);
                        }
                    }, 'image/jpeg', 0.8);
                }
            }, 2500); 
        }
        
        return () => {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
        };
    }, [isScanning]);


    const handleEndSession = () => {
        setIsScanning(false);
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in relative min-h-[80vh]">
            
            {/* Header Status Bar */}
            <div className={`p-3 rounded-xl flex items-center justify-center gap-3 font-bold text-white shadow-lg transition-all duration-500 ${isScanning ? 'bg-rose-500 animate-pulse' : 'bg-slate-800'}`}>
                {isScanning ? <Camera size={22} /> : <StopCircle size={22} />}
                <span className="tracking-wide">{isScanning ? 'LIVE SCANNING IN PROGRESS' : 'SESSION PAUSED - WAITING TO START'}</span>
            </div>

            {/* Class Info & Counter */}
            <div className="flex justify-between items-end mb-4 px-2">
                <div>
                    <h2 className="text-3xl font-black text-slate-800 tracking-tight">{classInfo.subject}</h2>
                    
                    <div className="flex items-center gap-4 mt-2">
                        <p className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-sm border border-indigo-100 w-fit">
                            <GraduationCap size={16}/> Prof. {facultyName}
                        </p>
                        <p className="text-sm font-semibold text-slate-500 flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-lg w-fit">
                            <Users size={16}/> {classInfo.dept} {classInfo.section} • {classInfo.year}
                        </p>
                    </div>
                </div>

                <div className="flex flex-col items-end bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-200">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Live Attendance</span>
                    <div className="text-4xl font-black flex items-baseline gap-1">
                        <span className={isScanning ? 'text-emerald-500 animate-pulse' : 'text-slate-700'}>{presentCount}</span>
                        <span className="text-slate-300 text-2xl">/ {totalStrength}</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-2 gap-8 h-[550px]">

                {/* Left: Sleek Video Player Container */}
                <div className="relative flex flex-col w-full h-full bg-black rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/10">
                    <canvas ref={canvasRef} style={{ display: 'none' }} />
                    <video 
                        ref={videoRef} 
                        autoPlay 
                        playsInline 
                        muted
                        className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1] opacity-90" 
                    />

                    {/* AI Scanning Overlay */}
                    {isScanning && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-emerald-900/10 transition-all">
                            <div className="relative w-72 h-72 border border-emerald-400/50 rounded-2xl animate-pulse flex items-center justify-center">
                                <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl"></div>
                                <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl"></div>
                                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl"></div>
                                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl"></div>
                            </div>
                        </div>
                    )}

                    {/* Premium Media Control Bar (Bottom) */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent pt-32 pb-8 px-8 flex justify-between items-center z-20">
                        
                        <button
                            className={`px-8 py-3.5 rounded-2xl font-bold flex items-center gap-3 transition-all duration-300 ease-out transform hover:-translate-y-1 border ${
                                isScanning 
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_8px_30px_rgb(245,158,11,0.4)] border-amber-400/50 hover:from-amber-400 hover:to-orange-400' 
                                : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_8px_30px_rgb(16,185,129,0.4)] border-emerald-400/50 hover:from-emerald-400 hover:to-teal-400'
                            }`}
                            onClick={() => setIsScanning(!isScanning)}
                        >
                            {isScanning ? <StopCircle size={22} className="animate-pulse" /> : <Camera size={22} />}
                            <span className="tracking-wide">{isScanning ? 'PAUSE AI SCAN' : 'START AI SCAN'}</span>
                        </button>

                        <button 
                            className="px-8 py-3.5 rounded-2xl font-bold flex items-center gap-3 bg-slate-800/80 backdrop-blur-md text-white border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.5)] transition-all duration-300 ease-out transform hover:-translate-y-1 hover:bg-rose-500 hover:border-rose-400 hover:shadow-[0_8px_30px_rgb(225,29,72,0.4)] group" 
                            onClick={handleEndSession}
                        >
                            <StopCircle size={22} className="text-rose-400 group-hover:text-white transition-colors" /> 
                            <span className="tracking-wide">END SESSION</span>
                        </button>
                    </div>
                </div>

                {/* Right: Modern List Panel */}
                <Card className="flex flex-col h-full shadow-2xl border-0 ring-1 ring-slate-100 rounded-3xl overflow-hidden p-0 bg-white">
                    <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-extrabold text-slate-700 uppercase tracking-widest text-sm flex items-center gap-2">
                            <CheckCircle size={18} className="text-emerald-500" /> Live Detection Log
                        </h3>
                        {isScanning && <RefreshCw size={18} className="animate-spin text-indigo-500" />}
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 relative bg-slate-50/50">
                        {presentList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-slate-400 absolute inset-0">
                                <div className="bg-slate-100 p-4 rounded-full mb-4">
                                    <Camera size={32} className="text-slate-300" />
                                </div>
                                <p className="font-medium">Waiting for faces in frame...</p>
                            </div>
                        ) : (
                            <ul className="flex flex-col gap-3">
                                {presentList.map((student, idx) => (
                                    <li key={idx} className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100 border-l-4 border-l-emerald-500 animate-fade-in transition-all hover:shadow-md">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-800 text-lg">{student.name}</span>
                                            <span className="font-medium text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                                                Detected at {student.roll}
                                            </span>
                                        </div>
                                        <span className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1">
                                            <CheckCircle size={14} /> Present
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </Card>

            </div>

        </div>
    );
};