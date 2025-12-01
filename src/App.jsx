import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Terminal, MoveRight, Layers, Cpu, Radio, Disc, Upload, Play, Pause, Shield, ShieldAlert, FileCode, RotateCcw, FilePlus, Save, X, Edit, Music, Video, Image as ImageIcon, FileText, Package, AlertTriangle, Wifi, Gauge, ArrowUp, ArrowDown, Activity, Download, Film, Zap, Volume2, VolumeX, Database, Box, Type, ChevronLeft, ChevronRight, Maximize, Minimize, Folder, Filter, SortAsc, SortDesc, Grid, List, Search, ChevronDown, Check } from 'lucide-react';

/* --- SOUND ENGINE (Web Audio API) --- */
const SoundFX = {
  ctx: null,
  init: () => {
    if (!SoundFX.ctx) {
      SoundFX.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },
  playClick: () => {
    if (!SoundFX.ctx) SoundFX.init();
    const t = SoundFX.ctx.currentTime;
    const osc = SoundFX.ctx.createOscillator();
    const gain = SoundFX.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.05);
    
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    
    osc.connect(gain);
    gain.connect(SoundFX.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.05);
  },
  playHover: () => {
    if (!SoundFX.ctx) SoundFX.init();
    const t = SoundFX.ctx.currentTime;
    const osc = SoundFX.ctx.createOscillator();
    const gain = SoundFX.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(200, t);
    gain.gain.setValueAtTime(0.01, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.03);
    
    osc.connect(gain);
    gain.connect(SoundFX.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.03);
  },
  playBoot: () => {
    if (!SoundFX.ctx) SoundFX.init();
    const t = SoundFX.ctx.currentTime;
    const osc = SoundFX.ctx.createOscillator();
    const gain = SoundFX.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, t);
    osc.frequency.linearRampToValueAtTime(600, t + 0.4);
    
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.4);
    
    osc.connect(gain);
    gain.connect(SoundFX.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.4);
  },
  playKeystroke: () => {
    if (!SoundFX.ctx) SoundFX.init();
    const t = SoundFX.ctx.currentTime;
    const osc = SoundFX.ctx.createOscillator();
    const gain = SoundFX.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(600, t);
    gain.gain.setValueAtTime(0.005, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);
    osc.connect(gain);
    gain.connect(SoundFX.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.02);
  },
  playScan: () => {
    if (!SoundFX.ctx) SoundFX.init();
    const t = SoundFX.ctx.currentTime;
    const osc = SoundFX.ctx.createOscillator();
    const gain = SoundFX.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, t);
    osc.frequency.linearRampToValueAtTime(800, t + 0.5);
    
    gain.gain.setValueAtTime(0.02, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.5);
    
    osc.connect(gain);
    gain.connect(SoundFX.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.5);
  },
  playSuccess: () => {
    if (!SoundFX.ctx) SoundFX.init();
    const t = SoundFX.ctx.currentTime;
    const osc = SoundFX.ctx.createOscillator();
    const gain = SoundFX.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.linearRampToValueAtTime(880, t + 0.1);
    
    gain.gain.setValueAtTime(0.05, t);
    gain.gain.linearRampToValueAtTime(0, t + 0.6);
    
    osc.connect(gain);
    gain.connect(SoundFX.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.6);
  }
};

/* UTILITIES */
const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

const getFileType = (name) => {
  const ext = name.split('.').pop().toLowerCase();
  const map = {
    image: ['jpg','jpeg','png','gif','bmp','tiff','tif','webp','svg','heif','heic','psd'],
    video: ['mp4','mov','avi','mkv','flv','wmv','webm','m4v','mpg','mpeg','3gp','ts'],
    audio: ['mp3','wav','aac','flac','ogg','m4a','wma','aiff','alac'],
    pdf: ['pdf', 'doc', 'docx', 'rtf', 'odt', 'xls', 'xlsx', 'ppt', 'pptx', 'epub'],
    archive: ['zip','rar','7z','tar','gz','bz2','xz'],
    executable: ['exe','msi','app','bat','sh','dmg','apk'],
    code: ['html','css','js','py','java','cpp','c','php','rb','swift','go','ts','json','sql','txt'],
    font: ['ttf','otf','woff','woff2','eot','fon'],
    model: ['obj','fbx','stl','blend','dae','3ds','max'],
    database: ['db','mdb','accdb','sqlite','dbf']
  };
  
  for (const [type, exts] of Object.entries(map)) {
    if (exts.includes(ext)) return type === 'model' ? '3d' : type;
  }
  return 'unknown';
};

/* --- CUSTOM COMPONENTS --- */

const HeroImage = () => (
  <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden poster-image-container">
    <div className="absolute inset-0 bg-black mix-blend-multiply z-10"></div>
    <img 
      src="https://images.unsplash.com/photo-1618609378039-b572f64c5b42?q=80&w=1000&auto=format&fit=crop" 
      alt="Distorted Figure"
      className="w-full h-full object-cover object-center scale-110"
    />
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZDRmZjAwIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-50 z-20 pointer-events-none"></div>
  </div>
);

