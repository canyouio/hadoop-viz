import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Stage, Module } from '../types';
import { processSplit, processMap, processShuffle, processReduce } from '../utils/hadoop';
import { StageCard } from './StageCard';
import { 
  Database, 
  ArrowDown, 
  Server, 
  HardDrive, 
  Copy, 
  Cpu, 
  Layers, 
  Table, 
  Search, 
  FileCode,
  ArrowRight,
  FileText,
  ArrowLeftRight
} from 'lucide-react';

interface VisualizerProps {
  inputData: string;
  stage: Stage;
  module: Module;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  },
  exit: { opacity: 0 }
};

// --- Sub-components for specific modules ---

const HDFSView = () => {
  const [isUploaded, setIsUploaded] = useState(false);
  
  return (
    <div className="w-full flex flex-col gap-12 items-center p-8">
      <div className="flex gap-8 items-center">
        <motion.div 
          className="bg-white p-6 rounded-2xl shadow-lg border border-zinc-100 w-48 text-center relative z-10"
          animate={isUploaded ? { scale: 0.9, opacity: 0.5 } : {}}
        >
           <FileCode className="w-10 h-10 mx-auto text-blue-500 mb-3" />
           <div className="font-bold text-zinc-800">BigFile.log</div>
           <div className="text-xs text-zinc-400">300 MB</div>
           {!isUploaded && (
             <button 
               onClick={() => setIsUploaded(true)}
               className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition"
             >
               Upload to HDFS
             </button>
           )}
        </motion.div>
        
        {isUploaded && (
          <motion.div 
            initial={{ opacity: 0, width: 0 }} 
            animate={{ opacity: 1, width: 100 }} 
            className="h-1 bg-zinc-200" 
          />
        )}
        
        <motion.div className="bg-zinc-800 p-6 rounded-2xl shadow-xl text-white w-48 text-center relative z-10">
           <Server className="w-10 h-10 mx-auto text-yellow-400 mb-3" />
           <div className="font-bold">NameNode</div>
           <div className="text-xs text-zinc-400">Metadata Manager</div>
        </motion.div>
      </div>

      {isUploaded && (
        <div className="w-full max-w-4xl relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-px border-l-2 border-dashed border-zinc-200 -z-10" />
          
          <div className="grid grid-cols-3 gap-8 mt-8">
            {[1, 2, 3].map((nodeId) => (
              <motion.div 
                key={nodeId}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: nodeId * 0.2 }}
                className="bg-zinc-50 border-2 border-zinc-100 rounded-3xl p-6 relative overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-6 border-b border-zinc-200 pb-3">
                  <HardDrive className="text-zinc-400" />
                  <span className="font-bold text-zinc-700">DataNode 0{nodeId}</span>
                </div>
                
                <div className="space-y-3">
                   {/* Blocks */}
                   <motion.div 
                     initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 + nodeId * 0.1 }}
                     className="bg-blue-100 text-blue-700 p-3 rounded-xl text-xs font-mono flex items-center gap-2"
                   >
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      blk_101 (128MB)
                   </motion.div>
                   {nodeId !== 2 && (
                     <motion.div 
                       initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 + nodeId * 0.1 }}
                       className="bg-purple-100 text-purple-700 p-3 rounded-xl text-xs font-mono flex items-center gap-2"
                     >
                        <div className="w-2 h-2 bg-purple-500 rounded-full" />
                        blk_102 (128MB)
                     </motion.div>
                   )}
                   {nodeId !== 1 && (
                     <motion.div 
                       initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.1 + nodeId * 0.1 }}
                       className="bg-pink-100 text-pink-700 p-3 rounded-xl text-xs font-mono flex items-center gap-2"
                     >
                        <div className="w-2 h-2 bg-pink-500 rounded-full" />
                        blk_103 (44MB)
                     </motion.div>
                   )}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8 text-zinc-400 text-sm">
            <Copy className="inline w-4 h-4 mr-1" /> Data blocks are replicated (default factor: 3)
          </div>
        </div>
      )}
    </div>
  );
};

