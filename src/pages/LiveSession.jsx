import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Button } from '../components/UI'; 
import { Camera, StopCircle, RefreshCw, CheckCircle, HelpCircle } from 'lucide-react';

export const LiveSession = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const classInfo = location.state?.classInfo || { dept: 'CSE', year: 'Second Year', section: 'B', subject: 'Unknown Subject' };

    const totalStrength = 63;
    const [presentCount, setPresentCount] = useState(0);
    const [isScanning, setIsScanning] = useState(false);
    const [presentList, setPresentList] = useState([]);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    // 1. Turn on the Webcam
    useEffect(() => {
        const startCamera = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Error accessing webcam:", err);
                alert("Please allow camera permissions in your browser.");
            }
        };
        startCamera();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    // 2. The UPDATED AI Scanning Loop for Multiple Faces
    useEffect(() => {
        let interval;
        if (isScanning) {
            interval = setInterval(async () => {
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
                            // Ensure this matches your local Python server!
                            const BACKEND_URL = "http://localhost:8000/attendance/mark";
                            
                            const response = await fetch(BACKEND_URL, {
                                method: "POST",
                                body: formData,
                            });
                            
                            const data = await response.json();

                            // THIS IS THE NEW PART: Loop through the array of names!
                            if (data.status === "success" && data.student_names) {
                                
                                setPresentList(prevList => {
                                    const newList = [...prevList];
                                    let newlyAddedCount = 0;

                                    // Check every name Python found
                                    data.student_names.forEach(recognizedName => {
                                        // Does this person already exist in our UI list?
                                        const alreadyExists = newList.some(student => student.name === recognizedName);
                                        
                                        if (!alreadyExists) {
                                            // Add them to the top!
                                            newList.unshift({
                                                roll: new Date().toLocaleTimeString(), 
                                                name: recognizedName
                                            });
                                            newlyAddedCount++;
                                        }
                                    });

                                    // Update the counter
                                    if (newlyAddedCount > 0) {
                                        setPresentCount(prevCount => prevCount + newlyAddedCount);
                                    }

                                    return newList;
                                });
                            }
                        } catch (error) {
                            console.error("Backend connection error:", error);
                        }
                    }, 'image/jpeg', 0.8);
                }
            }, 2500); 
        }
        
        return () => clearInterval(interval);
    }, [isScanning]);


    const handleEndSession = () => {
        setIsScanning(false);
        alert(`Session Ended. Total Present: ${presentCount} / ${totalStrength}. Attendance securely saved to database.`);
        navigate('/faculty');
    };

    return (
        <div className="flex flex-col gap-6 animate-fade-in relative min-h-[80vh]">
            
            <div className={`p-4 rounded-lg flex items-center justify-center gap-2 font-bold text-white shadow-md transition-colors ${isScanning ? 'bg-danger animate-pulse' : 'bg-primary'}`}>
                {isScanning ? <Camera size={20} /> : <StopCircle size={20} />}
                {isScanning ? 'LIVE SCANNING ONGOING' : 'SESSION PAUSED - START CAMERA SCAN'}
            </div>

            <div className="flex justify-between items-center mb-2">
                <div>
                    <h2 className="text-xl font-bold text-primary">{classInfo.subject} - {classInfo.dept} {classInfo.section}</h2>
                    <p className="text-sm text-muted">{classInfo.year} • Live Attendance Mode</p>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-sm font-bold text-muted uppercase tracking-wider">Attendance Counter</span>
                    <div className="text-3xl font-bold text-primary flex items-center gap-2">
                        <span className={isScanning ? 'text-success' : ''}>{presentCount}</span>
                        <span className="text-muted text-xl">/ {totalStrength}</span>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 h-full">

                <Card className="flex flex-col h-[500px] p-0 overflow-hidden relative border-2 border-primary-light border-dashed">
                    <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center z-0">
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                        <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            muted
                            className="w-full h-full object-cover transform scale-x-[-1]" 
                        />

                        {isScanning && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <div className="relative w-64 h-64 border-2 border-success border-dashed rounded-lg animate-pulse flex items-center justify-center">
                                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-success rounded-tl"></div>
                                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-success rounded-tr"></div>
                                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-success rounded-bl"></div>
                                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-success rounded-br"></div>
                                    <span className="absolute bottom-[-30px] text-sm font-bold text-success bg-black/50 px-3 py-1 rounded backdrop-blur-sm">
                                        ANALYZING FACES...
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="mt-auto absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-4 flex justify-between z-10 border-t border-white/10">
                        <Button
                            variant={isScanning ? 'warning' : 'success'}
                            className={`flex items-center gap-2 font-bold ${isScanning ? 'bg-warning hover:bg-yellow-600' : 'bg-success hover:bg-green-600'} text-white border-0`}
                            onClick={() => setIsScanning(!isScanning)}
                        >
                            {isScanning ? <StopCircle size={18} /> : <Camera size={18} />}
                            {isScanning ? 'Pause Scan' : 'Start Camera Scan'}
                        </Button>

                        <Button variant="danger" className="font-bold flex items-center gap-2 border-0" onClick={handleEndSession}>
                            <StopCircle size={18} /> End Session
                        </Button>
                    </div>
                </Card>

                <Card className="flex flex-col h-[500px] border-t-4 border-t-primary shadow-lg overflow-hidden p-0">
                    <div className="bg-slate-100 p-4 border-b flex justify-between items-center">
                        <h3 className="font-bold text-muted uppercase tracking-wider text-sm flex items-center gap-2">
                            <CheckCircle size={16} className="text-success" /> Live Present List
                        </h3>
                        {isScanning && <RefreshCw size={14} className="animate-spin text-primary" />}
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 bg-slate-50 relative">
                        {presentList.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-muted opacity-50 absolute inset-0">
                                <HelpCircle size={48} className="mb-2" />
                                <p>Awaiting face matches...</p>
                            </div>
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {presentList.map((student, idx) => (
                                    <li key={idx} className="flex justify-between items-center bg-white p-3 rounded shadow-sm border-l-2 border-l-success animate-fade-in relative overflow-hidden">
                                        <div className="absolute inset-y-0 left-0 w-full bg-success/5 transform -translate-x-full animate-[slideRight_1s_ease-out_forwards]"></div>
                                        <span className="font-bold text-primary z-10">{student.name}</span>
                                        <span className="font-semibold text-muted z-10 text-sm">Logged at: {student.roll}</span>
                                        <span className="badge badge-success px-2 py-0.5 text-xs z-10 shadow-sm"><CheckCircle size={12} /> Present</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </Card>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes slideRight {
          to { transform: translateX(0); }
        }
      `}} />
        </div>
    );
};