const CustomDropdown = ({ label, options, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative font-mono text-xs z-50" ref={dropdownRef}>
      <button 
        onClick={() => { SoundFX.playClick(); setIsOpen(!isOpen); }}
        className="flex items-center justify-between gap-2 px-3 py-2 border border-[var(--acid-green)] bg-black text-[var(--acid-green)] min-w-[160px] hover:bg-[rgba(212,255,0,0.1)] transition-colors uppercase"
      >
        <span>{options.find(o => o.value === value)?.label || value}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-1 border border-[var(--acid-green)] bg-black z-50 max-h-60 overflow-y-auto scrollbar-thin shadow-[0_0_15px_rgba(0,0,0,0.8)]">
          {options.map((option) => (
            <div 
              key={option.value}
              onClick={() => { 
                onChange(option.value); 
                setIsOpen(false); 
                SoundFX.playClick();
              }}
              className={`px-3 py-2 cursor-pointer hover:bg-[var(--acid-green)] hover:text-black transition-colors uppercase flex justify-between items-center ${value === option.value ? 'bg-[rgba(212,255,0,0.2)]' : ''}`}
            >
              {option.label}
              {value === option.value && <Check size={12} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* --- SYSTEM MONITOR --- */
const useSystemMonitor = () => {
  const [stats, setStats] = useState({ cpu: 0, mem: 0, net: 0 });
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicks(t => t + 1);
      const perf = window.performance;
      let memUsage = 0;
      if (perf && perf.memory) {
        memUsage = Math.round((perf.memory.usedJSHeapSize / perf.memory.jsHeapSizeLimit) * 100);
      } else {
        memUsage = 20 + Math.floor(Math.random() * 20);
      }
      let simulatedCpu = Math.floor(30 + Math.sin(Date.now() / 2000) * 20 + Math.random() * 15);
      if (ticks % 8 === 0) {
         simulatedCpu = 85 + Math.floor(Math.random() * 14);
      }
      setStats({
        cpu: Math.max(5, Math.min(100, simulatedCpu)),
        mem: memUsage,
        net: (Math.random() * 5.5).toFixed(1)
      });
    }, 1500);
    return () => clearInterval(interval);
  }, [ticks]);
  return stats;
};

/* --- MODULES --- */

/* 1. OVERVIEW MODULE */
const OverviewModule = ({ files, setFiles, onFileOpen }) => {
  const [filter, setFilter] = useState('ALL');
  const [sort, setSort] = useState('SIZE_DESC'); 
  const [searchTerm, setSearchTerm] = useState('');
  const [extFilter, setExtFilter] = useState('ALL');

  const totalSize = files.reduce((acc, curr) => acc + (curr.file?.size || 0), 0);
  
  const availableExtensions = useMemo(() => {
    const exts = new Set(files.map(f => `.${f.name.split('.').pop().toLowerCase()}`));
    return ['ALL', ...Array.from(exts).sort()];
  }, [files]);

  const stats = useMemo(() => {
    const counts = { image: 0, video: 0, code: 0, audio: 0, other: 0 };
    files.forEach(f => {
      if (counts[f.type] !== undefined) counts[f.type]++;
      else counts.other++;
    });
    return counts;
  }, [files]);

  const filteredFiles = files.filter(f => {
    if (filter !== 'ALL' && f.type !== filter) return false;
    const fileExt = `.${f.name.split('.').pop().toLowerCase()}`;
    if (extFilter !== 'ALL' && fileExt !== extFilter) return false;
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      const lowerName = f.name.toLowerCase();
      const lowerType = f.type.toLowerCase();
      if (lowerSearch.startsWith('.')) {
        if (!lowerName.endsWith(lowerSearch)) return false;
      } else if (['image', 'images', 'video', 'videos', 'audio', 'code', 'text', 'doc'].includes(lowerSearch)) {
         if (!lowerType.includes(lowerSearch.replace(/s$/, ''))) return false;
      } else {
         if (!lowerName.includes(lowerSearch)) return false;
      }
    }
    return true;
  }).sort((a, b) => {
    if (sort === 'SIZE_DESC') return (b.file?.size || 0) - (a.file?.size || 0);
    if (sort === 'SIZE_ASC') return (a.file?.size || 0) - (b.file?.size || 0);
    if (sort === 'NAME_ASC') return a.name.localeCompare(b.name);
    if (sort === 'NAME_DESC') return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div className="flex flex-col h-full overflow-hidden p-4 relative">
       <div className="absolute inset-0 bg-[linear-gradient(rgba(212,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(212,255,0,0.03)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 z-10 gap-4">
          <div>
             <h2 className="font-poster text-3xl mb-1">DATA CORE</h2>
             <p className="font-mono text-xs opacity-60 flex items-center gap-2">
               <Database size={12} /> STORAGE_USED: <span className="text-[var(--acid-green)]">{formatBytes(totalSize)}</span>
             </p>
          </div>
          <div className="flex gap-2 text-xs font-mono flex-wrap">
             <div className="px-3 py-1 border border-[var(--acid-green)] bg-[var(--acid-green)] text-black">TOTAL: {files.length}</div>
             <div className="px-3 py-1 border border-[var(--acid-green)] bg-black/50">IMG: {stats.image}</div>
             <div className="px-3 py-1 border border-[var(--acid-green)] bg-black/50">VID: {stats.video}</div>
             <div className="px-3 py-1 border border-[var(--acid-green)] bg-black/50">CODE: {stats.code}</div>
          </div>
       </div>

       <div className="flex flex-col gap-4 mb-6 z-40 relative">
          <div className="relative w-full md:w-1/2">
             <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--acid-green)] opacity-50" size={16} />
             <input 
                type="text" 
                placeholder="SEARCH_QUERY: [NAME | .EXT | TYPE]..." 
                className="w-full bg-black border border-[var(--acid-green)] text-[var(--acid-green)] pl-10 pr-4 py-2 text-xs font-mono focus:outline-none focus:border-opacity-100 border-opacity-50 transition-all placeholder:opacity-30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>

          <div className="flex flex-wrap gap-2 items-center">
             <CustomDropdown 
                label="FILTER: TYPE"
                value={filter}
                onChange={setFilter}
                options={[
                   { value: 'ALL', label: 'ALL TYPES' },
                   { value: 'image', label: 'IMAGES' },
                   { value: 'video', label: 'VIDEOS' },
                   { value: 'audio', label: 'AUDIO' },
                   { value: 'code', label: 'CODE / SCRIPT' },
                   { value: 'archive', label: 'ARCHIVES' },
                   { value: 'document', label: 'DOCS / PDF' }
                ]}
             />

             <CustomDropdown 
                label="FILTER: EXT"
                value={extFilter}
                onChange={setExtFilter}
                options={availableExtensions.map(ext => ({ value: ext, label: ext.toUpperCase() }))}
             />

             <CustomDropdown 
                label="SORT BY"
                value={sort}
                onChange={setSort}
                options={[
                   { value: 'SIZE_DESC', label: 'SIZE (HIGH-LOW)' },
                   { value: 'SIZE_ASC', label: 'SIZE (LOW-HIGH)' },
                   { value: 'NAME_ASC', label: 'NAME (A-Z)' },
                   { value: 'NAME_DESC', label: 'NAME (Z-A)' }
                ]}
             />
          </div>
       </div>

       <div className="flex-1 overflow-y-auto z-0 scrollbar-thin pb-20 relative">
          {filteredFiles.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
               {filteredFiles.map((f) => {
                 const originalIndex = files.indexOf(f);
                 return (
                   <div 
                      key={originalIndex} 
                      onClick={() => onFileOpen(originalIndex)}
                      className="border border-[var(--acid-green)] border-opacity-30 p-3 bg-black/40 hover:bg-[var(--acid-green)] hover:text-black hover:border-opacity-100 transition-all group flex flex-col justify-between h-32 relative overflow-hidden cursor-pointer"
                   >
                      <div className="absolute top-0 right-0 p-1 opacity-50 group-hover:opacity-100">
                         {f.type === 'video' ? <Video size={14} /> : f.type === 'image' ? <ImageIcon size={14} /> : <FileText size={14} />}
                      </div>
                      <div className="font-mono text-[10px] break-all leading-tight opacity-80 group-hover:opacity-100 max-h-16 overflow-hidden">
                         {f.name}
                      </div>
                      <div>
                         <div className="w-full h-[1px] bg-[var(--acid-green)] opacity-30 mb-1 group-hover:bg-black"></div>
                         <p className="font-mono text-[9px] opacity-60 group-hover:opacity-100">{formatBytes(f.file?.size)}</p>
                         <p className="font-mono text-[9px] opacity-40 group-hover:opacity-80 uppercase">{f.type}</p>
                      </div>
                   </div>
                 );
               })}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center opacity-30 border-2 border-dashed border-[var(--acid-green)]">
               <Package size={48} className="mb-4" />
               <p className="font-poster tracking-widest">NO ARTIFACTS MATCH QUERY</p>
            </div>
          )}
       </div>
    </div>
  );
};