const YARNView = () => {
  const [jobStatus, setJobStatus] = useState<'IDLE' | 'RUNNING'>('IDLE');

  return (
    <div className="w-full flex flex-col items-center p-8 gap-6">
       <div className="w-full max-w-lg flex justify-between items-center bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
         <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg"><Layers className="text-purple-600" /></div>
            <div>
              <div className="font-bold text-sm">New MapReduce Job</div>
              <div className="text-xs text-zinc-400">Requesting resources...</div>
            </div>
         </div>
         <button 
           onClick={() => setJobStatus(prev => prev === 'IDLE' ? 'RUNNING' : 'IDLE')}
           className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${jobStatus === 'RUNNING' ? 'bg-zinc-200 text-zinc-500' : 'bg-purple-600 text-white hover:bg-purple-700'}`}
         >
           {jobStatus === 'IDLE' ? 'Submit Job' : 'Stop'}
         </button>
       </div>

       <div className="relative w-full max-w-3xl border-2 border-dashed border-zinc-200 rounded-[2rem] p-8 mt-4">
          <div className="absolute -top-4 left-8 bg-white px-3 text-zinc-400 font-bold text-xs uppercase tracking-wider">YARN Cluster</div>
          
          <div className="flex justify-center mb-12">
             <motion.div className="bg-white border-2 border-purple-100 shadow-xl shadow-purple-100 rounded-2xl p-6 flex items-center gap-4 relative z-20">
                <Cpu className="w-8 h-8 text-purple-600" />
                <div>
                   <div className="font-bold text-lg">ResourceManager</div>
                   <div className="text-xs text-zinc-500">Scheduler & Application Manager</div>
                </div>
             </motion.div>
          </div>

          <div className="grid grid-cols-2 gap-8">
             {[1, 2].map(nm => (
               <div key={nm} className="bg-zinc-800 text-zinc-100 rounded-2xl p-6 relative">
                  <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                     <span className="font-bold flex items-center gap-2"><Server size={14} /> NodeManager 0{nm}</span>
                     <span className="text-xs bg-zinc-700 px-2 py-1 rounded text-green-400">Active</span>
                  </div>
                  
                  <div className="h-32 bg-zinc-900/50 rounded-xl p-2 flex flex-wrap content-start gap-2 relative">
                      {jobStatus === 'RUNNING' && (
                        <>
                          {nm === 1 && (
                            <motion.div 
                              initial={{ scale: 0 }} animate={{ scale: 1 }}
                              className="w-full bg-orange-500/20 text-orange-300 border border-orange-500/50 p-2 rounded text-xs font-mono mb-2"
                            >
                              ★ ApplicationMaster
                            </motion.div>
                          )}
                          <motion.div 
                             initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}
                             className="w-12 h-12 bg-blue-500/20 border border-blue-500/50 rounded flex items-center justify-center text-xs"
                          >
                             Cont.
                          </motion.div>
                          <motion.div 
                             initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.8 }}
                             className="w-12 h-12 bg-blue-500/20 border border-blue-500/50 rounded flex items-center justify-center text-xs"
                          >
                             Cont.
                          </motion.div>
                        </>
                      )}
                      {!jobStatus && <div className="absolute inset-0 flex items-center justify-center text-zinc-600 text-xs">Idle Resources</div>}
                  </div>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};

const HBaseView = () => {
  return (
    <div className="w-full h-full flex flex-col items-center p-8">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          <div className="md:col-span-3 flex justify-center gap-6 mb-4">
             <div className="bg-white border border-zinc-200 shadow-sm p-4 rounded-xl flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-bold text-zinc-700">Zookeeper</span>
             </div>
             <div className="bg-white border-2 border-red-100 shadow-lg shadow-red-50 p-4 rounded-xl flex items-center gap-3">
                <Server className="text-red-500" />
                <span className="font-bold text-zinc-700">HMaster</span>
             </div>
          </div>

          <div className="md:col-span-1 space-y-4">
             <div className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                <h4 className="text-xs font-bold text-zinc-400 uppercase mb-3">Client Put</h4>
                <div className="bg-white p-3 rounded border border-zinc-200 text-xs font-mono text-zinc-600">
                   put 'users', 'row1',<br/>
                   'info:name', 'alice'
                </div>
                <div className="flex justify-center my-2">
                   <ArrowDown className="text-zinc-300" />
                </div>
                <div className="text-center text-xs text-zinc-400">
                   Locates RegionServer via META
                </div>
             </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 gap-4">
             {[1, 2].map(rs => (
               <div key={rs} className="bg-white border-2 border-zinc-100 rounded-2xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                 <div className="flex items-center gap-2 mb-4">
                    <Database className="text-zinc-400" size={16} />
                    <span className="font-bold text-sm">RegionServer 0{rs}</span>
                 </div>
                 <div className="space-y-2">
                    <div className="bg-green-50 border border-green-100 p-2 rounded text-xs text-green-800">
                       <span className="font-bold block mb-1">HLog (WAL)</span>
                       <div className="h-1 bg-green-200 rounded-full w-3/4" />
                    </div>
                    <div className="bg-yellow-50 border border-yellow-100 p-2 rounded text-xs text-yellow-800">
                       <span className="font-bold block mb-1">MemStore</span>
                       <div className="h-1 bg-yellow-200 rounded-full w-1/2" />
                    </div>
                    <div className="bg-zinc-100 p-2 rounded text-xs text-zinc-500">
                       <span className="font-bold block mb-1">HFile (on HDFS)</span>
                       <div className="flex gap-1">
                          <div className="w-3 h-3 bg-zinc-300 rounded-sm" />
                          <div className="w-3 h-3 bg-zinc-300 rounded-sm" />
                          <div className="w-3 h-3 bg-zinc-300 rounded-sm" />
                       </div>
                    </div>
                 </div>
               </div>
             ))}
          </div>
       </div>
    </div>
  );
};

const HiveView = () => {
  const [activeTab, setActiveTab] = useState<'MAPPING' | 'EXECUTION'>('MAPPING');
  const [step, setStep] = useState(0);

  const steps = [
    { label: 'SQL', desc: 'SELECT count(*) FROM sales GROUP BY region' },
    { label: 'Driver', desc: 'Parse, Optimize, Compile' },
    { label: 'Execution', desc: 'Convert to MapReduce Job' },
    { label: 'Hadoop', desc: 'Run on Cluster' }
  ];

  const rawData = [
    "101,John Smith,Engineering,85000",
    "102,Jane Doe,Marketing,78000",
    "103,Bob Johnson,Sales,92000"
  ];

  return (
    <div className="w-full flex flex-col items-center p-8 gap-8">
      
      {/* Tab Switcher */}
      <div className="flex bg-zinc-100 p-1 rounded-xl">
        {['MAPPING', 'EXECUTION'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-white shadow text-black' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            {tab === 'MAPPING' ? 'Schema Mapping (Structure on Read)' : 'Query Execution'}
          </button>
        ))}
      </div>

      <div className="w-full max-w-5xl bg-white border border-zinc-100 rounded-[2rem] shadow-xl overflow-hidden min-h-[500px] relative">
         
         {activeTab === 'MAPPING' && (
           <div className="p-8 flex flex-col md:flex-row items-stretch justify-between gap-8 h-full">
              
              {/* Left: Raw File */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4 text-zinc-500 font-bold text-sm uppercase tracking-wider">
                  <FileText size={16} /> HDFS Raw File
                </div>
                <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-6 font-mono text-xs text-zinc-600 flex-1 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-zinc-200 px-2 py-1 text-[10px] rounded-bl-lg">users.csv</div>
                  {rawData.map((line, i) => (
                    <div key={i} className="mb-2 p-2 rounded hover:bg-blue-50 transition-colors cursor-default border border-transparent hover:border-blue-100">
                      {line}
                    </div>
                  ))}
                  <div className="mt-4 text-zinc-400 italic">
                    ... (unstructured text)
                  </div>
                </div>
              </motion.div>

              {/* Middle: Schema / Logic */}
              <div className="flex flex-col items-center justify-center gap-4">
                 <div className="w-px h-full bg-zinc-100 absolute top-0 left-1/2 -translate-x-1/2 hidden md:block -z-10" />
                 <motion.div 
                   initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2 }}
                   className="bg-purple-600 text-white p-4 rounded-2xl shadow-lg z-10 max-w-[200px] text-center"
                 >
                    <div className="font-bold text-sm mb-2">Hive Metastore</div>
                    <div className="text-[10px] bg-purple-700/50 p-2 rounded text-left font-mono leading-relaxed">
                      CREATE TABLE users (<br/>
                        &nbsp;id INT,<br/>
                        &nbsp;name STRING,<br/>
                        &nbsp;dept STRING,<br/>
                        &nbsp;salary INT<br/>
                      )<br/>
                      ROW FORMAT DELIMITED<br/>
                      FIELDS TERMINATED BY ','
                    </div>
                 </motion.div>
                 <ArrowLeftRight className="text-zinc-300 md:hidden" />
              </div>

              {/* Right: Table View */}
              <motion.div 
                 initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
                 className="flex-1 flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4 text-purple-600 font-bold text-sm uppercase tracking-wider">
                  <Table size={16} /> Virtual Table
                </div>
                <div className="bg-white border-2 border-purple-50 rounded-2xl overflow-hidden flex-1 shadow-[0_10px_40px_-10px_rgba(168,85,247,0.1)]">
                   <div className="grid grid-cols-4 bg-purple-50 p-3 text-[10px] font-bold text-purple-900 border-b border-purple-100">
                      <div>ID</div>
                      <div>NAME</div>
                      <div>DEPT</div>
                      <div>SALARY</div>
                   </div>
                   {rawData.map((line, i) => {
                     const cols = line.split(',');
                     return (
                       <motion.div 
                         key={i} 
                         initial={{ opacity: 0, y: 10 }}
                         animate={{ opacity: 1, y: 0 }}
                         transition={{ delay: 0.6 + i * 0.1 }}
                         className="grid grid-cols-4 p-3 text-[10px] text-zinc-600 border-b border-zinc-50 last:border-0 hover:bg-purple-50/30 transition-colors"
                       >
                          <div className="font-mono">{cols[0]}</div>
                          <div>{cols[1]}</div>
                          <div><span className="bg-zinc-100 px-1.5 py-0.5 rounded text-zinc-500">{cols[2]}</span></div>
                          <div className="font-mono text-green-600">${Number(cols[3]).toLocaleString()}</div>
                       </motion.div>
                     );
                   })}
                   {/* Empty rows visualization */}
                   <div className="p-3 opacity-20">
                      <div className="h-2 bg-zinc-100 rounded w-full mb-2"></div>
                      <div className="h-2 bg-zinc-100 rounded w-2/3"></div>
                   </div>
                </div>
              </motion.div>
           </div>
         )}

         {activeTab === 'EXECUTION' && (
           <div className="p-8 h-full flex flex-col justify-center">
              <div className="bg-zinc-50 border-b border-zinc-100 p-4 flex gap-2 absolute top-0 left-0 w-full">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                  <span className="ml-2 text-xs font-mono text-zinc-400">hive-cli</span>
               </div>
              
              <div className="flex justify-between items-center mb-12 relative mt-12">
                 <div className="absolute top-1/2 left-0 w-full h-1 bg-zinc-100 -z-10" />
                 {steps.map((s, i) => (
                    <motion.div 
                      key={i}
                      className={`relative flex flex-col items-center gap-3 cursor-pointer`}
                      onClick={() => setStep(i)}
                      animate={{ scale: step === i ? 1.1 : 1, opacity: step >= i ? 1 : 0.5 }}
                    >
                       <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors ${step >= i ? 'bg-yellow-400 text-black' : 'bg-white text-zinc-300 border border-zinc-200'}`}>
                          {i === 0 && <Search size={20} />}
                          {i === 1 && <Cpu size={20} />}
                          {i === 2 && <FileCode size={20} />}
                          {i === 3 && <Server size={20} />}
                       </div>
                       <div className="text-center bg-white px-2">
                          <div className="font-bold text-sm">{s.label}</div>
                       </div>
                    </motion.div>
                 ))}
              </div>

              <div className="bg-zinc-900 rounded-xl p-6 text-zinc-100 font-mono text-sm min-h-[160px] flex items-center justify-center">
                 <AnimatePresence mode="wait">
                   <motion.div
                     key={step}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -10 }}
                     className="text-center"
                   >
                      <p className="text-lg mb-2 text-yellow-400">{steps[step].desc}</p>
                      {step === 0 && <span className="text-zinc-500">Wait for input...</span>}
                      {step === 1 && <span className="text-zinc-500">Generating Abstract Syntax Tree...</span>}
                      {step === 2 && <span className="text-zinc-500">Map: scan table<br/>Reduce: count aggregation</span>}
                      {step === 3 && <span className="text-zinc-500">Submitted to YARN...</span>}
                   </motion.div>
                 </AnimatePresence>
              </div>
              
              <div className="flex justify-center mt-6">
                <button 
                  onClick={() => setStep(prev => (prev + 1) % 4)}
                  className="flex items-center gap-2 px-6 py-3 bg-zinc-100 hover:bg-zinc-200 rounded-full font-bold text-zinc-700 transition"
                >
                  Next Step <ArrowRight size={16} />
                </button>
              </div>
           </div>
         )}
      </div>
    </div>
  );
};


