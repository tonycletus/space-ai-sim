export enum OrbitType {
  SSO = 'Sun-synchronous',
  LEO = 'Low Earth Orbit',
  GEO = 'Geostationary'
}

export interface SimulationParams {
  orbitType: OrbitType;
  altitude: number; // km
  solarEfficiency: number; // percentage 0-100
  aiPowerDemand: number; // kW
  satelliteMass: number; // kg
  simulationDays: number; // days
}

export interface DailyData {
  day: number;
  powerGenerated: number; // kWh
  powerConsumed: number; // kWh
  batteryLevel: number; // % (Simulated simple buffer)
  surplus: number; // kWh
}

export interface SimulationResults {
  orbitalPeriod: number; // minutes
  sunlightUptime: number; // percentage 0-1
  dailyGen: number; // kWh
  totalEnergy: number; // kWh
  viability: 'Feasible' | 'Deficit';
  viabilityScore: number; // 0-100
  dailyData: DailyData[];
  panelArea: number; // m^2
}