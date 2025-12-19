import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Settings2,
  Layout,
  Github,
  Database,
  Server,
  Layers,
  HardDrive,
  FileCode
} from 'lucide-react';
import { Stage, Preset, Module } from './types';
import { PRESETS, STAGE_INFO, MODULE_INFO } from './constants';
import { Visualizer } from './components/Visualizer';

const App: React.FC = () => {
  const [inputData, setInputData] = useState<string>(PRESETS[0].data);
  const [currentModule, setCurrentModule] = useState<Module>(Module.MAPREDUCE);
  const [currentStage, setCurrentStage] = useState<Stage>(Stage.INPUT);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Stages order for MapReduce
  const stageOrder = [
    Stage.INPUT,
    Stage.SPLIT,
    Stage.MAP,
    Stage.SHUFFLE,
    Stage.REDUCE,
    Stage.OUTPUT
  ];

  const currentStageIndex = stageOrder.indexOf(currentStage);

  // Auto-play effect (only for MapReduce)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && currentModule === Module.MAPREDUCE) {
      interval = setInterval(() => {
        if (currentStageIndex < stageOrder.length - 1) {
          setCurrentStage(stageOrder[currentStageIndex + 1]);
        } else {
          setIsPlaying(false);
        }
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStageIndex, currentModule]);

  const handleNext = () => {
    if (currentStageIndex < stageOrder.length - 1) {
      setCurrentStage(stageOrder[currentStageIndex + 1]);
    }
  };

  const handlePrev = () => {
    if (currentStageIndex > 0) {
      setCurrentStage(stageOrder[currentStageIndex - 1]);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStage(Stage.INPUT);
  };

  const handlePresetSelect = (preset: Preset) => {
    setInputData(preset.data);
    handleReset();
  };

  // Switch content based on module
  const isMapReduce = currentModule === Module.MAPREDUCE;
  
  const modulesList = [
    { id: Module.HDFS, label: 'HDFS', icon: HardDrive },
    { id: Module.MAPREDUCE, label: 'MapReduce', icon: Layers },
    { id: Module.YARN, label: 'YARN', icon: Server },
    { id: Module.HBASE, label: 'HBase', icon: Database },
    { id: Module.HIVE, label: 'Hive', icon: FileCode },
  ];

  return (
    <div className="h-screen w-screen bg-white text-zinc-800 font-sans flex flex-col overflow-hidden mesh-bg-light">
      
      {/* NAVBAR */}
      <nav className="h-16 border-b border-zinc-100 bg-white/70 backdrop-blur-md flex items-center justify-between px-6 z-50 fixed w-full top-0">
        <div className="flex items-center gap-3 w-64">
          <div className="w-9 h-9 bg-gradient-to-br from-black to-zinc-700 text-white rounded-xl flex items-center justify-center font-bold shadow-lg shadow-zinc-200">H</div>
          <h1 className="text-lg font-bold tracking-tight text-zinc-800 hidden md:block">Hadoop<span className="text-zinc-400 font-medium">Viz</span></h1>
        </div>

        {/* Module Switcher */}
        <div className="flex items-center bg-zinc-100/80 p-1 rounded-2xl border border-zinc-200/50">
           {modulesList.map((m) => {
             const isActive = currentModule === m.id;
             const Icon = m.icon;
             return (
               <button 
                 key={m.id}
                 onClick={() => { 
                   setCurrentModule(m.id); 
                   setIsPlaying(false);
                 }}
                 className={`
                   relative px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all duration-300
                   ${isActive 
                      ? 'text-black shadow-sm' 
                      : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200/50'
                    }
                 `}
               >
                 {isActive && (
                   <motion.div 
                     layoutId="activeModule"
                     className="absolute inset-0 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.05)] border border-black/5"
                     initial={false}
                     transition={{ type: "spring", stiffness: 300, damping: 30 }}
                   />
                 )}
                 <span className="relative z-10 flex items-center gap-2">
                   <Icon size={16} />
                   <span className="hidden sm:inline">{m.label}</span>
                 </span>
               </button>
             );
           })}
        </div>

        <div className="w-64 flex justify-end">
           <a href="#" className="p-2 rounded-full hover:bg-zinc-100 transition-colors text-zinc-400 hover:text-black">
             <Github size={20} />
           </a>
        </div>
      </nav>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 pt-16 h-full">
        
        {/* SIDEBAR */}
        <aside className="w-80 lg:w-96 bg-white border-r border-zinc-100 flex flex-col z-40 h-full shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
          <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
            
            {/* Contextual Sidebar Content */}
            <div className="mb-8">
               <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                 About {MODULE_INFO[currentModule].title}
               </h2>
               <p className="text-sm text-zinc-500 leading-relaxed bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  {MODULE_INFO[currentModule].desc}
               </p>
            </div>

            {/* Presets & Input - Only relevant if data input is needed (mainly MapReduce, but could be others) */}
            {(isMapReduce || currentModule === Module.HIVE) && (
              <>
                <div className="mb-6">
                   <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Layout size={14} /> Presets
                   </h2>
                   <div className="space-y-3">
                    {PRESETS.map(preset => (
                      <button
                        key={preset.id}
                        onClick={() => handlePresetSelect(preset)}
                        className={`
                          w-full p-4 rounded-2xl text-left transition-all border group relative overflow-hidden
                          ${inputData === preset.data 
                            ? 'bg-zinc-50 border-zinc-200 shadow-sm' 
                            : 'bg-white border-zinc-100 hover:border-zinc-300 hover:shadow-md'
                          }
                        `}
                      >
                        <div className={`absolute top-0 left-0 w-1 h-full bg-black transition-opacity ${inputData === preset.data ? 'opacity-100' : 'opacity-0'}`} />
                        <div className="font-bold text-zinc-800 mb-1 group-hover:text-black">{preset.name}</div>
                        <div className="text-xs text-zinc-500 leading-relaxed truncate">{preset.description}</div>
                      </button>
                    ))}
                   </div>
                </div>

                <div className="mb-6">
                   <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                     <Settings2 size={14} /> Input Data
                   </h2>
                   <div className="relative group">
                    <textarea 
                      value={inputData}
                      onChange={(e) => setInputData(e.target.value)}
                      disabled={!isMapReduce} 
                      className={`
                        w-full h-40 bg-zinc-50 text-sm font-mono p-4 rounded-2xl resize-none outline-none border transition-all text-zinc-600 shadow-inner
                        ${!isMapReduce ? 'opacity-60 cursor-not-allowed border-transparent' : 'border-zinc-200 focus:border-purple-400 focus:bg-white focus:shadow-[0_0_0_4px_rgba(168,85,247,0.1)]'}
                      `}
                      spellCheck={false}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Sidebar Footer Controls - Conditional */}
          {isMapReduce && (
            <div className="p-6 bg-white/80 backdrop-blur border-t border-zinc-100">
               <div className="mb-4">
                  <h3 className="text-lg font-bold text-zinc-900 mb-1">
                    {STAGE_INFO[currentStage].title}
                  </h3>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    {STAGE_INFO[currentStage].desc}
                  </p>
               </div>

               <div className="flex items-center gap-3">
                  <button 
                    onClick={handleReset}
                    className="p-3.5 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-black transition-colors"
                    title="Reset"
                  >
                    <RotateCcw size={18} />
                  </button>
                  
                  <button 
                    onClick={handlePrev}
                    disabled={currentStageIndex === 0}
                    className="p-3.5 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-black disabled:opacity-30 disabled:hover:bg-zinc-100 transition-colors"
                  >
                    <ChevronLeft size={18} />
                  </button>

                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className={`
                      flex-1 h-12 rounded-full font-semibold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-95
                      ${isPlaying 
                        ? 'bg-zinc-100 text-zinc-800' 
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      }
                    `}
                  >
                    {isPlaying ? 'Pause' : 'Auto Play'}
                    {!isPlaying && <Play size={16} fill="currentColor" />}
                  </button>

                  <button 
                    onClick={handleNext}
                    disabled={currentStageIndex === stageOrder.length - 1}
                    className="p-3.5 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 hover:text-black disabled:opacity-30 disabled:hover:bg-zinc-100 transition-colors"
                  >
                     <ChevronRight size={18} />
                  </button>
               </div>
            </div>
          )}
        </aside>

        {/* RIGHT PANEL: VISUALIZATION */}
        <main className="flex-1 relative p-6 lg:p-12 overflow-hidden flex flex-col items-center">
          
          {/* Main Card Container */}
          <div className="w-full max-w-6xl h-full flex flex-col">
             
             {/* Dynamic Sub-header (Stepper) for MapReduce */}
             {isMapReduce && (
                <div className="mb-8 w-full">
                  <div className="flex items-center justify-between mb-2">
                     <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">MapReduce Workflow</h2>
                     <div className="text-5xl font-black text-zinc-100">{currentStageIndex + 1}</div>
                  </div>
                  
                  {/* MapReduce Steps - Horizontal Scroll */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {stageOrder.map((s, idx) => {
                      const isActive = currentStage === s;
                      const isPast = idx < currentStageIndex;
                      return (
                        <div 
                          key={s} 
                          onClick={() => { setIsPlaying(false); setCurrentStage(s); }}
                          className={`
                            px-4 py-2 rounded-full text-xs font-bold cursor-pointer whitespace-nowrap transition-all border
                            ${isActive 
                              ? 'bg-black text-white border-black shadow-lg' 
                              : isPast 
                                ? 'bg-zinc-100 text-zinc-800 border-zinc-200' 
                                : 'bg-white text-zinc-400 border-zinc-100'
                            }
                          `}
                        >
                          {idx + 1}. {STAGE_INFO[s].title}
                        </div>
                      )
                    })}
                  </div>
                </div>
             )}

             {/* Standard Header for Other Modules */}
             {!isMapReduce && (
               <div className="mb-8 flex items-end justify-between w-full">
                  <div>
                     <h2 className="text-3xl font-bold text-zinc-900 tracking-tight mb-2">{MODULE_INFO[currentModule].title}</h2>
                     <p className="text-zinc-500">Interactive Demo</p>
                  </div>
               </div>
             )}

             {/* Visualization Box */}
             <div className="flex-1 relative rounded-[2.5rem] bg-white/40 backdrop-blur-xl border border-white/60 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] overflow-hidden flex flex-col">
                {isMapReduce && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-zinc-100">
                     <motion.div 
                       className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                       initial={{ width: "0%" }}
                       animate={{ width: `${((currentStageIndex + 1) / stageOrder.length) * 100}%` }}
                       transition={{ duration: 0.5 }}
                     />
                  </div>
                )}
                
                <div className="flex-1 overflow-y-auto p-0 lg:p-4 custom-scrollbar relative z-10 flex flex-col">
                    <Visualizer inputData={inputData} stage={currentStage} module={currentModule} />
                </div>
             </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default App;