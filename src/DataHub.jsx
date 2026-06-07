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
  
  // --- Added Backend State Tracker Only ---
  const [batteryLife, setBatteryLife] = useState(100.0);

  // --- Swarm Optimization State Tracking Hooks ---
  const [swarmAssignments, setSwarmAssignments] = useState(null);
  const [swarmLoading, setSwarmLoading] = useState(false);
  const [swarmSyncLoading, setSwarmSyncLoading] = useState(false);

  // --- Swarm Local Manual Configuration Control Mirror ---
  const [swarmInputs, setSwarmInputs] = useState({
    "Rover_1": { lat: "27.59413", lon: "-97.89429", battery: "100.0" },
    "Rover_2": { lat: "27.59415", lon: "-97.89435", battery: "100.0" },
    "Rover_3": { lat: "27.59418", lon: "-97.89440", battery: "100.0" },
    "Rover_4": { lat: "27.59420", lon: "-97.89445", battery: "100.0" },
    "Rover_5": { lat: "27.59422", lon: "-97.89450", battery: "100.0" }
  });

  // --- Kriging Single Point Query States ---
  const [queryLat, setQueryLat] = useState("");
  const [queryLon, setQueryLon] = useState("");
  const [predictedMoisture, setPredictedMoisture] = useState(null);
  const [predictLoading, setPredictLoading] = useState(false);

  const piIpRef = useRef(piIp);
  useEffect(() => {
    piIpRef.current = piIp;
  }, [piIp]);

  const baseURL = `http://${piIp}:5000`;

  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);

 useEffect(() => {
  // If the map HTML container element doesn't exist yet, wait
  if (!mapRef.current) return;
  // If Leaflet has already attached to it, do not rebuild it (prevents dual-initialization crash)
  if (leafletMap.current) return;

  // 1. Build the map container right away
  leafletMap.current = L.map(mapRef.current).setView([27.59413, -97.89429], 16); // Center on your actual farm field coordinates instead of [0,0] ocean!

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
  const handleSyncSwarmPositions = async () => {
    setSwarmSyncLoading(true);
    addLog("Pushing rover data...", "info");
    try {
      const res = await fetch(`${baseURL}/update_swarm_positions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ swarm_data: swarmInputs }),
      });
      const data = await res.json();
      if (data.status === "success") {
        addLog("Updated rover info!", "success");
        alert("Updated rover info successfully!");
      } else {
        addLog(`Server Rejected Manual Input Payload: ${data.message}`, "error");
      }
    } catch {
      addLog("Couldn't push that data", "error");
    } finally {
      setSwarmSyncLoading(false);
    }
  };

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

  async function handleCalculateOptimal() {
    setOptimalLoading(true);
    addLog("Calculating the best point", "info");
    try {
      const res = await fetch(`${baseURL}/optimal_point`);
      const data = await res.json();
      
      if (data.status === "success") {
        setOptimalPoint(data.optimal_point);
        addLog(`Found the best point!`, "success");
      } else {
        setOptimalPoint(null);
        addLog(`Engine Rejected: ${data.message}`, "warn");
        alert(`Cannot calculate optimal point: ${data.message}`);
      }
    } catch (err) {
      setOptimalPoint(null);
      addLog("Failed to communicate with calculation engine server.", "error");
    } finally {
      setOptimalLoading(false);
    }
  }

  async function handleCalculateSwarmOptimal() {
    setSwarmLoading(true);
    addLog("Calculating best positions for all rovers", "info");
    try {
      const res = await fetch(`${baseURL}/swarm_optimal_point`);
      const data = await res.json();
      
      if (data.status === "success") {
        setSwarmAssignments(data.swarm_assignments);
        addLog("Got new rover positions!", "success");
        
        // Feed calculated updates back into input fields so forms always reflect reality
        const freshInputs = { ...swarmInputs };
        Object.entries(data.swarm_assignments).forEach(([roverId, assignedData]) => {
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
        alert(`Swarm calculation rejected: ${data.message}`);
      }
    } catch (err) {
      setSwarmAssignments(null);
      addLog("Could not calculate new rover positions. ", "error");
    } finally {
      setSwarmLoading(false);
    }
  }

  async function handleUpdateBattery() {
    const coordsInput = prompt("Enter target coordinates to move the Pi to (Format: Latitude, Longitude):", "27.59422, -97.89437");
    if (!coordsInput) return;

    const parts = coordsInput.split(",");
    if (parts.length !== 2) {
      alert("Invalid format! Please enter values split cleanly by a comma.");
      return;
    }

    const lat = parts[0].trim();
    const lon = parts[1].trim();

    addLog(`Calculating dynamic route depletion adjustments to target location...`, "info");
    try {
      const res = await fetch(`${baseURL}/update_battery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lon }),
      });
      const data = await res.json();

      if (data.status === "success") {
        setBatteryLife(data.current_battery);
        addLog(`Rover moved ${data.distance_moved_m}m. Subtracted ${data.battery_lost_pct}% battery. Remaining: ${data.current_battery}%`, "success");
        
        if (swarmAssignments) {
          const updatedSwarm = { ...swarmAssignments };
          Object.keys(updatedSwarm).forEach((roverId) => {
            if (updatedSwarm[roverId].remaining_battery !== undefined) {
              updatedSwarm[roverId].remaining_battery = updatedSwarm[roverId].remaining_battery;
            }
          });
          setSwarmAssignments(updatedSwarm);
          addLog("All active swarm fleet units synchronized to updated state calculations.", "info");
        }
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch {
      addLog("Failed to update battery array stats on the server.", "error");
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
          <div className="flex items-center text-xl font-bold tracking-tighter text-white">
            <img src={logo} alt="AgraBhi Logo" className="h-6 w-auto translate-y-[1px] mr-2" />
            <div>
              <a href="https://agrabhi.com" className="cursor-pointer">
                Agra<span className="text-emerald-400">Bhi</span>
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="https://agrabhi.com" className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors">Home</a>
            <a href="https://agrabhi.com/about.html" className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors">Our Team</a>
            <a href="https://agrabhi.com/updates.html" className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors">Updates</a>
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/nathan-sharma/AgraBhi" className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors">GitHub</a>
            <a href="https://agrabhi.com/data-hub.html" className="text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full bg-blue-500 text-[#0D1117] hover:bg-blue-400 transition-all">Data Hub</a>
          </div>
        </div>
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
  
  <button 
    onClick={handleSyncSwarmPositions}
    disabled={swarmSyncLoading}
    className="bg-[#444] px-3 py-2 disabled:opacity-50"
  >
    {swarmSyncLoading ? "Pushing Changes..." : "Push rover info to Pi"}
  </button>
  
  {statusMsg && (
    <p className="text-sm text-yellow-400 whitespace-nowrap">{statusMsg}</p>
  )}
</div>
      {/* MANUAL ENTRY PANEL */}
      <div className="mb-8 p-4  max-w-4xl">
      
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {Object.entries(swarmInputs).map(([roverId, values]) => (
            <div key={roverId} className="p-3 bg-[#111] rounded border border-slate-800 flex flex-col gap-2">
              <label className="font-bold text-xs text-white block border-b border-slate-800 pb-1">{roverId.replace("_", " ")}</label>
              <div>
                <span className="text-[10px] text-gray-500 block uppercase">Lat</span>
                <input 
                  type="number" 
                  step="0.00001" 
                  value={values.lat} 
                  onChange={(e) => handleInputChange(roverId, "lat", e.target.value)}
                  className="bg-[#222] text-white border border-[#444] p-1 text-xs w-full rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block uppercase">Lon</span>
                <input 
                  type="number" 
                  step="0.00001" 
                  value={values.lon} 
                  onChange={(e) => handleInputChange(roverId, "lon", e.target.value)}
                  className="bg-[#222] text-white border border-[#444] p-1 text-xs w-full rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <span className="text-[10px] text-gray-500 block uppercase">Battery (%)</span>
                <input 
                  type="number" 
                  step="1" 
                  value={values.battery} 
                  onChange={(e) => handleInputChange(roverId, "battery", e.target.value)}
                  className="bg-[#222] text-white border border-[#444] p-1 text-xs w-full rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          ))}
        </div>
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
            <p><span className="text-gray-500">Acquisition A(x):</span> {optimalPoint.acquisition_value.toFixed(4)}</p>
          </div>
        </div>
      )}

      {swarmAssignments && (
        <div className="mb-6  max-w-4xl mt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {Object.entries(swarmAssignments).map(([roverId, data]) => (
              <div key={roverId} className="p-3 bg-black text-xs flex flex-col gap-1 text-gray-300">
                <p className="font-bold text-white border-b border-slate-800 pb-1 mb-1">{roverId.replace("_", " ")}</p>
                <p><span className="text-gray-500">Lat:</span> {data.target_lat.toFixed(5)}</p>
                <p><span className="text-gray-500">Lon:</span> {data.target_lon.toFixed(5)}</p>
                <p><span className="text-gray-500">Est Moist:</span> {data.predicted_moisture.toFixed(1)}%</p>
                <p><span className="text-gray-500">Distance:</span> {data.distance_m}m</p>
                <p><span> - {data.drain_pct}% Battery</span> </p>
                <p className="mt-1 pt-1 border-t border-slate-800 font-semibold text-emerald-400">
                  <span className="text-gray-500 font-normal">Battery:</span> {data.remaining_battery}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <h3 className="text-xl mb-2">Messages:</h3>
      <div className="bg-black text-green-400 p-3 h-[200px] overflow-y-scroll border border-[#333] font-mono mb-6">
        {logs.map((log, i) => (
          <div key={i} className={log.type === "error" ? "text-red-400" : log.type === "warn" ? "text-yellow-400" : log.type === "success" ? "text-green-400" : "text-blue-400"}>
            [{log.time}] {log.message}
          </div>
        ))}
      </div>

      {/* MANUAL 5CM KRIGING ENGINE PREDICTOR PANEL 
      <div className="mb-6 rounded max-w-2xl">
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