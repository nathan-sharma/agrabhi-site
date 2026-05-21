import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import logo from "/blogo.png";
import image1 from "/image1.jpg";
import image2 from "/image2.png";
import plot from "/plot.png";
import SimulationComponent from './SimulationComponent';

export default function About() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFullAbstract, setShowFullAbstract] = useState(false);
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E2E8F0] font-sans overflow-x-hidden">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D1117]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-full mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center text-xl font-bold tracking-tighter text-white">
            <img src={logo} alt="AgraBhi Logo" className="h-6 w-auto translate-y-[1px]" />
            <div>
              <Link to="/">Agra<span className="text-emerald-400">Bhi</span></Link>
            </div>
          </div>
          
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors">Home</Link>
            <Link to="/about" className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors">Our Team</Link>
            <Link to="/updates" className="text-xs uppercase tracking-widest font-bold text-emerald-400 hover:text-emerald-500 transition-colors">Updates</Link>
            <a target="_blank" rel="noopener noreferrer" href="https://github.com/nathan-sharma/Agrabhi" className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors">GitHub</a>
            <a target="_blank" rel="noopener noreferrer" href="https://www.gofundme.com/manage/agrabhi-smarter-soil-moisture-for-farmers" className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors">GoFundMe</a>
            <Link to="/data-hub" className="text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full bg-blue-500 text-[#0D1117] hover:bg-blue-400 transition-all">Data Hub</Link>
          </div>

          <button onClick={toggleMenu} className="md:hidden text-slate-400 hover:text-white focus:outline-none">
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
            <a href="https://drive.google.com/file/d/1TR2aueFCylzw7Rai_YTZquHvooWqFICa/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-400 transition-colors">Poster</a>
            <Link to="/about" className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors">Our Team</Link>
            <Link to="/updates" className="text-xs uppercase tracking-widest font-bold text-emerald-400 hover:text-emerald-500 transition-colors">Updates</Link>
            <a href="https://github.com/nathan-sharma/Agrabhi" onClick={toggleMenu} className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500">GitHub</a>
            <a href="https://www.gofundme.com/manage/agrabhi-smarter-soil-moisture-for-farmers" onClick={toggleMenu} className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500">GoFundMe</a>
          </div>
        )}
      </nav>

      <main className="pt-32 px-6 py-10 max-w-6xl mx-auto space-y-16">
        {/* Main wrapper altered to layout the title structure cleanly */}
        <div className="flex flex-col gap-6">
          
          {/* Header Title Section */}
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-white">May</h2>
          </div>

          {/* Grid Layout Container: Heatmap left, Text right */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Heatmap Element - Pinning to top left next to updates list */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="h-[300px] w-full rounded-2xl overflow-hidden border border-slate-700 bg-[#5c4033] shadow-2xl">
                <SimulationComponent />
              </div>
              <p className="mt-3 text-xs text-slate-500 text-center">
                Heatmap might take a few seconds to load.
              </p>
            </div>

            {/* Updates list text column */}
            <div className="md:col-span-7 space-y-4">
              <p className="text-slate-400 leading-relaxed">
                <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mb-[2px]"></span>
                May 11th, 2026: Project research plan and deadlines draft finished. See research plan draft<span> </span>
                <a target="_blank" rel="noopener noreferrer" href="https://docs.google.com/document/d/1VkqSs9pfrUfAJ6HdsIUOUExkudNJI-WOK1dk6pclt1k/edit?usp=sharing" className="underline hover:text-gray-500 ">here.</a>
              </p>
              <p className="flex items-center gap-3 text-slate-400 leading-relaxed">
                <span className="inline-block w-2 h-2 bg-white rounded-full shrink-0"></span>
                May 13th, 2026: Coded and created a 3D regression kriging heatmap on simulated data, got a feel for how 3D maps work.
              </p>
              <p className="flex items-center gap-3 text-slate-400 leading-relaxed">
                <span className="inline-block w-2 h-2 bg-white rounded-full shrink-0"></span>
                May 17th, 2026: Two important ideas were thought of today that we may implement in our project:
              </p>
              <p className="flex items-center gap-3 text-slate-400 leading-relaxed">
            Idea #1: Use Gaussian Process Regression instead of Regression Kriging so we don't have to eyeball the variogram. Uncertainty is also much more adaptable to our data because it optimizes its parameters automatically, while Kriging mostly relies on the fixed sill, nugget, and range.</p>
              <p className="flex items-center gap-3 text-slate-400 leading-relaxed">
               Idea #2: Have the drone create a path to sample at points it thinks will contribute the most information to the heatmap model, while also flying the shortest distance to minimize battery usage. This could be achieved by calculating an acquisition function with a travel cost penalty to sample the most optimal areas as it flies through the field.
              </p>
              <p className="flex items-center gap-3 text-slate-400 leading-relaxed">
                <span className="inline-block w-2 h-2 bg-white rounded-full shrink-0"></span>
                May 18th, 2026: Rover-Drone Hybrid design idea (see video on homepage), bought a better soil sensor.
              </p>
                        <p className="flex items-center gap-3 text-slate-400 leading-relaxed">
                <span className="inline-block w-2 h-2 bg-white rounded-full shrink-0"></span>
                May 20th, 2026: First farm visit for data collection confirmed.
              </p>
            </div>

          </div>
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-[#0D1117] py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-y-2 md:gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-1">
              <img src="blogo.png" alt="Logo" className="h-5 w-auto" />
              <h2 className="text-lg font-bold text-white leading-none">Agra<span className="text-emerald-400">Bhi</span></h2>
            </div>
            <p className="text-xs text-slate-400">Created by <span className="text-slate-200">Nathan Sharma, Naitik Patel, & Evan Quach</span></p>
          </div>
          <div className="flex flex-col md:flex-row gap-x-6 gap-y-0 md:gap-y-1 text-center">
            <a href="mailto:nathansharma007@gmail.com" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">nathansharma007@gmail.com</a>
            <a href="mailto:naitik.s.patel10@gmail.com" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">naitik.s.patel10@gmail.com</a>
            <a href="mailto:quachevan@gmail.com" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">quachevan@gmail.com</a>
          </div>
        </div>
      </footer>
    </div>
  );
}