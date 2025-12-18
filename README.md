# Space AI Simulator

An interactive web-based simulator designed to model the power requirements and orbital mechanics of space-based AI data centers.

## Overview

As Earth-based data centers consume increasing amounts of energy and require massive cooling infrastructure, "Space Compute" offers a futuristic alternative: access to 24/7 solar power and natural vacuum cooling. This simulator helps visualize the technical feasibility of such missions.

## Core Features

- **Orbital Mechanics Engine**: Real-time calculation of orbital periods and velocity based on altitude.
- **Power System Analysis**: Models solar flux (1366 W/m²), panel area vs. satellite mass, and multi-junction cell efficiency.
- **AI Payload Modeling**: Configure continuous power demand for high-performance compute clusters (GPUs/TPUs).
- **Eclipse Simulations**: Visualizes and calculates energy deficits during Earth's shadow periods for LEO orbits.
- **Viability Scoring**: Determines if a mission configuration is sustainable over long durations.

## Physics & Assumptions

- **Solar Flux**: Standard solar constant of 1366 W/m² used for energy generation calculations.
- **Area Ratio**: Assumes 1m² of solar panel surface area is available for every 10kg of satellite mass.
- **Orbits**:
  - **LEO (Low Earth Orbit)**: 200km - 2,000km. Frequent eclipses.
  - **SSO (Sun-Synchronous)**: Optimized polar orbit for constant sunlight.
  - **GEO (Geostationary)**: ~35,786km. Fixed position relative to Earth.

## How to Use

1. **Select Orbit**: Toggle between SSO, LEO, or GEO to see how sunlight uptime changes.
2. **Adjust Altitude**: Change the distance from Earth to see the effect on the orbital period.
3. **Configure Efficiency**: Modify solar panel tech (Standard 20% vs Advanced 45%).
4. **Set AI Demand**: Input the kilowatt requirement for your space data center.
5. **Analyze Results**: Review the charts to ensure generated energy (blue area) covers the continuous demand (red line).

## Technology Stack

- **React + TypeScript**: Robust frontend architecture.
- **Tailwind CSS**: Modern, responsive styling.
- **Recharts**: High-performance data visualization.
- **Lucide React**: Clean, semantic iconography.

---
*Created for educational purposes to demonstrate the intersection of aerospace engineering and high-performance computing.*