import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import { analyzeIngredients, analyzeImage } from './services/api';
import AnalysisResult from './components/AnalysisResult';
import { 
  Sparkles, Loader2, ScanSearch, Camera, Upload, Type, X, RefreshCcw, UserCircle2 
} from 'lucide-react';

function App() {
  const [mode, setMode] = useState('text');
  const [profile, setProfile] = useState('General Healthy');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const webcamRef = useRef(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const profiles = [
    { id: 'General Healthy', label: '🥗 General' },
    { id: 'Diabetic', label: '🩸 Diabetic' },
    { id: 'Vegan', label: '🌱 Vegan' },
    { id: 'Hypertension', label: '❤️ BP/Heart' },
    { id: 'Gym/Athlete', label: '💪 Gym/Pro' }
  ];

  const handleTextAnalyze = async () => {
    if (!input.trim()) return;
    processAnalysis(() => analyzeIngredients(input, profile));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      processAnalysis(() => analyzeImage(file, profile));
    }
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setIsCameraActive(false);
      setImagePreview(imageSrc);
      
      fetch(imageSrc)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          processAnalysis(() => analyzeImage(file, profile));
        });
    }
  }, [webcamRef, profile]);

  const processAnalysis = async (apiCall) => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const data = await apiCall();
      setResult(data);
    } catch (err) {
      setError("Analysis failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setImagePreview(null);
    setInput('');
    setIsCameraActive(false);
    setError('');
  };

  return (
    <div className="min-h-screen bg-ai-dark text-ai-text p-6 flex flex-col items-center">
      
      <header className="mb-8 text-center space-y-4 max-w-2xl">
        <div className="inline-flex items-center justify-center p-3 bg-blue-500/10 rounded-full mb-2">
          <Sparkles className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          NutriSense AI
        </h1>
        <p className="text-slate-400">Personalized Food Analysis Co-pilot</p>
      </header>

      <div className="w-full max-w-3xl bg-ai-card border border-slate-800 rounded-2xl p-6 shadow-2xl mb-10">
        
        {!result && !loading && (
          <div className="flex gap-4 mb-8 justify-center border-b border-slate-800 pb-6">
            {[
              { id: 'text', icon: Type, label: 'Type' },
              { id: 'camera', icon: Camera, label: 'Scan' },
              { id: 'upload', icon: Upload, label: 'Upload' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setMode(tab.id); reset(); if(tab.id==='camera') setIsCameraActive(true); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  mode === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </div>
        )}

        {loading && (
          <div className="py-20 text-center flex flex-col items-center animate-pulse">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <h3 className="text-xl font-bold text-slate-200">Analyzing for {profile}...</h3>
            <p className="text-slate-500">AI is reading the ingredients</p>
          </div>
        )}

        {!loading && !result && (
          <div className="flex flex-col items-center justify-center">
            
            <div className="w-full mb-8">
              <div className="flex items-center gap-2 mb-3 text-slate-400 text-sm justify-center">
                <UserCircle2 size={16} />
                <span>Select Your Health Profile</span>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {profiles.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setProfile(p.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                      profile === p.id
                        ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                        : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {mode === 'text' && (
              <div className="w-full">
                <textarea
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-4 text-slate-200 focus:ring-2 focus:ring-blue-500 outline-none h-40 resize-none transition-all"
                  placeholder={`Paste ingredients here for ${profile} analysis...`}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  onClick={handleTextAnalyze}
                  disabled={!input}
                  className="mt-6 w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:opacity-50 rounded-xl font-bold flex justify-center items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
                >
                  <ScanSearch size={20} /> Analyze for {profile}
                </button>
              </div>
            )}

            {mode === 'camera' && (
              <div className="w-full flex flex-col items-center">
                {isCameraActive ? (
                  <div className="relative w-full max-w-md rounded-xl overflow-hidden border-2 border-blue-500 shadow-xl">
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      className="w-full"
                      videoConstraints={{ facingMode: "environment" }}
                    />
                    <button
                      onClick={capture}
                      className="absolute bottom-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-slate-200 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <div className="w-12 h-12 bg-red-500 rounded-full"></div>
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-10">
                    <button onClick={() => setIsCameraActive(true)} className="bg-slate-800 p-4 rounded-full mb-4">
                      <RefreshCcw className="w-6 h-6" />
                    </button>
                    <p>Camera inactive</p>
                  </div>
                )}
              </div>
            )}

            {mode === 'upload' && (
              <div className="w-full border-2 border-dashed border-slate-700 rounded-xl p-12 text-center hover:border-blue-500 transition-colors bg-slate-900/30">
                <Upload className="w-12 h-12 text-slate-500 mx-auto mb-4" />
                <p className="text-slate-300 mb-4">Drag & drop or click to upload image</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="px-8 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer text-blue-400 font-medium transition-colors"
                >
                  Select Image to Analyze
                </label>
              </div>
            )}

            {error && <p className="mt-4 text-red-400 bg-red-950/50 px-4 py-2 rounded">{error}</p>}
          </div>
        )}

        {result && (
          <div className="relative animate-in fade-in slide-in-from-bottom-4 duration-500">
            <button 
              onClick={reset}
              className="absolute -top-4 -right-2 p-2 bg-slate-800 rounded-full hover:bg-slate-700 z-10"
            >
              <X size={20} />
            </button>
            
            {imagePreview && (
              <div className="mb-6 flex justify-center">
                <img src={imagePreview} alt="Analyzed" className="h-40 rounded-lg border border-slate-700 shadow-md object-cover" />
              </div>
            )}
            
            <div className="mb-4 inline-block px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              Analyzed for: {profile}
            </div>

            <AnalysisResult data={result} profile={profile} />
            
            <button 
              onClick={reset}
              className="mt-8 w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold text-slate-300"
            >
              Scan Another Item
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;