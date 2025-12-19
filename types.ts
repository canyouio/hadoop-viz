export type KeyValue = {
  key: string;
  value: number;
  id: string; // Unique ID for animation layoutId
};

export type GroupedData = {
  key: string;
  values: KeyValue[];
};

export enum Module {
  HDFS = 'HDFS',
  MAPREDUCE = 'MAPREDUCE',
  YARN = 'YARN',
  HBASE = 'HBASE',
  HIVE = 'HIVE'
}

export enum Stage {
  INPUT = 'INPUT',
  SPLIT = 'SPLIT',
  MAP = 'MAP',
  SHUFFLE = 'SHUFFLE',
  REDUCE = 'REDUCE',
  OUTPUT = 'OUTPUT'
}

export interface Preset {
  id: string;
  name: string;
  data: string;
  description: string;
}