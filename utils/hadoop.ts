import { KeyValue, GroupedData } from '../types';

// Helper to generate IDs
const generateId = (prefix: string, index: number) => `${prefix}-${index}-${Math.random().toString(36).substr(2, 9)}`;

export const processSplit = (input: string): string[] => {
  return input.split('\n').filter(line => line.trim() !== '');
};

export const processMap = (lines: string[], mode: 'word' | 'sales' = 'word'): KeyValue[] => {
  const mapped: KeyValue[] = [];
  lines.forEach((line, lineIdx) => {
    // Basic heuristic to detect if it's "Word Count" or "Sales" (Key Value) format
    const parts = line.trim().split(/\s+/);
    
    // Check if the last part is a number (Sales mode)
    const lastPartIsNumber = !isNaN(Number(parts[parts.length - 1]));
    
    if (lastPartIsNumber && parts.length > 1) {
       // Sales Mode: "Region 100" -> Key: Region, Value: 100
       const value = Number(parts.pop());
       const key = parts.join(' ');
       mapped.push({ key, value, id: generateId(`map-${lineIdx}`, 0) });
    } else {
       // Word Count Mode: "A B A" -> (A,1), (B,1), (A,1)
       parts.forEach((word, wordIdx) => {
         mapped.push({ key: word, value: 1, id: generateId(`map-${lineIdx}`, wordIdx) });
       });
    }
  });
  return mapped;
};

export const processShuffle = (mappedData: KeyValue[]): GroupedData[] => {
  const groups: Record<string, KeyValue[]> = {};
  
  mappedData.forEach(item => {
    if (!groups[item.key]) {
      groups[item.key] = [];
    }
    groups[item.key].push(item);
  });

  return Object.keys(groups)
    .sort() // Sort keys
    .map(key => ({
      key,
      values: groups[key]
    }));
};

export const processReduce = (groupedData: GroupedData[]): KeyValue[] => {
  return groupedData.map((group, idx) => {
    const total = group.values.reduce((sum, item) => sum + item.value, 0);
    return {
      key: group.key,
      value: total,
      id: generateId(`reduce`, idx)
    };
  });
};