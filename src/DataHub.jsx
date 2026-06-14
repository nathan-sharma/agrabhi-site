import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import logo from "/blogo.png";

export default function DataHub() {
  const [connected, setConnected] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [logs, setLogs] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((v) => !v);

  const [piIp, setPiIp] = useState("67.67.67.67");
  
  // --- Optimization Engine States ---
  const [optimalPoint, setOptimalPoint] = useState(null);
  const [optimalLoading, setOptimalLoading] = useState(false);
  const [meanVariance, setMeanVariance] = useState(null);
  
  // --- Added Backend State Tracker Only ---
  const [batteryLife, setBatteryLife] = useState(100.0);

  // --- Swarm Optimization State Tracking Hooks ---
  const [swarmAssignments, setSwarmAssignments] = useState(null);
  const [swarmLoading, setSwarmLoading] = useState(false);
  const [swarmSyncLoading, setSwarmSyncLoading] = useState(false);
  const [acquisitionAlpha, setAcquisitionAlpha] = useState(0.8);
const [alphaSyncLoading, setAlphaSyncLoading] = useState(false);

  // --- Swarm Local Manual Configuration Control Mirror ---
  const [swarmInputs, setSwarmInputs] = useState({
    "Rover_1": { lat: "0", lon: "0", battery: "100.0" },
    "Rover_2": { lat: "0", lon: "0", battery: "100.0" },
    "Rover_3": { lat: "0", lon: "0", battery: "100.0" },
    "Rover_4": { lat: "0", lon: "0", battery: "100.0" },
    "Rover_5": { lat: "0", lon: "0", battery: "100.0" }
  });

  const [independentBatteries, setIndependentBatteries] = useState({
  "Rover_1": 100.0,
  "Rover_2": 100.0,
  "Rover_3": 100.0,
  "Rover_4": 100.0,
  "Rover_5": 100.0
});
  // --- Kriging Single Point Query States ---
  const [queryLat, setQueryLat] = useState("");
  const [queryLon, setQueryLon] = useState("");
  const [predictedMoisture, setPredictedMoisture] = useState(null);
   const [variance, setVariance] = useState(null);
  const [predictLoading, setPredictLoading] = useState(false);

  const piIpRef = useRef(piIp);
  useEffect(() => {
    piIpRef.current = piIp;
  }, [piIp]);

  const baseURL = `http://${piIp}:5000`;

  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);
  const [variogramModel, setVariogramModel] = useState("gaussian");
  const [variogramSyncLoading, setVariogramSyncLoading] = useState(false);

 useEffect(() => {
  // If the map HTML container element doesn't exist yet, wait
  if (!mapRef.current) return;
  // If Leaflet has already attached to it, do not rebuild it (prevents dual-initialization crash)
  if (leafletMap.current) return;

  // 1. Build the map container right away
  leafletMap.current = L.map(mapRef.current).setView([51.91677159446089, -1.5372346136493975], 16); // Center on your actual farm field coordinates instead of [0,0] ocean!

  // 2. Bind the tile asset layers
  L.tileLayer(
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    { attribution: "Tiles © Esri" }
  ).addTo(leafletMap.current);

  // 3. CRITICAL: Force Leaflet to re-calculate container size limits 
  setTimeout(() => {
    if (leafletMap.current) {
      leafletMap.current.invalidateSize();
    }
  }, 250);

}, []); // Run exactly once on page component mount

function getHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Distance in meters
}

  function drawMarker(point) {
    if (!leafletMap.current) return;

    const [ID, lat, lon, depth, moist, temp] = point;
    if (lat === 0 && lon === 0) return;

    const marker = L.circleMarker([lat, lon], {
      radius: 8,
      fillColor:
        moist > 20
          ? "#0000ff"
          : moist > 15
          ? "#0077ff"
          : moist > 10
          ? "#00ccff"
          : "#ff4400",
      color: "#fff",
      weight: 1,
      fillOpacity: 0.8,
    })
      .addTo(leafletMap.current)
      .bindPopup(`Sample ${ID}<br>Depth: ${depth} cm<br>Moisture: ${moist}%<br>Temp: ${temp}°C`);

    markersRef.current.push(marker);

    const group = L.featureGroup(markersRef.current);
    leafletMap.current.fitBounds(group.getBounds(), {
      padding: [50, 50],
      maxZoom: 18,
    });
  }

  function addLog(message, type = "info") {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [{ time, message, type }, ...prev]);
  }

  async function connectToPi() {
    setStatusMsg("Connecting...");
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(`${baseURL}/get_latest_point`, {
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (res.ok) {
        setConnected(true);
        addLog("Connected successfully!", "success");
        setStatusMsg("Connected!");
      } else {
        throw new Error();
      }
    } catch {
      setConnected(false);
      addLog("Unable to connect", "error");
      setStatusMsg(
        "Failed to connect. Is the IP address right?"
      );
    }
  }

  // --- Dynamic Form Input State Handler ---
  const handleInputChange = (roverId, field, value) => {
    setSwarmInputs((prev) => ({
      ...prev,
      [roverId]: {
        ...prev[roverId],
        [field]: value,
      },
    }));
  };
  // --- Push Form Updates across Tailscale Link to Pi Network Registry ---
 // --- Push Form Updates across Tailscale Link to Pi Network Registry ---
async function syncVariogramToBackend(chosenModel) {
  setVariogramSyncLoading(true);
  addLog(`Changing mathematical variogram profile to ${chosenModel}...`, "info");
  
  try {
    const res = await fetch(`${baseURL}/update_variogram`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: chosenModel }),
    });

    const data = await res.json();

    if (data.status === "success") {
      addLog(`Backend matrix model successfully switched to ${data.current_model}!`, "success");
      setVariogramModel(data.current_model);
    } else {
      addLog(`Variogram Error: ${data.message}`, "warn");
    }
  } catch (err) {
    console.error("Variogram Sync Error:", err);
    addLog("Failed to update variogram.", "error");
  } finally {
    setVariogramSyncLoading(false);
  }
}

 async function syncAlphaToBackend(value) {
  setAlphaSyncLoading(true);
  addLog(`Synchronizing acquisition alpha (${value}) to backend...`, "info");
  
  try {
    const res = await fetch(`${baseURL}/update_alpha`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ alpha: parseFloat(value) }),
    });

    const data = await res.json();

    if (data.status === "success") {
      addLog(`Backend acquisition alpha successfully updated to ${data.current_alpha}!`, "success");
      setAcquisitionAlpha(data.current_alpha);
    } else {
      addLog(`Alpha Sync Warning: ${data.message}`, "warn");
    }
  } catch (err) {
    console.error("Alpha Sync Error:", err);
    addLog("Failed to update Alpha.", "error");
  } finally {
    setAlphaSyncLoading(false);
  }
}

  async function syncSwarmPositionsToBackend() {
    setSwarmSyncLoading(true);
    addLog("Synchronizing swarm GPS coordinates to backend...", "info");
    
    try {
      const payload = { swarm_data: {} };
      
      Object.entries(swarmInputs).forEach(([roverId, values]) => {
        // Force conversion to clean floats, falling back to 0.0 if empty or invalid
        const cleanLat = parseFloat(values.lat);
        const cleanLon = parseFloat(values.lon);
        const cleanBattery = parseFloat(values.battery);

        payload.swarm_data[roverId] = {
          lat: isNaN(cleanLat) ? 0.0 : cleanLat,
          lon: isNaN(cleanLon) ? 0.0 : cleanLon,
          battery: isNaN(cleanBattery) ? 100.0 : cleanBattery
        };
      });

      // Log the payload locally in your browser console so you can see exactly what is being sent
      console.log("Sending payload to backend:", payload);

      const res = await fetch(`${baseURL}/update_swarm_positions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.status === "success") {
        addLog("Backend swarm position variables updated successfully!", "success");
        // Update the local input fields to match what the server acknowledged
        const acknowledgedInputs = {};
        Object.entries(data.current_state).forEach(([rId, rVals]) => {
          acknowledgedInputs[rId] = {
            lat: rVals.lat.toString(),
            lon: rVals.lon.toString(),
            battery: rVals.battery.toString()
          };
        });
        setSwarmInputs(acknowledgedInputs);
      } else {
        addLog(`Sync Warning: ${data.message}`, "warn");
      }
    } catch (err) {
      console.error("Sync Error:", err);
      addLog("Failed to update", "error");
    } finally {
      setSwarmSyncLoading(false);
    }
  }
  // --- Push Form Updates across Tailscale Link to Pi Network Registry ---
  

  async function logData(force = false) {
    const targetDepth = prompt("Enter depth in centimeters:", "0");
    if (targetDepth === null) {
      addLog("Logging cancelled by user.", "warn");
      return;
    }

    let targetURL = `${baseURL}/log?depth=${encodeURIComponent(targetDepth)}`;
    if (force) {
      targetURL += "&override=true";
    }

    addLog(force ? `Force logging profile at ${targetDepth}cm...` : `Logging at ${targetDepth}cm deep...`);

    try {
      const res = await fetch(targetURL);
      const data = await res.json();

      if (data.status === "warning") return addLog(data.message, "warn");
      if (data.status === "error") return addLog(data.message, "error");

      addLog(`Logged Sample ${data.new_point[0]} [Depth: ${targetDepth}cm]`, "success");
      drawMarker(data.new_point);
    } catch {
      addLog("Log failed", "error");
    }
  }

  async function collect() {
    addLog("Trying to get sensor info...");
    try {
      const res = await fetch(`${baseURL}/collect`);
      const data = await res.json();
      addLog(
        `READOUT: Lat ${data.lat}, Lon ${data.lon} | Moisture ${data.moisture}% | Temp ${data.temperature}°C`,
        "info"
      );
    } catch {
      addLog("Sensor read failed", "error");
    }
  }

 
  async function handleCalculateSwarmOptimal() {
    setSwarmLoading(true);
    addLog("Calculating best positions for the rovers", "info");
    try {
      
      const specsRes = await fetch(`${baseURL}/get_system_specs`);
      const specsData = await specsRes.json();
      const fleet = specsData.specs.swarm_fleet_status;
       const res = await fetch(`${baseURL}/swarm_optimal_point`); 
      const data = await res.json();
      
      if (data.status === "success") {
        addLog("Got raw target points. Optimizing assignments...", "info");
        if (data.mean_kriging_variance !== undefined) {
          setMeanVariance(data.mean_kriging_variance);
        }

        // Extract current coordinates
   const rovers = Object.entries(fleet).map(([roverId, values]) => ({
  id: roverId,
  lat: values.lat,  // Pulls the 27.59... numbers straight from server.py
  lon: values.lon,
}));

        // Extract backend targets
        const targets = Object.values(data.swarm_assignments).map((target) => ({
          target_lat: target.target_lat,
          target_lon: target.target_lon,
          predicted_moisture: target.predicted_moisture,
          remaining_battery: target.remaining_battery,
          
        }));

        const finalAssignments = {};
        const assignedTargets = new Set();
        const updatedBatteries = { ...independentBatteries };

        // Pair match closest unassigned coordinates
        rovers.forEach((rover) => {
          let bestTargetIdx = -1;
          let minDistance = Infinity;

          targets.forEach((target, idx) => {
            if (assignedTargets.has(idx)) return;

            const dist = getHaversineDistance(
              rover.lat,
              rover.lon,
              target.target_lat,
              target.target_lon
            );

            if (dist < minDistance) {
              minDistance = dist;
              bestTargetIdx = idx;
            }
          });
 
          if (bestTargetIdx !== -1) {
            assignedTargets.add(bestTargetIdx);
            const matchedTarget = targets[bestTargetIdx];
            const currentBat = independentBatteries[rover.id];
    const decay = (100 * minDistance) / 4590;
    const nextBat = Math.max(0, currentBat - decay);
    
    // 3. Save it to our local tracking container
    updatedBatteries[rover.id] = nextBat;
            
            // WE ARE EXPLICITLY SAVING THE POINT NUMBER (1-5) HERE
            finalAssignments[rover.id] = {
              target_lat: matchedTarget.target_lat,
              target_lon: matchedTarget.target_lon,
              predicted_moisture: matchedTarget.predicted_moisture,
              remaining_battery: matchedTarget.remaining_battery,
              point_number: bestTargetIdx + 1, 
              distance: minDistance,
              tracked_battery: nextBat.toFixed(1)
            };
          }
        });
       setIndependentBatteries(updatedBatteries);
        setSwarmAssignments(finalAssignments);
        addLog("Rover assignments updated successfully!", "success");
        
        // Sync back up into manual text inputs automatically
        const freshInputs = { ...swarmInputs };
        Object.entries(finalAssignments).forEach(([roverId, assignedData]) => {
          freshInputs[roverId] = {
            lat: assignedData.target_lat.toFixed(5),
            lon: assignedData.target_lon.toFixed(5),
            battery: assignedData.remaining_battery.toString()
          };
        });
        setSwarmInputs(freshInputs);

      } else {
        setSwarmAssignments(null);
        addLog(`Swarm Engine Error: ${data.message}`, "warn");
      }
    } catch (err) {
      setSwarmAssignments(null);
      addLog("Could not calculate new rover positions.", "error");
    } finally {
      setSwarmLoading(false);
    }
  }

 

  async function downloadLogs() {
    try {
      const res = await fetch(`${baseURL}/view_logs`);
      if (!res.ok) throw new Error("Failed download");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "data.csv";
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      addLog("Failed to download logs", "error");
    }
  }

  async function clearLogs() {
    if (!confirm("Are you sure you want to clear all logs? This cannot be undone.")) return;
    try {
      const res = await fetch(`${baseURL}/clear_logs`);
      const text = await res.text();
      addLog(text, "success");
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      setOptimalPoint(null); 
    } catch {
      addLog("Couldn't clear logs", "error");
    }
  }

  async function handlePredictManualPoint() {
    if (!queryLat || !queryLon) {
      alert("Please enter both a valid Latitude and Longitude coordinate.");
      return;
    }
    
    setPredictLoading(true);
    setPredictedMoisture(null);
    setVariance(null);
    addLog(`Trying to predict at 5 cm at (${queryLat}, ${queryLon})...`, "info");

    try {
      const res = await fetch(`${baseURL}/predict_point`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lat: parseFloat(queryLat),
          lon: parseFloat(queryLon)
        }),
      });
      const data = await res.json();

      if (data.status === "success") {
        setPredictedMoisture(data.predicted_moisture_pct);
        setVariance(data.variance);
        addLog(`Successfully estimated moisture: ${data.predicted_moisture_pct}% at 5cm depth slice!`, "success");
      } else {
        addLog(`Engine Error: ${data.message}`, "warn");
        alert(`Prediction Error: ${data.message}`);
      }
    } catch {
      addLog("Couldn't predict moisture", "error");
    } finally {
      setPredictLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-[#1a1a1a] text-[#eee] p-5 font-sans pt-20">
      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D1117]/80 backdrop-blur-md border-b border-slate-800">
            <div className="max-w-full mx-auto px-6 h-16 flex items-center justify-between">
              
              {/* Logo Link */}
              <div className="flex items-center text-xl font-bold tracking-tighter text-white">
                <img src={logo} alt="AgraBhi Logo" className="h-6 w-auto translate-y-[1px]" />
                <div>
                  <a 
                    href="https://nathan-sharma.github.io/agrabhi-site" 
                    onClick={(e) => { e.preventDefault(); window.location.href = "https://nathan-sharma.github.io/agrabhi-site"; }}
                    className="cursor-pointer"
                  >
                    Agra<span className="text-emerald-400">Bhi</span>
                  </a>
                </div>
              </div>
        
              {/* Desktop Nav Links */}
              <div className="hidden md:flex items-center gap-8">
                <a 
                  href="https://nathan-sharma.github.io/agrabhi-site" 
                  onClick={(e) => { e.preventDefault(); window.location.href = "https://nathan-sharma.github.io/agrabhi-site"; }}
                  className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  Home
                </a>
        
               
        
                <a 
                  href="https://nathan-sharma.github.io/agrabhi-site/updates.html" 
                  onClick={(e) => { e.preventDefault(); window.location.href = "https://nathan-sharma.github.io/agrabhi-site/updates.html"; }}
                  className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
                >
                 Project Updates
                </a>
         <a 
                  href="https://nathan-sharma.github.io/agrabhi-site/about.html" 
                  onClick={(e) => { e.preventDefault(); window.location.href = "https://nathan-sharma.github.io/agrabhi-site/about.html"; }}
                  className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  Our Team
                </a>
                <a 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  href="https://github.com/nathan-sharma/AgraBhi" 
                  className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  GitHub
                </a>
                   
                <a 
                  href="https://nathan-sharma.github.io/agrabhi-site/data-hub.html" 
                  onClick={(e) => { e.preventDefault(); window.location.href = "https://nathan-sharma.github.io/agrabhi-site/data-hub.html"; }}
                  className="text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full bg-blue-500 text-[#0D1117] hover:bg-blue-400 transition-all"
                >
                  Data Hub
                </a>
              </div>
        
              {/* Mobile Menu Toggle Button */}
              <button 
                onClick={toggleMenu}
                className="md:hidden text-slate-400 hover:text-white focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  )}
                </svg>
              </button>
            </div>
        
            {/* Mobile Nav Links */}
            {isMenuOpen && (
              <div className="md:hidden bg-[#0D1117] border-b border-slate-800 px-6 py-4 flex flex-col gap-4">
                <a 
                  href="https://nathan-sharma.github.io/agrabhi-site" 
                  onClick={(e) => { e.preventDefault(); toggleMenu(); window.location.href = "https://nathan-sharma.github.io/agrabhi-site"; }}
                  className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  Home
                </a>
                
                
                
                
                <a 
                  href="https://nathan-sharma.github.io/agrabhi-site/updates.html" 
                  onClick={(e) => { e.preventDefault(); toggleMenu(); window.location.href = "https://nathan-sharma.github.io/agrabhi-site/updates.html"; }}
                  className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
                >
                 Project Updates
                </a>
    
                <a 
                  href="https://nathan-sharma.github.io/agrabhi-site/about.html" 
                  onClick={(e) => { e.preventDefault(); toggleMenu(); window.location.href = "https://nathan-sharma.github.io/agrabhi-site/about.html"; }}
                  className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  Our Team
                </a>
        
                
        
                <a 
                  href="https://github.com/nathan-sharma/AgraBhi" 
                  onClick={toggleMenu}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  GitHub
                </a>
                <a 
                  href="https://drive.google.com/file/d/1TR2aueFCylzw7Rai_YTZquHvooWqFICa/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Poster
                </a>
        <a 
                  href="https://nathan-sharma.github.io/agrabhi-site/data-hub.html" 
                  onClick={(e) => { e.preventDefault(); toggleMenu(); window.location.href = "https://nathan-sharma.github.io/agrabhi-site/data-hub.html"; }}
                  className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
                >
                  Data Hub
                </a>
              </div>
            )}
          </nav>
      {/* INFO */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-3 text-white">AgraBhi Data Hub</h2>
        <p className="text-sm text-gray-300">We will be using this page to collect our project data on farm fields.</p>
      </div>

      {/* CONNECT */}
      <div className="mb-6 flex flex-row items-center gap-4 flex-wrap">
  {!connected && (
    <button className="bg-[#444] px-3 py-2" onClick={connectToPi}>
      Connect to pi
    </button>
  )}
  
  <button 
    className="bg-[#444] px-3 py-2" 
    onClick={() => {
      const newIp = prompt("Enter Pi Tailscale IP address:", piIp);
      if (newIp) { setPiIp(newIp); setConnected(false); setStatusMsg(""); }
    }}
  >
    Edit IP Address
  </button>
  
  
  
  {statusMsg && (
    <p className="text-sm text-yellow-400 whitespace-nowrap">{statusMsg}</p>
  )}
</div>
   

      {/* CONTROL ACTIONS */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button className="bg-[#444] px-3 py-2" onClick={collect}>Read sensors</button>
        <button className="bg-[#4169E1] px-3 py-2" onClick={() => logData(false)}>Log</button>
        
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2" onClick={handleCalculateSwarmOptimal} disabled={swarmLoading}>
          {swarmLoading ? "Calculating..." : "New rover positions"}
        </button>
       
        <button className="bg-[#444] px-3 py-2" onClick={downloadLogs}>Download all logs</button>
        <button className="bg-[#e63946] px-3 py-2" onClick={clearLogs}>ERASE ALL LOGS</button>
      </div>

      {/* METRICS & LOG DISPLAY SLOTS */}
      {optimalPoint && (
        <div className="mb-6 p-4 text-sm max-w-2xl bg-[#222] rounded border border-gray-800">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-gray-300">
            <p><span className="text-gray-500">Latitude:</span> {optimalPoint.best_lat.toFixed(7)}</p>
            <p><span className="text-gray-500">Longitude:</span> {optimalPoint.best_lon.toFixed(7)}</p>
            <p><span className="text-gray-500">Predicted Moisture at 5 cm:</span> {optimalPoint.predicted_moisture.toFixed(2)}%</p>
          </div>
        </div>
      )}

<p className="text-xs text-yellow-500 mb-2">
  {meanVariance !== null ? `Mean Kriging Variance: ${meanVariance.toFixed(6)}` : ""}
</p>
   {/* Change the first block to sort by point_number so they show up sequentially (1, 2, 3, 4, 5) */}
{swarmAssignments && (
  <div className="mb-6 max-w-4xl mt-6">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {Object.entries(swarmAssignments)
        .sort((a, b) => a[1].point_number - b[1].point_number) // <-- Sort by actual target sequence
        .map(([roverId, data]) => (
          <div key={roverId} className="p-3 bg-black text-xs flex flex-col gap-1 text-gray-300">
            <p className="font-bold text-white border-b border-slate-800 pb-1 mb-1">
              Position {data.point_number} {/* <-- Show true Position number */}
            </p>
            <p><span className="text-gray-500">Lat:</span> {data.target_lat.toFixed(5)}</p>
            <p><span className="text-gray-500">Lon:</span> {data.target_lon.toFixed(5)}</p>
            <p><span className="text-gray-500">Est Moist:</span> {data.predicted_moisture.toFixed(1)}%</p>
            <p className="text-xs text-cyan-400">Assigned to: {roverId.replace("_", " ")}</p>
          </div>
        ))}
    </div>
  </div>
)}

{swarmAssignments && (
        <div className="mb-6 max-w-4xl mt-6">
          <h3 className="text-sm font-bold uppercase tracking-wider mb-3">Rovers:</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(swarmAssignments).map(([roverId, data]) => (
              <div key={roverId} className="p-4 bg-black border border-slate-800 rounded flex flex-col gap-1 text-gray-300">
                {/* Visual Header */}
                <p className="font-bold text-white border-b border-slate-800 pb-1 mb-1 text-xs">
                  {roverId.replace("_", " ")}
                </p>
                
                {/* Assignment Output */}
                <p className="text-xs text-center">
                  Position {data.point_number}
                </p>
<p className="mb-1 text-xs text-center">
           Distance: {data.distance ? `${data.distance.toFixed(1)} m` : "0 m"}
          </p>
                {/* Battery Status Monitoring */}
                
                <p className="text-[11px] text-center"><span className="text-gray-500">Target Lat:</span> {data.target_lat.toFixed(5)}</p>
                <p className="text-[11px] text-center"><span className="text-gray-500">Target Lon:</span> {data.target_lon.toFixed(5)}</p>
                <p className="text-[11px] text-center"><span className="text-gray-500">Est Moist:</span> {data.predicted_moisture.toFixed(1)}%</p>
                <p className="text-[11px] text-center">
              <span className="text-gray-500">Battery:</span> {data.tracked_battery}%
</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* SWARM COORDINATE MANAGEMENT PANEL */}
<div className="my-6">
  <p className="text-xs text-gray-400 mb-6">
If you want to keep track of battery life to make sure it doesn't reach 0 while you're sampling, update each rover's location after you collect measurements there.
  </p>

  <div className="space-y-4">
    {Object.keys(swarmInputs).map((roverId) => (
      <div key={roverId} className="flex flex-col md:flex-row gap-4 items-start md:items-center ">
        <span className="text-sm font-semibold text-white min-w-[80px]">{roverId}</span>
        
        {/* Latitude Input Field */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs text-gray-400">Lat:</label>
          <input
            type="number"
            step="0.00001"
            className="bg-[#333] border border-slate-600 rounded px-2 py-1 text-sm text-white w-full md:w-36 focus:outline-none focus:border-emerald-500"
            value={swarmInputs[roverId].lat}
            onChange={(e) => handleInputChange(roverId, "lat", e.target.value)}
          />
        </div>

        {/* Longitude Input Field */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <label className="text-xs text-gray-400">Lon:</label>
          <input
            type="number"
            step="0.00001"
            className="bg-[#333] border border-slate-600 rounded px-2 py-1 text-sm text-white w-full md:w-36 focus:outline-none focus:border-emerald-500"
            value={swarmInputs[roverId].lon}
            onChange={(e) => handleInputChange(roverId, "lon", e.target.value)}
          />
        </div>
      </div>
    ))}
  </div>

  {/* Execution Trigger Button */}
  <div className="mt-6">
    <button
      onClick={syncSwarmPositionsToBackend}
      disabled={swarmSyncLoading}
      className={`px-6 py-2.5 bg-black text-white rounded text-sm tracking-wide transition-all ${
        swarmSyncLoading 
          ? "text-black" 
          : "hover:text-gray-500"
      }`}
    >
      {swarmSyncLoading ? "Pushing to Server..." : "Update"}
    </button>
  </div>
</div>
<div>
  <label className="text-slate-500 mb-1.5">
   Alpha
  </label>
  
  <div className="flex gap-3 items-center">
    <div className="relative flex-1 max-w-[180px]">
      <input
        type="number"
        min="0.0"
        max="1.0"
        step="0.01"
        value={acquisitionAlpha}
        onChange={(e) => setAcquisitionAlpha(e.target.value)}
        placeholder="0.8"
        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm"
      />
   
    </div>
    
    <button
      onClick={() => {
        const val = parseFloat(acquisitionAlpha);
        if (isNaN(val) || val < 0.0 || val > 1.0) {
          alert("Please enter a decimal value between 0.0 and 1.0");
          return;
        }
        syncAlphaToBackend(acquisitionAlpha);
      }}
      disabled={alphaSyncLoading}
      className="px-6 py-2.5 bg-black text-white rounded text-sm tracking-wide transition-all"
    >
      {alphaSyncLoading ? "Syncing..." : "Update"}
    </button>
  </div>
  
  <p className="text-[11px] text-slate-500 mt-2 leading-relaxed mb-2">
    a = 0.2 + 0.6*(current mean kriging variance/initial mean kriging variance)
  </p>
</div>
<div>
    <label className="text-slate-500 mb-1.5">
      Variogram
    </label>
    <div className="flex gap-3 items-center mb-4">
      <select
        value={variogramModel}
        onChange={(e) => syncVariogramToBackend(e.target.value)}
        disabled={variogramSyncLoading}
        className="px-6 py-2.5 bg-black text-white rounded text-sm tracking-wide transition-all"
      >
        <option value="gaussian">Gaussian</option>
        <option value="exponential">Exponential</option>
        <option value="spherical">Spherical</option>
        <option value="linear">Linear</option>
      </select>
      

    </div>
  </div>
      <h3 className="text-xl mb-2">Messages:</h3>
      <div className="bg-black text-green-400 p-3 h-[200px] overflow-y-scroll border border-[#333] font-mono mb-6">
        {logs.map((log, i) => (
          <div key={i} className={log.type === "error" ? "text-red-400" : log.type === "warn" ? "text-yellow-400" : log.type === "success" ? "text-green-400" : "text-blue-400"}>
            [{log.time}] {log.message}
          </div>
        ))}
      </div>

      
       {/*<div className="mb-6 rounded max-w-2xl">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Latitude</label>
            <input type="number" step="0.000001" value={queryLat} onChange={(e) => setQueryLat(e.target.value)} placeholder="e.g. 27.59425" className="bg-[#111] border border-[#444] rounded p-2 text-white text-sm focus:outline-none" />
          </div>
          <div className="flex flex-col gap-1 flex-1 min-w-[150px]">
            <label className="text-xs text-gray-400 uppercase tracking-wider">Longitude</label>
            <input type="number" step="0.000001" value={queryLon} onChange={(e) => setQueryLon(e.target.value)} placeholder="e.g. -97.89432" className="bg-[#111] border border-[#444] rounded p-2 text-white text-sm focus:outline-none" />
          </div>
          <button className="bg-gray-400 hover:bg-gray-700 text-white  px-4 py-2 text-sm " onClick={handlePredictManualPoint} disabled={predictLoading}>
            {predictLoading ? "Processing..." : "OK"}
          </button>
        </div>
        {predictedMoisture !== null && (
          <div className="mt-4 p-3 bg-[#111] border border-emerald-900 rounded text-center">
            <p className="text-gray-400 text-xs uppercase tracking-widest">Calculated Root Moisture Target</p>
     <p className="text-2xl font-black text-emerald-400 mt-1">{predictedMoisture}%</p>
      <p className="text-2xl font-black text-emerald-400 mt-1">{variance}</p>
          </div>
        )}
      </div> */}

      {/* MAP FIELD LAYER */}
      <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
        <div ref={mapRef} className="w-full h-[400px] border border-[#333] rounded" />
      </div>
    </div>
  );
}