/* 2. UNIVERSAL VIEWER MODULES */
const VideoPlayer = ({ src, fileName }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [feedbackText, setFeedbackText] = useState(null);
  const [error, setError] = useState(null);
  const [hoverTime, setHoverTime] = useState(null);
  const [hoverPos, setHoverPos] = useState(null);

  const formatTime = (time) => {
    if (!time) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    setIsPlaying(true);
    setProgress(0);
    setError(null);
    if(videoRef.current) {
        videoRef.current.volume = 1; 
        videoRef.current.play().catch(() => setIsPlaying(false)); 
    }
  }, [src]);

  const showFeedback = (text) => {
      setFeedbackText(text);
      setTimeout(() => setFeedbackText(null), 1200);
  };

  const togglePlay = () => {
    if (error) return;
    SoundFX.playClick();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(e => setError("Playback prevented."));
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuteState = !videoRef.current.muted;
      videoRef.current.muted = nextMuteState;
      setIsMuted(nextMuteState);
      showFeedback(nextMuteState ? "AUDIO_OFFLINE" : "AUDIO_ONLINE");
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
         containerRef.current.requestFullscreen().catch(() => {});
      } else {
         document.exitFullscreen();
      }
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
      if (e.code === 'KeyM') { toggleMute(); }
      if (e.code === 'KeyF') { toggleFullscreen(); }
      if (e.code === 'ArrowUp') {
         e.preventDefault();
         if(videoRef.current) {
            videoRef.current.volume = Math.min(1, videoRef.current.volume + 0.1);
            showFeedback(`VOLUME ${(videoRef.current.volume * 100).toFixed(0)}%`);
         }
      }
      if (e.code === 'ArrowDown') {
         e.preventDefault();
         if(videoRef.current) {
            videoRef.current.volume = Math.max(0, videoRef.current.volume - 0.1);
            showFeedback(`VOLUME ${(videoRef.current.volume * 100).toFixed(0)}%`);
         }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [src]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const p = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(p);
    }
  };

  const handleMouseMove = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const time = pos * videoRef.current.duration;
    setHoverTime(formatTime(time));
    setHoverPos(pos * 100);
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * videoRef.current.duration;
  };

  return (
    <div ref={containerRef} className="w-full h-full flex flex-col relative group bg-black" onDoubleClick={toggleFullscreen}>
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-black/90 z-20">
          <AlertTriangle size={48} className="text-red-500 mb-4 animate-pulse" />
          <h3 className="font-poster text-xl text-red-500 mb-2">STREAM_ERROR</h3>
          <p className="font-mono text-xs max-w-md">{error}</p>
        </div>
      ) : (
        <video ref={videoRef} src={src} className="w-full h-full object-contain" onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} onError={() => setError("Codec error.")} autoPlay />
      )}
      {feedbackText && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none">
           <h1 className="font-poster text-6xl text-[var(--acid-green)] tracking-tighter drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] animate-pulse">{feedbackText}</h1>
        </div>
      )}
      <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 flex flex-col gap-2">
        <div className="relative w-full h-4 bg-gray-800 cursor-pointer group/line" onMouseMove={handleMouseMove} onMouseLeave={() => setHoverTime(null)} onClick={handleSeek}>
           <div className="absolute top-0 left-0 h-full bg-[var(--acid-green)] pointer-events-none" style={{ width: `${progress}%` }}></div>
           {hoverTime && <div className="absolute bottom-full mb-2 px-2 py-1 bg-black border border-[var(--acid-green)] text-[var(--acid-green)] text-xs font-mono transform -translate-x-1/2 pointer-events-none z-50" style={{ left: `${hoverPos}%` }}>{hoverTime}</div>}
        </div>
        <div className="flex justify-between items-end">
          <div className="flex items-center gap-4">
             <button onClick={togglePlay} className="text-[var(--acid-green)] hover:text-white">
               {isPlaying ? <Pause size={24} /> : <Play size={24} />}
             </button>
             <button onClick={toggleMute} className="text-[var(--acid-green)] hover:text-white">{isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}</button>
             <span className="text-xs font-mono text-[var(--acid-green)] max-w-[200px] truncate">{fileName}</span>
          </div>
          <button onClick={toggleFullscreen} className="text-[var(--acid-green)] hover:text-white"><Maximize size={20} /></button>
        </div>
      </div>
    </div>
  );
};

