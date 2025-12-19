import { Preset, Stage, Module } from './types';

export const PRESETS: Preset[] = [
  {
    id: 'word-count',
    name: '词频统计 (Word Count)',
    description: 'Hadoop 的 "Hello World"。统计每个单词出现的次数。',
    data: `Apple Banana Apple
Banana Cherry Apple
Cherry Date Date`
  },
  {
    id: 'sales-agg',
    name: '销售聚合 (Sales Aggregation)',
    description: '按地区汇总销售数据。',
    data: `North 100
South 200
North 150
East 300
South 50`
  }
];

export const MODULE_INFO = {
  [Module.HDFS]: {
    title: 'HDFS (Hadoop Distributed File System)',
    desc: '分布式文件系统，负责将大文件切分成块（Block）并冗余存储在多个节点上，提供高容错性。'
  },
  [Module.MAPREDUCE]: {
    title: 'MapReduce',
    desc: '分布式计算框架。通过 Map（映射）和 Reduce（归约）两个阶段处理海量数据。'
  },
  [Module.YARN]: {
    title: 'YARN (Yet Another Resource Negotiator)',
    desc: '资源管理系统。负责集群资源的统一管理和调度，为运行在 Hadoop 上的应用分配资源。'
  },
  [Module.HBASE]: {
    title: 'HBase',
    desc: '分布式、面向列的 NoSQL 数据库。基于 HDFS 构建，用于支持数十亿行、数百万列的随机实时读写。'
  },
  [Module.HIVE]: {
    title: 'Hive',
    desc: '数据仓库工具。可以将结构化的数据文件映射为一张数据库表，并提供 SQL 查询功能，本质是将 SQL 转换为 MapReduce 任务。'
  }
};

export const STAGE_INFO = {
  [Stage.INPUT]: {
    title: 'Input Data',
    desc: 'Raw data ingestion. In a real cluster, this is typically a large file stored in HDFS.'
  },
  [Stage.SPLIT]: {
    title: 'Splitting',
    desc: 'Input data is split into fixed-size blocks (InputSplits) for parallel processing.'
  },
  [Stage.MAP]: {
    title: 'Mapping',
    desc: 'Mappers parse data and emit <Key, Value> pairs.'
  },
  [Stage.SHUFFLE]: {
    title: 'Shuffling',
    desc: 'System sorts and groups the Mapper outputs by Key, transferring them to Reducers.'
  },
  [Stage.REDUCE]: {
    title: 'Reducing',
    desc: 'Reducers aggregate the list of values for each unique Key.'
  },
  [Stage.OUTPUT]: {
    title: 'Final Output',
    desc: 'The processed results are written back to the storage system (e.g., HDFS).'
  }
};