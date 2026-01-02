import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle, XCircle, Activity, Volume2, StopCircle, 
  ShoppingBag, ChefHat, ExternalLink 
} from 'lucide-react';
import ProductChat from './ProductChat';

const AnalysisResult = ({ data, profile }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    // Cleanup speech synthesis on unmount
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  if (!data) return null;

  const handleSpeak = () => {
    window.speechSynthesis.cancel();
    const text = `Verdict is ${data.overall_risk}. ${data.summary}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const getRiskColor = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'avoid': return 'text-red-400 border-red-900 bg-red-950/30';
      case 'caution': return 'text-yellow-400 border-yellow-900 bg-yellow-950/30';
      case 'safe': return 'text-green-400 border-green-900 bg-green-950/30';
      default: return 'text-slate-400 border-slate-800 bg-slate-900';
    }
  };

  const getRiskIcon = (risk) => {
    switch (risk?.toLowerCase()) {
      case 'avoid': return <XCircle className="w-6 h-6 text-red-500" />;
      case 'caution': return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'safe': return <CheckCircle className="w-6 h-6 text-green-500" />;
      default: return <Activity className="w-6 h-6 text-slate-500" />;
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 animate-pulse-slow">
      
      {/* VERDICT CARD */}
      <div className={`p-6 rounded-xl border ${getRiskColor(data.overall_risk)} transition-all duration-500 relative`}>
        <div className="absolute top-4 right-4">
          <button 
            onClick={isSpeaking ? handleStop : handleSpeak}
            className={`p-2 rounded-full border transition-colors ${isSpeaking ? 'bg-red-900/50 border-red-500 text-red-400' : 'bg-slate-800/50 border-slate-600 text-blue-400'}`}
            title="Listen to Verdict"
          >
            {isSpeaking ? <StopCircle size={20} /> : <Volume2 size={20} />}
          </button>
        </div>

        <div className="flex items-center gap-4 mb-3">
          {getRiskIcon(data.overall_risk)}
          <h2 className="text-2xl font-bold uppercase tracking-wider">
            Verdict: {data.overall_risk}
          </h2>
        </div>
        <p className="text-lg text-slate-200 leading-relaxed pr-8">
          {data.summary}
        </p>
      </div>

      {/* ACTION CARDS GRID - Only show if risk is NOT Safe */}
      {data.overall_risk?.toLowerCase() !== 'safe' && (data.alternative_product_name || data.recipe_name) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. BUY ALTERNATIVE CARD */}
          {data.alternative_product_name && (
            <div className="bg-slate-900/80 border border-emerald-900/50 rounded-xl p-5 hover:border-emerald-500/50 transition-colors group">
              <div className="flex items-center gap-2 mb-3 text-emerald-400">
                <ShoppingBag size={20} />
                <h3 className="font-bold">Buy Better Alternative</h3>
              </div>
              <p className="text-slate-300 text-sm mb-4">
                Recommended: <span className="font-semibold text-white">{data.alternative_product_name}</span>
              </p>
              <a 
                href={`https://www.amazon.in/s?k=${encodeURIComponent(data.buy_link_query)}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Find on Amazon <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* 2. DIY RECIPE CARD */}
          {data.recipe_name && (
            <div className="bg-slate-900/80 border border-orange-900/50 rounded-xl p-5 hover:border-orange-500/50 transition-colors">
              <div className="flex items-center gap-2 mb-3 text-orange-400">
                <ChefHat size={20} />
                <h3 className="font-bold">Make it at Home</h3>
              </div>
              <p className="text-white font-medium mb-2">{data.recipe_name}</p>
              <p className="text-slate-400 text-sm leading-relaxed italic">
                "{data.recipe_steps}"
              </p>
            </div>
          )}
        </div>
      )}

      {/* INGREDIENT LIST */}
      <div className="bg-ai-card p-6 rounded-xl border border-slate-800">
        <h3 className="text-xl font-semibold text-slate-100 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" />
          Ingredient Analysis
        </h3>
        <div className="space-y-4">
          {data.ingredients_breakdown.map((item, index) => (
            <div key={index} className="p-4 rounded-lg bg-slate-900/50 border border-slate-800">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-blue-200">{item.name}</h4>
                  <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded mt-1 inline-block">
                    {item.function}
                  </span>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded border ${getRiskColor(item.risk_level)}`}>
                  {item.risk_level}
                </span>
              </div>
              <p className="mt-3 text-sm text-slate-300 italic border-l-2 border-slate-700 pl-3">
                "{item.reasoning}"
              </p>
            </div>
          ))}
        </div>
      </div>

      <ProductChat contextData={data} profile={profile} />
    </div>
  );
};

export default AnalysisResult;