const NetworkSpeedometer = () => {
  const [speed, setSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(25); 
  const [isTesting, setIsTesting] = useState(false);
  const [phase, setPhase] = useState('IDLE');
  const [connInfo, setConnInfo] = useState({ type: 'UNKNOWN', rtt: '0ms' });
  const [results, setResults] = useState(null);
  const angle = Math.min(90, Math.max(-90, (speed / maxSpeed) * 180 - 90));

  useEffect(() => {
    if (navigator.connection) {
      const conn = navigator.connection;
      setConnInfo({
        type: conn.effectiveType ? conn.effectiveType.toUpperCase() : 'WIFI/LAN',
        rtt: conn.rtt ? `${conn.rtt}ms` : '24ms'
      });
    }
  }, []);

  const calculateStats = (finalSpeed) => {
    const time1GB = (1024 / finalSpeed).toFixed(1);
    const time100MB = (100 / finalSpeed).toFixed(1);
    const mbps = finalSpeed * 8;
    const hdStreams = Math.floor(mbps / 5);
    let rank = "COPPER_WIRE";
    if (finalSpeed > 50) rank = "NEURAL_LINK";
    else if (finalSpeed > 20) rank = "FIBER_OPTIC";
    else if (finalSpeed > 5) rank = "BROADBAND";
    else if (finalSpeed > 1) rank = "LTE_CELLULAR";
    return { time1GB, time100MB, hdStreams, rank, finalSpeed };
  };

  const runSpeedTest = () => {
    if (isTesting) return;
    SoundFX.playScan();
    setIsTesting(true);
    setPhase('DOWNLOAD');
    setSpeed(0);
    setResults(null);
    setMaxSpeed(navigator.connection?.downlink ? navigator.connection.downlink / 8 * 2 : 25); 

    let currentSpeed = 0;
    const downloadTarget = navigator.connection?.downlink ? navigator.connection.downlink / 8 : 12.5; 
    
    const downloadInterval = setInterval(() => {
      if (currentSpeed < downloadTarget) {
        currentSpeed += (Math.random() * 2); 
      } else {
        currentSpeed = downloadTarget + (Math.random() - 0.5); 
      }
      setSpeed(Math.max(0, currentSpeed));
    }, 100);

    setTimeout(() => {
      clearInterval(downloadInterval);
      setPhase('UPLOAD');
      SoundFX.playScan();
      
      const uploadTarget = downloadTarget * 0.4; 
      let upSpeed = currentSpeed;
      
      const uploadInterval = setInterval(() => {
        if (Math.abs(upSpeed - uploadTarget) > 1) {
            upSpeed += (uploadTarget - upSpeed) * 0.1;
        } else {
            upSpeed = uploadTarget + (Math.random() * 0.5 - 0.25);
        }
        setSpeed(Math.max(0, upSpeed));
      }, 100);

      setTimeout(() => {
        clearInterval(uploadInterval);
        SoundFX.playSuccess();
        const finalStats = calculateStats(downloadTarget); 
        setResults(finalStats);
        setPhase('RESULTS');
        setIsTesting(false);
        setSpeed(0); 
      }, 3000);

    }, 3000);
  };

  const resetTest = () => {
    SoundFX.playClick();
    setPhase('IDLE');
    setResults(null);
    setSpeed(0);
  };

  if (phase === 'RESULTS' && results) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full p-4 page-transition">
         <div className="w-full max-w-2xl border border-[var(--acid-green)] bg-black/80 p-6 relative">
            <div className="absolute top-0 right-0 p-2">
               <Zap size={24} className="text-[var(--acid-green)] animate-pulse" />
            </div>
            
            <h2 className="font-poster text-3xl mb-1 text-white">ANALYSIS COMPLETE</h2>
            <div className="h-1 w-24 bg-[var(--acid-green)] mb-6"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
               <div className="flex flex-col">
                  <span className="text-xs font-mono opacity-50 mb-1">CONNECTION RANK</span>
                  <span className="text-2xl font-poster text-[var(--acid-green)] tracking-widest">{results.rank}</span>
               </div>
               <div className="flex flex-col text-right">
                  <span className="text-xs font-mono opacity-50 mb-1">PEAK BANDWIDTH</span>
                  <span className="text-4xl font-poster text-white">{results.finalSpeed.toFixed(1)} <span className="text-sm text-[var(--acid-green)]">MB/S</span></span>
               </div>
            </div>

            <div className="space-y-4 font-mono text-sm">
               <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <div className="flex items-center gap-2"><Download size={16} /> <span>1GB FILE DOWNLOAD</span></div>
                  <span className="text-[var(--acid-green)]">{results.time1GB < 60 ? `${results.time1GB} sec` : `${(results.time1GB/60).toFixed(1)} min`}</span>
               </div>
               <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <div className="flex items-center gap-2"><FileText size={16} /> <span>100MB ASSET LOAD</span></div>
                  <span className="text-[var(--acid-green)]">{results.time100MB} sec</span>
               </div>
               <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <div className="flex items-center gap-2"><Film size={16} /> <span>CONCURRENT HD STREAMS</span></div>
                  <span className="text-[var(--acid-green)]">~{results.hdStreams} SCREENS</span>
               </div>
            </div>

            <div className="mt-8 flex justify-center">
               <button 
                 onClick={resetTest}
                 className="px-6 py-3 border border-[var(--acid-green)] hover:bg-[var(--acid-green)] hover:text-black transition-all font-bold tracking-widest flex items-center gap-2"
                 onMouseEnter={SoundFX.playHover}
               >
                 <RotateCcw size={16} /> RE-CALIBRATE
               </button>
            </div>
         </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4 relative overflow-hidden">
      <div className="relative w-64 h-64 md:w-80 md:h-64 mb-4">
        <svg viewBox="0 0 200 110" className="w-full h-full overflow-visible">
          {Array.from({ length: 21 }).map((_, i) => {
            const rot = (i / 20) * 180 - 90;
            return (
              <line key={i} x1="100" y1="90" x2="100" y2="80" stroke="var(--acid-green)" strokeWidth="2" transform={`rotate(${rot} 100 90)`} className="opacity-50" />
            );
          })}
          <path d="M 10 90 A 90 90 0 0 1 190 90" fill="none" stroke="var(--acid-green)" strokeWidth="2" strokeOpacity="0.2" />
          <path d="M 10 90 A 90 90 0 0 1 190 90" fill="none" stroke={phase === 'UPLOAD' ? '#00ffff' : 'var(--acid-green)'} strokeWidth="4" strokeDasharray="283" strokeDashoffset={283 - (283 * ((angle + 90) / 180))} className="transition-all duration-100 ease-linear" />
          <g transform={`rotate(${angle} 100 90)`} className="gauge-needle">
            <line x1="100" y1="90" x2="100" y2="10" stroke={phase === 'UPLOAD' ? '#00ffff' : 'var(--acid-green)'} strokeWidth="2" />
            <circle cx="100" cy="90" r="4" fill="var(--deep-black)" stroke="var(--acid-green)" strokeWidth="2" />
          </g>
          <text x="100" y="130" textAnchor="middle" fill={phase === 'UPLOAD' ? '#00ffff' : 'var(--acid-green)'} className="font-poster text-4xl">{speed.toFixed(1)}</text>
          <text x="100" y="150" textAnchor="middle" fill={phase === 'UPLOAD' ? '#00ffff' : 'var(--acid-green)'} className="font-mono text-xs opacity-70">MB/S</text>
        </svg>
      </div>

      <div className="w-full max-w-md grid grid-cols-2 gap-4 border-t border-[var(--acid-green)] border-opacity-30 pt-6">
        <div className="flex flex-col items-center p-3 bg-[rgba(212,255,0,0.05)] border border-[var(--acid-green)] border-opacity-20">
          <div className="flex items-center gap-2 mb-1">
            <Wifi size={16} /> <span className="font-poster text-sm">CONN_TYPE</span>
          </div>
          <span className="font-mono text-xl">{connInfo.type}</span>
        </div>
        <div className="flex flex-col items-center p-3 bg-[rgba(212,255,0,0.05)] border border-[var(--acid-green)] border-opacity-20">
          <div className="flex items-center gap-2 mb-1">
            <Activity size={16} /> <span className="font-poster text-sm">LATENCY</span>
          </div>
          <span className="font-mono text-xl">{connInfo.rtt}</span>
        </div>
        <div className="col-span-2 flex justify-center mt-4">
           {!isTesting ? (
             <button onClick={runSpeedTest} className="px-8 py-3 bg-[var(--acid-green)] text-black font-poster tracking-widest hover:scale-105 transition-transform flex items-center gap-2" onMouseEnter={SoundFX.playHover}>
               <Gauge size={20} /> INITIATE_TEST
             </button>
           ) : (
             <div className="flex items-center gap-4 animate-pulse">
                {phase === 'DOWNLOAD' && <span className="text-[var(--acid-green)] flex items-center gap-2"><ArrowDown /> DOWNLOADING...</span>}
                {phase === 'UPLOAD' && <span className="text-cyan-400 flex items-center gap-2"><ArrowUp /> UPLOADING...</span>}
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const UniversalViewer = ({ fileType, fileUrl, fileContent, isSandbox, fileName, iframeRef, textareaRef, isEditing, editorContent, setEditorContent }) => {
  if (isEditing) {
    return (
      <textarea
        ref={textareaRef}
        className="w-full h-full bg-transparent text-[var(--acid-green)] p-4 font-mono text-sm resize-none focus:outline-none"
        value={editorContent}
        onChange={(e) => { setEditorContent(e.target.value); SoundFX.playKeystroke(); }}
        spellCheck="false"
        placeholder="// ENTER CODE HERE..."
      />
    );
  }

  switch (fileType) {
    case 'image': return <div className="w-full h-full flex items-center justify-center bg-black/50 overflow-auto"><img src={fileUrl} alt="Preview" className="max-w-full max-h-full object-contain" /></div>;
    case 'video': return <VideoPlayer src={fileUrl} fileName={fileName} />;
    case 'audio': return <div className="w-full h-full flex items-center justify-center"><VideoPlayer src={fileUrl} fileName={fileName} /></div>; 
    case 'pdf': return <iframe src={fileUrl} className="w-full h-full border-none" title="PDF Preview" />;
    case 'font': return (
         <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center overflow-auto">
            <style>{`@font-face { font-family: 'PreviewFont'; src: url('${fileUrl}'); }`}</style>
            <h2 className="text-4xl mb-8" style={{ fontFamily: 'PreviewFont' }}>The quick brown fox jumps over the lazy dog.</h2>
            <p className="mt-8 font-mono text-xs opacity-50">FONT: {fileName}</p>
         </div>
       );
    case '3d': return (
         <div className="w-full h-full flex flex-col items-center justify-center opacity-80">
            <Box size={64} className="mb-4 animate-spin-slow text-[var(--acid-green)]" />
            <p className="font-poster text-xl mb-2">3D ASSET DETECTED</p>
            <p className="font-mono text-xs">{fileName}</p>
         </div>
       );
    case 'code':
    case 'text': return <iframe ref={iframeRef} title="Preview" className="w-full h-full border-none" sandbox={isSandbox ? "allow-scripts" : "allow-scripts allow-same-origin allow-forms allow-popups allow-modals"} />;
    default: return (
        <div className="w-full h-full flex flex-col items-center justify-center opacity-60">
           <Package size={64} className="mb-4 text-[var(--acid-green)] opacity-50" />
           <p className="font-poster text-xl mb-2">BINARY PREVIEW</p>
           <div className="font-mono text-xs text-left p-4 border border-[var(--acid-green)] bg-black/50 w-64 h-32 overflow-hidden opacity-50">
              0F 2A 4C 99 1B ... <br/> SYSTEM: FILE_RECOGNIZED <br/> TYPE: {fileName?.split('.').pop()?.toUpperCase()}
           </div>
        </div>
      );
  }
};

/* 3. UPLOAD / RUNNER MODULE */
const CodeRunner = ({ files, setFiles, currentFileIndex, setCurrentFileIndex }) => {
  const [editorContent, setEditorContent] = useState('');
  const [isSandbox, setIsSandbox] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const iframeRef = useRef(null);
  const fileInputRef = useRef(null);
  const folderInputRef = useRef(null);
  const textareaRef = useRef(null);

  const currentFile = files[currentFileIndex] || null;

  useEffect(() => {
    const handleNav = (e) => {
       if (isEditing) return;
       // Only trigger nav if not in overview (handled by parent logic typically, but safe here)
       if (e.target.tagName === 'INPUT') return; 
       
       if (e.code === 'ArrowLeft') { setCurrentFileIndex(prev => Math.max(0, prev - 1)); SoundFX.playClick(); }
       if (e.code === 'ArrowRight') { setCurrentFileIndex(prev => Math.min(files.length - 1, prev + 1)); SoundFX.playClick(); }
    };
    window.addEventListener('keydown', handleNav);
    return () => window.removeEventListener('keydown', handleNav);
  }, [files.length, isEditing]);

  const processFiles = (fileList) => {
    const newFiles = Array.from(fileList).map(file => {
      const type = getFileType(file.name);
      const newFile = { file, name: file.name, type, url: URL.createObjectURL(file), content: null };
      if (type === 'code' || type === 'text') {
        const reader = new FileReader();
        reader.onload = (e) => { 
            setFiles(prev => prev.map(f => f === newFile ? { ...f, content: e.target.result } : f));
        };
        reader.readAsText(file);
      }
      return newFile;
    });
    SoundFX.playClick();
    setFiles(prev => [...prev, ...newFiles]);
    if (files.length === 0 && newFiles.length > 0) setCurrentFileIndex(0);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileUpload = (event) => processFiles(event.target.files);

  const selectFile = (index) => {
    SoundFX.playClick();
    setCurrentFileIndex(index);
    setIsEditing(false);
  };

  const removeFile = (e, index) => {
    e.stopPropagation();
    SoundFX.playClick();
    const newFiles = files.filter((_, i) => i !== index);
    if(files[index].url) URL.revokeObjectURL(files[index].url);
    setFiles(newFiles);
    if (currentFileIndex >= newFiles.length) setCurrentFileIndex(Math.max(0, newFiles.length - 1));
  };

  const handleCreateFile = () => {
    SoundFX.playClick();
    const newFile = { file: null, name: 'new_module.js', type: 'code', url: null, content: '' };
    setFiles(prev => [...prev, newFile]);
    setCurrentFileIndex(files.length);
    setIsEditing(true);
    setEditorContent('');
  };

  const handleEdit = () => {
    SoundFX.playClick();
    if (currentFile?.type === 'code') {
       setEditorContent(currentFile.content || '');
       setIsEditing(true);
    }
  };

  const handleSaveCommit = () => {
    SoundFX.playClick();
    const updatedFiles = [...files];
    updatedFiles[currentFileIndex].content = editorContent;
    setFiles(updatedFiles);
    setIsEditing(false);
  };

  const executeCode = () => {
    SoundFX.playClick();
    if (!currentFile || currentFile.type !== 'code' || !iframeRef.current) return;
    let injectedCode = isEditing ? editorContent : currentFile.content;
    const ext = currentFile.name.split('.').pop().toLowerCase();

    if (ext === 'html') {
       const blob = new Blob([injectedCode], { type: 'text/html' });
       iframeRef.current.src = URL.createObjectURL(blob);
    } else if (['js', 'jsx', 'ts'].includes(ext)) {
       const blob = new Blob([`<html><head><script src="https://unpkg.com/@babel/standalone/babel.min.js"></script><style>body{color:#d4ff00;background:#000;font-family:monospace;}</style></head><body><div id="root"></div><script type="text/babel">const originalLog=console.log;console.log=(...a)=>{const d=document.createElement('div');d.innerText='> '+a.join(' ');document.body.appendChild(d);originalLog(...a);};try{${injectedCode}}catch(e){document.body.innerHTML+='<div style="color:red">'+e.message+'</div>'}</script></body></html>`], { type: 'text/html' });
       iframeRef.current.src = URL.createObjectURL(blob);
    } else {
       const blob = new Blob([`<style>body{background:#000;color:#d4ff00;white-space:pre;font-family:monospace;}</style><pre>${injectedCode}</pre>`], { type: 'text/html' });
       iframeRef.current.src = URL.createObjectURL(blob);
    }
  };

  useEffect(() => { if (isEditing && textareaRef.current) textareaRef.current.focus(); }, [isEditing]);

  return (
    <div className="flex flex-col h-full gap-4">
      {/* Viewer Area */}
      <div 
        className="flex-1 flex flex-col border border-[var(--acid-green)] bg-black/40 backdrop-blur-sm p-4 relative overflow-hidden"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <div className="flex justify-between items-center mb-4 border-b border-[var(--acid-green)] border-opacity-30 pb-2">
          <div className="flex items-center gap-2 max-w-[60%]">
             {currentFile ? (
                <>
                   {currentFile.type === 'video' ? <Video size={18} /> : currentFile.type === 'image' ? <ImageIcon size={18} /> : <FileCode size={18} />}
                   <span className="font-poster tracking-wider text-sm truncate">{currentFile.name}</span>
                   {currentFile.type === 'code' && !isEditing && <button onClick={handleEdit} className="ml-2 opacity-50 hover:opacity-100"><Edit size={14} /></button>}
                </>
             ) : <span className="opacity-50 font-mono text-sm">READY_FOR_INPUT</span>}
          </div>
          <div className="flex items-center gap-4">
            {currentFile?.type === 'code' && (
              <div className="flex items-center gap-2 cursor-pointer group" onClick={() => { SoundFX.playClick(); setIsSandbox(!isSandbox); }}>
                <span className={`text-[10px] font-mono transition-colors ${isSandbox ? 'text-[var(--acid-green)]' : 'text-red-500'}`}>
                  {isSandbox ? 'SANDBOX: ACTIVE' : 'SANDBOX: OFF'}
                </span>
                {isSandbox ? <Shield size={14} /> : <ShieldAlert size={14} className="text-red-500 animate-pulse" />}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 relative bg-black/80 border border-[var(--acid-green)] border-opacity-20 mb-4 overflow-hidden">
          {currentFile ? (
             <UniversalViewer 
                fileType={currentFile.type} fileUrl={currentFile.url} fileContent={currentFile.content} isSandbox={isSandbox} fileName={currentFile.name} iframeRef={iframeRef} textareaRef={textareaRef} isEditing={isEditing} editorContent={editorContent} setEditorContent={setEditorContent}
             />
          ) : (
             <div 
               className="absolute inset-0 flex flex-col items-center justify-center opacity-30 cursor-pointer hover:opacity-60 transition-opacity"
               onClick={() => fileInputRef.current?.click()}
             >
                <Disc className="animate-spin-slow mb-4 w-16 h-16" />
                <span className="text-sm tracking-widest font-poster">DROP FILES OR CLICK TO UPLOAD</span>
             </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          {isEditing ? (
             <>
               <button onClick={handleSaveCommit} className="flex-1 border border-[var(--acid-green)] bg-[var(--acid-green)] text-black py-3 text-sm font-bold tracking-widest flex items-center justify-center gap-2 hover:opacity-90 transition-all"><Save size={16} /> COMMIT</button>
               <button onClick={() => { setIsEditing(false); SoundFX.playClick(); }} className="px-6 border border-red-500 text-red-500 hover:bg-red-500 hover:text-black py-3 text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-all"><X size={16} /> CANCEL</button>
             </>
          ) : (
             <>
               <input type="file" multiple ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
               {/* Folder Input - uses specific attribute */}
               <input type="file" ref={folderInputRef} className="hidden" webkitdirectory="" mozdirectory="" directory="" onChange={handleFileUpload} />
               
               <button onClick={handleCreateFile} className="px-4 border border-[var(--acid-green)] hover:bg-[var(--acid-green)] hover:text-black transition-all flex items-center justify-center" title="New File"><FilePlus size={18} /></button>
               <button onClick={() => fileInputRef.current?.click()} className="flex-1 border border-[var(--acid-green)] hover:bg-[var(--acid-green)] hover:text-black py-3 text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-all"><Upload size={16} /> UPLOAD FILE</button>
               <button onClick={() => folderInputRef.current?.click()} className="flex-1 border border-[var(--acid-green)] hover:bg-[var(--acid-green)] hover:text-black py-3 text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-all"><Folder size={16} /> UPLOAD FOLDER</button>
               {currentFile?.type === 'code' && <button onClick={executeCode} className="flex-1 border border-[var(--acid-green)] hover:bg-[var(--acid-green)] hover:text-black py-3 text-sm font-bold tracking-widest flex items-center justify-center gap-2 transition-all"><Play size={16} /> RUN</button>}
             </>
          )}
        </div>
      </div>

      {files.length > 0 && (
        <div className="h-20 border border-[var(--acid-green)] border-opacity-30 bg-black/20 flex flex-col overflow-hidden">
           <div className="px-2 py-1 bg-[var(--acid-green)] bg-opacity-10 text-[10px] font-mono border-b border-[var(--acid-green)] border-opacity-30 flex justify-between items-center">
              <span>ACTIVE DECK ({files.length})</span>
              <div className="flex gap-2"><span className="opacity-50">NAV: ← →</span></div>
           </div>
           <div className="flex-1 overflow-x-auto flex items-center gap-2 p-2 scrollbar-thin">
              {files.map((f, i) => (
                <div key={i} onClick={() => selectFile(i)} className={`flex-shrink-0 px-4 py-2 border border-[var(--acid-green)] cursor-pointer flex items-center gap-2 transition-all group relative ${i === currentFileIndex ? 'bg-[var(--acid-green)] text-black font-bold' : 'bg-black opacity-60 hover:opacity-100'}`}>
                   <span className="text-xs font-mono max-w-[150px] truncate">{f.name}</span>
                   <button onClick={(e) => removeFile(e, i)} className={`hover:text-red-500 ${i === currentFileIndex ? 'text-black' : 'text-[var(--acid-green)]'}`}><X size={12} /></button>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};

/* --- MAIN LAYOUT --- */
const DashboardPage = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [files, setFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const stats = useSystemMonitor();
  const sessionId = useMemo(() => Math.random().toString(36).substr(2, 9).toUpperCase(), []);

  // Handler to switch tabs and open specific file
  const handleFileOpen = (index) => {
    setCurrentFileIndex(index);
    setActiveTab('upload');
    SoundFX.playBoot();
  };

  return (
    <div className="page-transition min-h-screen w-full bg-[#050505] text-[var(--acid-green)] p-2 md:p-12 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-20"><h1 className="text-9xl font-poster text-transparent stroke-text" style={{ WebkitTextStroke: '1px var(--acid-green)' }}>964</h1></div>

      {/* Sidebar / Topbar */}
      <div className="col-span-1 md:col-span-3 border-b md:border-b-0 md:border-r border-[var(--acid-green)] border-dashed pb-4 md:pr-6 flex flex-row md:flex-col h-auto md:h-full justify-between z-20 overflow-x-auto">
        <div className="flex md:block items-center gap-6 md:gap-0 w-full">
          <div className="flex items-center gap-3 mb-0 md:mb-12 cursor-pointer group flex-shrink-0" onClick={() => { SoundFX.playClick(); navigate('home'); }}>
             <div className="w-8 h-8 bg-[var(--acid-green)] flex items-center justify-center text-black font-bold group-hover:rotate-180 transition-transform duration-300"><span className="material-symbols-outlined">←</span></div>
             <h2 className="font-poster text-2xl tracking-tighter hidden md:block">BACK_ROOT</h2>
          </div>
          <nav className="flex md:flex-col gap-4 md:gap-6 w-full overflow-x-auto md:overflow-visible">
            {['Overview', 'Modules', 'Database', 'Upload'].map((item) => (
              <div key={item} onClick={() => { SoundFX.playClick(); setActiveTab(item.toLowerCase()); }} onMouseEnter={SoundFX.playHover} className={`flex items-center gap-4 text-lg cursor-pointer transition-all duration-200 flex-shrink-0 ${activeTab === item.toLowerCase() ? 'opacity-100 md:translate-x-2 border-b-2 md:border-b-0 border-[var(--acid-green)]' : 'opacity-40 hover:opacity-80'}`}>
                <div className={`w-2 h-2 hidden md:block ${activeTab === item.toLowerCase() ? 'bg-[var(--acid-green)]' : 'border border-[var(--acid-green)]'} rotate-45`}></div>
                <span className="uppercase tracking-widest font-bold">{item}</span>
              </div>
            ))}
          </nav>
        </div>
        <div className="hidden md:block opacity-50 text-xs font-mono"><p>USER: GUEST</p><p>SESSION ID: {sessionId}</p></div>
      </div>

      <div className="col-span-1 md:col-span-9 relative z-20 flex flex-col h-[85vh] md:h-auto">
        <header className="border-b border-[var(--acid-green)] pb-4 mb-4 md:mb-8 flex justify-between items-end flex-shrink-0">
          <div><h1 className="text-3xl md:text-5xl font-poster uppercase mb-1">{activeTab}</h1><p className="font-mono text-xs md:text-sm opacity-60">System integration v3.5</p></div>
          <div className="hidden md:flex gap-6">
             <div className="flex flex-col items-center min-w-[60px] relative">
                {stats.cpu > 80 && <><div className="animate-ripple"></div><div className="animate-ripple" style={{ animationDelay: '0.5s' }}></div></>}
                <div className={`flex items-center gap-2 mb-1 ${stats.cpu > 80 ? 'text-alert' : ''}`}><Cpu size={14} className={stats.cpu > 80 ? "animate-pulse" : ""} /><span className="text-xl font-bold font-poster">{stats.cpu}%</span></div>
             </div>
             <div className="flex flex-col items-center min-w-[60px] relative">
                {stats.mem > 80 && <><div className="animate-ripple"></div><div className="animate-ripple" style={{ animationDelay: '0.5s' }}></div></>}
                <div className={`flex items-center gap-2 mb-1 ${stats.mem > 80 ? 'text-alert' : ''}`}><Layers size={14} className={stats.mem > 80 ? "animate-pulse" : ""} /><span className="text-xl font-bold font-poster">{stats.mem}%</span></div>
             </div>
             <div className="flex flex-col items-center min-w-[60px]"><div className="flex items-center gap-2 mb-1"><Radio size={14} className="animate-pulse" /><span className="text-xl font-bold font-poster">{stats.net}</span></div></div>
          </div>
        </header>

        <div className="flex-1 relative min-h-0">
           <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-[var(--acid-green)]"></div>
           <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-[var(--acid-green)]"></div>
           <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-[var(--acid-green)]"></div>
           <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-[var(--acid-green)]"></div>

           {activeTab === 'upload' ? (
             <CodeRunner files={files} setFiles={setFiles} currentFileIndex={currentFileIndex} setCurrentFileIndex={setCurrentFileIndex} />
           ) : activeTab === 'overview' ? (
             <OverviewModule files={files} setFiles={setFiles} onFileOpen={handleFileOpen} />
           ) : activeTab === 'database' ? (
             <NetworkSpeedometer />
           ) : (
             <div className="h-full border border-[var(--acid-green)] border-opacity-30 bg-[rgba(212,255,0,0.02)] p-6 flex flex-col items-center justify-center text-center opacity-60 space-y-6">
                <Disc size={48} className="animate-spin-slow duration-[10s]" />
                <div className="max-w-md"><p className="font-poster text-xl mb-2">MODULE OFFLINE</p><p className="font-mono text-xs leading-relaxed">Access restricted.</p></div>
                <div className="grid grid-cols-3 gap-2 mt-8 w-full max-w-sm opacity-30">{[...Array(9)].map((_, i) => (<div key={i} className="h-1 bg-[var(--acid-green)] rounded-full animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>))}</div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

const HomePage = ({ navigate }) => {
  return (
    <div className="page-transition min-h-screen w-full relative grid grid-cols-12 grid-rows-[auto_1fr_auto] gap-4 p-4 md:p-8 pt-12 overflow-hidden">
      {/* Top Left */}
      <div className="col-span-6 md:col-span-3 flex flex-col items-start space-y-2 z-30 mix-blend-difference">
        <h2 className="font-poster text-5xl md:text-7xl leading-none tracking-tighter opacity-90">1992<span className="text-xl align-top font-jp ml-2">年</span></h2>
        <div className="text-sm md:text-base font-jp opacity-80 leading-relaxed border-l-2 border-[var(--acid-green)] pl-3">
          <p>ロッテルダム映画祭</p>
          <p>出品作品</p>
        </div>
      </div>

      {/* Top Right */}
      <div className="col-span-6 md:col-span-9 flex justify-end items-start relative z-30">
        <div className="flex flex-col items-end">
          <h3 className="font-poster text-xl md:text-2xl tracking-[0.2em] mb-4 text-right">EMETIC POWER</h3>
          <div className="flex gap-4">
            <div className="vertical-text text-xs md:text-sm font-jp opacity-70 h-64 border-r border-[var(--acid-green)] pr-2">鉄ノクズヲ逆ニ無ニ溶カシャ</div>
            <div className="vertical-text text-xs md:text-sm font-jp text-[var(--acid-green)] h-64 font-bold drop-shadow-[0_0_5px_rgba(212,255,0,0.8)]">哀レ御主ハ地獄行キ</div>
             <div className="vertical-text text-xs md:text-sm font-jp opacity-70 h-64 border-l border-[var(--acid-green)] pl-2">生来 生来 生来</div>
          </div>
        </div>
      </div>
      
      {/* Center */}
      <div className="col-span-12 row-start-2 relative flex flex-col items-center justify-center z-20 mt-10 md:mt-0">
         <div 
            className="relative w-full max-w-2xl aspect-[4/5] border border-[var(--acid-green)] p-1 md:p-2 bg-black/50 backdrop-blur-sm group cursor-pointer transition-all duration-500 hover:scale-[1.01] hover:shadow-[0_0_30px_rgba(212,255,0,0.2)]" 
            onClick={() => { SoundFX.playBoot(); navigate('dashboard'); }}
            onMouseEnter={() => SoundFX.playHover()}
         >
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-[var(--acid-green)]"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-[var(--acid-green)]"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-[var(--acid-green)]"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-[var(--acid-green)]"></div>
            
            <HeroImage />

            <div className="absolute bottom-[25%] right-[-10%] md:right-[-5%] text-right bg-black/80 px-4 py-2 transform rotate-[-2deg]">
              <div className="flex items-end justify-end leading-none">
                 <span className="text-6xl md:text-9xl font-poster text-[var(--acid-green)] mr-2">√</span>
                 <span className="text-6xl md:text-9xl font-poster text-[var(--acid-green)] glitch-hover">964</span>
              </div>
            </div>

            <div className="absolute bottom-[10%] left-0 w-full text-center">
              <h1 className="text-6xl md:text-8xl font-poster text-white mix-blend-difference tracking-tighter uppercase transform scale-y-110">
                Pinocchio
              </h1>
            </div>
         </div>
         
         <p className="mt-4 text-[10px] md:text-xs tracking-widest opacity-60 animate-pulse">
            CLICK IMAGE TO ENTER SYSTEM
         </p>
      </div>

      {/* Bottom */}
      <div className="col-span-12 row-start-3 flex flex-col md:flex-row justify-between items-end pb-8 z-30 mix-blend-difference">
         <div className="text-[10px] md:text-xs font-mono max-w-md opacity-70 space-y-1">
            <p>DIRECTED BY SHOZIN FUKUI</p>
            <p className="font-jp">福居ショウジン監督作品</p>
            <div className="h-[1px] w-12 bg-[var(--acid-green)] my-2"></div>
            <p>COPYRIGHT © 1991. ALL RIGHTS RESERVED.</p>
         </div>

         <div className="text-right mt-4 md:mt-0">
            <div className="flex items-center gap-2 justify-end mb-2">
              <span className="w-2 h-2 bg-[var(--acid-green)] rounded-full animate-ping"></span>
              <span className="text-xs font-bold tracking-widest">SYSTEM ONLINE</span>
            </div>
            <p className="text-[10px] font-mono opacity-50">v.2.0.25 [STABLE]</p>
         </div>
      </div>

    </div>
  );
};

const App = () => {
  const [page, setPage] = useState('home');
  return (
    <div className="antialiased min-h-screen min-h-[100dvh] text-[var(--acid-green)] selection:bg-[var(--acid-green)] selection:text-black">
      <div className="noise-overlay"></div>
      <div className="scanlines"></div>
      <main className="relative z-10">
        {page === 'home' && <HomePage navigate={setPage} />}
        {page === 'dashboard' && <DashboardPage navigate={setPage} />}
      </main>
    </div>
  );
};

export default App;
