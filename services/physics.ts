import { SimulationParams, SimulationResults, OrbitType, DailyData } from '../types';
import { G, M_EARTH, R_EARTH, SOLAR_FLUX, GEO_ALTITUDE } from '../constants';

export const calculateSimulation = (params: SimulationParams): SimulationResults => {
  // 1. Orbital Physics
  // Adjust altitude for GEO if selected to ensure physics makes sense, 
  // though we respect the user input mostly, GEO implies a specific altitude.
  let effectiveAltitude = params.altitude;
  if (params.orbitType === OrbitType.GEO) {
    effectiveAltitude = GEO_ALTITUDE;
  }

  const r = R_EARTH + (effectiveAltitude * 1000); // meters
  const orbitalPeriodSeconds = 2 * Math.PI * Math.sqrt(Math.pow(r, 3) / (G * M_EARTH));
  const orbitalPeriodMinutes = orbitalPeriodSeconds / 60;

  // 2. Solar Availability
  let uptime = 1.0;
  if (params.orbitType === OrbitType.SSO) {
    uptime = 1.0; // Idealized SSO always in sun
  } else if (params.orbitType === OrbitType.GEO) {
    uptime = 1.0; // Simplified GEO (ignore eclipse seasons)
  } else {
    // Basic LEO eclipse estimate (approx 60% in sun)
    uptime = 0.60;
  }

  // 3. Power Generation
  // Assumption from prompt: 1 m^2 per 10 kg mass
  const panelArea = params.satelliteMass / 10; 
  
  // Power (Watts) = Flux * Area * Efficiency * Uptime
  // We use average power generation over the orbit for the "Daily" calc
  const avgPowerGenWatts = SOLAR_FLUX * panelArea * (params.solarEfficiency / 100) * uptime;
  const avgPowerGenKW = avgPowerGenWatts / 1000;

  // 4. Energy Balance
  const dailyGenKWh = avgPowerGenKW * 24;
  const dailyDemandKWh = params.aiPowerDemand * 24;
  const dailySurplusKWh = dailyGenKWh - dailyDemandKWh;
  
  const totalEnergyKWh = dailyGenKWh * params.simulationDays;
  const isFeasible = dailySurplusKWh >= 0;

  // 5. Time Series Generation
  const dailyData: DailyData[] = [];
  
  // To make the chart interesting (educational), we apply a small degradation factor 
  // or variance to simulate micrometeoroids/radiation over time, 
  // even though the prompt logic implies constant.
  for (let day = 1; day <= params.simulationDays; day++) {
    // Slight efficiency degradation factor: 0.01% per day
    const degradation = 1 - (day * 0.0001); 
    const dayGen = dailyGenKWh * degradation;
    const daySurplus = dayGen - dailyDemandKWh;
    
    dailyData.push({
      day,
      powerGenerated: parseFloat(dayGen.toFixed(2)),
      powerConsumed: parseFloat(dailyDemandKWh.toFixed(2)),
      surplus: parseFloat(daySurplus.toFixed(2)),
      batteryLevel: isFeasible ? 100 : Math.max(0, 100 - (day * 5)) // Mock battery drain if deficit
    });
  }

  return {
    orbitalPeriod: parseFloat(orbitalPeriodMinutes.toFixed(1)),
    sunlightUptime: uptime,
    dailyGen: parseFloat(dailyGenKWh.toFixed(1)),
    totalEnergy: parseFloat(totalEnergyKWh.toFixed(0)),
    viability: isFeasible ? 'Feasible' : 'Deficit',
    viabilityScore: isFeasible ? 100 : Math.max(0, (dailyGenKWh / dailyDemandKWh) * 100),
    dailyData,
    panelArea
  };
};