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

  const piIpRef = useRef(piIp);
  useEffect(() => {
    piIpRef.current = piIp;
  }, [piIp]);

  const baseURL = `http://${piIp}:5000`;

  const mapRef = useRef(null);
  const leafletMap = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!connected) return;
    if (leafletMap.current) return;

    leafletMap.current = L.map(mapRef.current).setView([0, 0], 2);

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      { attribution: "Tiles © Esri" }
    ).addTo(leafletMap.current);
  }, [connected]);

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
        "Failed to connect. Check your IP address and make sure all components are powered on and connected to the internet."
      );
    }
  }

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

    addLog(force ? `Force logging profile at ${targetDepth}cm...` : `Logging profile at ${targetDepth}cm...`);

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
    addLog("Requesting live sensor data...");
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

  // --- Manual Spatial Engine Trigger ---
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
      setOptimalPoint(null); // Clear previous engine targets upon data wipe
    } catch {
      addLog("Failed to clear logs", "error");
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
              <a
                href="https://agrabhi.com"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = "https://agrabhi.com";
                }}
                className="cursor-pointer"
              >
                Agra<span className="text-emerald-400">Bhi</span>
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a
              href="https://agrabhi.com"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "https://agrabhi.com";
              }}
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
            >
              Home
            </a>

            <a
              href="https://agrabhi.com/about.html"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "https://agrabhi.com/about.html";
              }}
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
            >
              Our Team
            </a>

            <a
              href="https://agrabhi.com/updates.html"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "https://agrabhi.com/updates.html";
              }}
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
            >
              Updates
            </a>

            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/nathan-sharma/Agrabhi"
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
            >
              GitHub
            </a>

            <a
              href="https://agrabhi.com/data-hub.html"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "https://agrabhi.com/data-hub.html";
              }}
              className="text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full bg-blue-500 text-[#0D1117] hover:bg-blue-400 transition-all"
            >
              Data Hub
            </a>
          </div>

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

        {isMenuOpen && (
          <div className="md:hidden bg-[#0D1117] border-b border-slate-800 px-6 py-4 flex flex-col gap-4">
            <a
              href="https://agrabhi.com/"
              onClick={(e) => {
                e.preventDefault();
                toggleMenu();
                window.location.href = "https://agrabhi.com/";
              }}
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
            >
              Home
            </a>

            <a
              href="https://agrabhi.com/about.html"
              onClick={(e) => {
                e.preventDefault();
                toggleMenu();
                window.location.href = "https://agrabhi.com/about.html";
              }}
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
            >
              Our Team
            </a>

            <a
              href="https://agrabhi.com/updates.html"
              onClick={(e) => {
                e.preventDefault();
                toggleMenu();
                window.location.href = "https://agrabhi.com/updates.html";
              }}
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
            >
              Updates
            </a>

            <a
              href="https://github.com/nathan-sharma/Agrabhi"
              onClick={toggleMenu}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://agrabhi.com/data-hub.html"
              onClick={(e) => {
                e.preventDefault();
                toggleMenu();
                window.location.href = "https://agrabhi.com/data-hub.html";
              }}
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
        <div className="space-y-2 text-sm text-gray-300 leading-relaxed">
          <p>We will be using this page to collect our project data on the farm fields.</p>
          <div className="mt-2">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://docs.google.com/document/d/1S0mL2VNIkHVH2baN0HFV6N_pfqVgpON1sv6gE_mZ1rs/edit?usp=sharing"
              className="underline hover:text-gray-500"
            >
              Troubleshooting & FAQs coming soon, once we have this ready for everyone else to use!
            </a>
          </div>
        </div>
      </div>

      {/* CONNECT */}
      <div className="mb-6">
        {!connected && (
          <button className="bg-[#444] px-3 py-2 mb-2" onClick={connectToPi}>
            Connect to Rovers
          </button>
        )}

        <div>
          <button
            className="text-sm text-emerald-400 underline"
            onClick={() => {
              const newIp = prompt("Enter Pi Tailscale IP address:", piIp);
              if (newIp) {
                setPiIp(newIp);
                setConnected(false);
                setStatusMsg("");
                setOptimalPoint(null);
              }
            }}
          >
            Edit IP Address 
          </button>
        </div>

        {statusMsg && <p className="text-sm text-yellow-400 mt-2">{statusMsg}</p>}
      </div>

      {/* CONTROL ACTIONS */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button className="bg-[#444] px-3 py-2 mr-2" onClick={collect}>
          Read Sensors
        </button>
        <button className="bg-[#4169E1] px-3 py-2 mr-2" onClick={() => logData(false)}>
          Log Sensor Data
        </button>
        <button className="bg-purple-700 hover:bg-purple-800 text-white font-semibold px-3 py-2 mr-2 transition-colors" onClick={handleCalculateOptimal} disabled={optimalLoading}>
          {optimalLoading ? "Computing Grid..." : "Find Best Point"}
        </button>
        <button className="bg-[#444] px-3 py-2 mr-2" onClick={downloadLogs}>
          Download All Logs
        </button>
        <button className="bg-[#e63946] px-3 py-2 mr-2" onClick={clearLogs}>
          ERASE ALL LOGS
        </button>
      </div>

      {/* TARGET OPTIMIZATION METRICS PANEL */}
      {optimalPoint && (
        <div className="mb-6 p-4 text-sm max-w-2xl ">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-gray-300">
            <p><span className="text-gray-500">Latitude:</span> {optimalPoint.best_lat.toFixed(7)}</p>
            <p><span className="text-gray-500">Longitude:</span> {optimalPoint.best_lon.toFixed(7)}</p>
            <p><span className="text-gray-500">Predicted Moisture at 5 cm:</span> {optimalPoint.predicted_moisture.toFixed(2)}%</p>
            <p><span className="text-gray-500">Acquisition A(x):</span> {optimalPoint.acquisition_value.toFixed(4)}</p>
          </div>
        </div>
      )}

      {/* SYSTEM MESSAGES LOG */}
      <h3 className="text-xl mb-2">Messages:</h3>
      <div className="bg-black text-green-400 p-3 h-[200px] overflow-y-scroll border border-[#333] font-mono mb-6">
        {logs.map((log, i) => (
          <div
            key={i}
            className={
              log.type === "error"
                ? "text-red-400"
                : log.type === "warn"
                ? "text-yellow-400"
                : log.type === "success"
                ? "text-green-400"
                : "text-blue-400"
            }
          >
            [{log.time}] {log.message}
          </div>
        ))}
      </div>

      {/* MAP FIELD LAYER */}
      <div className="flex flex-col md:flex-row gap-4 w-full mb-4">
        <div ref={mapRef} className="w-full h-[400px] border border-[#333] rounded" />
      </div>
    </div>
  );
}