// --- Main Visualizer Component ---

export const Visualizer: React.FC<VisualizerProps> = ({ inputData, stage, module }) => {
  
  // Memoize data processing for MapReduce
  const splits = useMemo(() => processSplit(inputData), [inputData]);
  const mapped = useMemo(() => processMap(splits), [splits]);
  const shuffled = useMemo(() => processShuffle(mapped), [mapped]);
  const reduced = useMemo(() => processReduce(shuffled), [shuffled]);

  // Render logic based on Module
  if (module === Module.HDFS) return <HDFSView />;
  if (module === Module.YARN) return <YARNView />;
  if (module === Module.HBASE) return <HBaseView />;
  if (module === Module.HIVE) return <HiveView />;

  // MapReduce Render Logic (Existing)
  const renderMapReduceContent = () => {
    switch (stage) {
      case Stage.INPUT:
        return (
          <div className="w-full h-full flex flex-col items-center justify-center p-8">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               className="text-center max-w-lg bg-white/60 backdrop-blur-xl p-10 rounded-3xl border border-white shadow-[0_20px_50px_rgba(8,112,184,0.1)]"
             >
                <div className="mx-auto w-24 h-24 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/30 transform rotate-3">
                   <Database className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-3xl font-bold text-zinc-900 mb-4 tracking-tight">Raw Input Data</h3>
                <p className="text-zinc-500 leading-relaxed mb-8">
                  The starting point. Data is read from HDFS and prepared for the MapReduce job.<br/>
                  <span className="text-sm opacity-70">Click "Auto Play" to start the process.</span>
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-100 text-zinc-400 text-sm">
                   <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                   System Ready
                </div>
             </motion.div>
          </div>
        );

      case Stage.SPLIT:
        return (
          <div className="w-full">
            <div className="mb-6 flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold">Step 1</span>
              <h4 className="text-zinc-400 font-medium">Input Splits</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {splits.map((line, i) => (
                <StageCard 
                  key={`split-${i}`} 
                  label={`Split Block #${i + 1}`} 
                  subtext={line} 
                  delay={i}
                />
              ))}
            </div>
          </div>
        );

      case Stage.MAP:
        return (
          <div className="w-full">
             <div className="mb-6 flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-600 text-xs font-bold">Step 2</span>
              <h4 className="text-zinc-400 font-medium">Map Output (Key-Value Pairs)</h4>
            </div>
            <div className="flex flex-wrap gap-4 justify-start content-start">
              {mapped.map((item, i) => (
                <StageCard 
                  key={item.id}
                  label={item.key}
                  value={item.value}
                  subtext="<Key, Value>"
                  delay={i}
                  highlight
                />
              ))}
            </div>
          </div>
        );

      case Stage.SHUFFLE:
        return (
          <div className="w-full">
            <div className="mb-6 flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-600 text-xs font-bold">Step 3</span>
              <h4 className="text-zinc-400 font-medium">Shuffling & Sorting</h4>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
              {shuffled.map((group, i) => (
                <motion.div 
                  key={group.key}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1, ease: "easeOut" }}
                  className="bg-white/80 backdrop-blur border border-zinc-100 rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.05)] flex flex-col gap-4 hover:shadow-xl transition-shadow"
                >
                  <div className="flex items-center gap-3 border-b border-dashed border-zinc-200 pb-3">
                    <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-500">
                      <ArrowDown size={14} />
                    </div>
                    <div>
                      <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider block">Key</span>
                      <span className="font-bold text-xl text-zinc-800">{group.key}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {group.values.map((val, idx) => (
                      <div key={val.id} className="flex justify-between bg-zinc-50/50 p-2.5 rounded-xl border border-zinc-100 text-sm">
                          <span className="text-zinc-400">Value</span>
                          <span className="font-bold text-purple-600 bg-purple-50 px-2 rounded-md">{val.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case Stage.REDUCE:
        return (
          <div className="w-full">
            <div className="mb-6 flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-bold">Step 4</span>
              <h4 className="text-zinc-400 font-medium">Reducing</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
              {reduced.map((item, i) => (
                <StageCard 
                  key={item.id}
                  label={item.key}
                  value={item.value}
                  subtext="Result"
                  delay={i}
                  highlight
                />
              ))}
            </div>
          </div>
        );
        
      case Stage.OUTPUT:
        return (
           <div className="w-full h-full flex flex-col items-center justify-center">
             <motion.div 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               className="w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] border border-zinc-100"
             >
                <div className="bg-zinc-50/80 px-6 py-4 border-b border-zinc-100 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                     <div className="flex gap-2 mr-4">
                       <div className="w-3 h-3 rounded-full bg-red-400" />
                       <div className="w-3 h-3 rounded-full bg-yellow-400" />
                       <div className="w-3 h-3 rounded-full bg-green-400" />
                     </div>
                     <span className="text-xs font-mono text-zinc-400">/user/hadoop/output/part-r-00000</span>
                   </div>
                   <div className="text-xs font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full">Success</div>
                </div>
                <div className="p-8 space-y-2 bg-white">
                  {reduced.map((item, idx) => (
                    <motion.div 
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-center gap-6 p-3 rounded-xl hover:bg-zinc-50 transition-colors border-b border-zinc-50 last:border-0"
                    >
                      <span className="text-purple-600 font-bold w-32 shrink-0">{item.key}</span>
                      <span className="text-zinc-600 font-mono">{item.value}</span>
                    </motion.div>
                  ))}
                </div>
             </motion.div>
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="mt-8 text-zinc-400 text-sm"
             >
                End of Demo
             </motion.div>
           </div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stage}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full h-full flex flex-col items-center justify-start py-4 overflow-y-auto"
      >
        {renderMapReduceContent()}
      </motion.div>
    </AnimatePresence>
  );
};