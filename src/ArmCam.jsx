import React, { useState } from "react";
import logo from "/blogo.png";
import image1 from "/image1.jpeg";
import image3 from "/image3.PNG";
import agrilife from "/agrilife.jpg";

export default function About() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E2E8F0] font-sans overflow-x-hidden">
      {/* NAVBAR */}
<nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D1117]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-full mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          {/* Logo Link */}
          <div className="flex items-center text-lg sm:text-xl font-bold tracking-tighter text-white whitespace-nowrap">
           
            <div>
              <a 
                href="https://agrabhi.com" 
                onClick={(e) => { e.preventDefault(); window.location.href = "https://agrabhi.com"; }}
                className="cursor-pointer"
              >
                 <div className="flex items-center justify-center md:justify-start">
              <img src={logo} alt="Logo" className="h-6 w-auto" />
              <h2 className="text-xl font-bold text-white leading-none">
                Agra<span className="text-emerald-400">Bhi</span>
              </h2>
            </div>
              </a>
            </div>
            
            {/* Kept and styled to fit perfectly on mobile screens */}
            <p className="px-2.5 sm:px-3 text-sm sm:text-sm font-normal text-slate-400">in collaboration with</p>
            <img src={agrilife} alt="AgriLife Logo" className="h-8 sm:h-9 w-auto translate-y-[1px]" />
          </div>
    
          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            
    <a 
               href="https://agrabhi.com" 
               onClick={(e) => { e.preventDefault(); window.location.href = "https://agrabhi.com"; }}
               className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
             >
              Home
             </a>

                  <a 
              href="https://agrabhi.com/armcam.html" 
              onClick={(e) => { e.preventDefault(); window.location.href = "https://agrabhi.com/armcam.html"; }}
              className="text-sm tracking-widest font-bold text-emerald-400 hover:text-emerald-500 transition-colors"
            >
              ArmCam
            </a>
            <a 
              href="https://agrabhi.com/updates.html" 
              onClick={(e) => { e.preventDefault(); window.location.href = "https://agrabhi.com/updates.html"; }}
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
            >
             Project Updates
            </a>
            
            <a 
              href="https://agrabhi.com/about.html" 
              onClick={(e) => { e.preventDefault(); window.location.href = "https://agrabhi.com/about.html"; }}
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
            >
              About Us
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
              href="https://agrabhi.com/dashboard.html"
              onClick={(e) => {
                e.preventDefault();
                window.location.href = "https://agrabhi.com/dashboard.html";
              }}
             className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
             >
              Dashboard
            </a>
          </div>
    
          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={toggleMenu}
            className="md:hidden text-slate-400 hover:text-white focus:outline-none ml-2"
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
               href="https://agrabhi.com" 
               onClick={(e) => { e.preventDefault(); window.location.href = "https://agrabhi.com"; }}
               className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
             >
              Home
             </a>
                              <a 
              href="https://agrabhi.com/armcam.html" 
              onClick={(e) => { e.preventDefault(); toggleMenu(); window.location.href = "https://agrabhi.com/armcam.html"; }}
              className="text-sm tracking-widest font-bold text-emerald-400 hover:text-emerald-500 transition-colors"
            >
              ArmCam
            </a>
            <a 
              href="https://agrabhi.com/updates.html" 
              onClick={(e) => { e.preventDefault(); toggleMenu(); window.location.href = "https://agrabhi.com/updates.html"; }}
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
            >
               Project Updates
            </a>

            <a 
              href="https://agrabhi.com/about.html" 
              onClick={(e) => { e.preventDefault(); toggleMenu(); window.location.href = "https://agrabhi.com/about.html"; }}
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
            >
              About Us
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
              onClick={toggleMenu}
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-400 transition-colors"
            >
              Old Poster
            </a>
            
            <a 
              href="https://agrabhi.com/dashboard.html" 
              onClick={(e) => { e.preventDefault(); toggleMenu(); window.location.href = "https://agrabhi.com/dashboard.html"; }}
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
            >
              Dashboard
            </a>
          </div>
        )}
      </nav>

      {/* PAGE CONTENT */}
{/* PAGE CONTENT */}
<main className="pt-24 md:pt-32 px-6 md:py-8 py-4 max-w-6xl mx-auto space-y-8 md:space-y-16">
  <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4">
                Overview
              </h2>  
<p className="text-slate-400 leading-relaxed">
   AgraBhi ArmCam allows AgraBhi to be helpful for the entire growing season. This new subproject was founded in August 2026 by Landon Morrison.

   ArmCam is a version of AgraBhi with a robotic arm containing a camera mounted to the rover in place of the penetration tower. It will use a YOLO image detection model to count cotton bolls (this data will also be used to validate AgriLife's digital twin predictions) and detect signs of potential disease on cotton crops.


 This page will be updated as we continue to make progress on ArmCam. Our first parts for this should be arriving by August 29th, 2026.
       </p>

     

</main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 bg-[#0D1117] py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-y-2 md:gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-1">
              <img src={logo} alt="Logo" className="h-5 w-auto" />
              <h2 className="text-lg font-bold text-white leading-none">
                Agra<span className="text-emerald-400">Bhi</span>
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Created by <span className="text-slate-200">Nathan Sharma & Landon Morrison</span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-x-6 gap-y-0 md:gap-y-1 text-center">
            <a
              href="mailto:nathansharma007@gmail.com"
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              nathansharma007@gmail.com
            </a>

            <a
              href="mailto:morrisonlandon51@gmail.com"
              className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              morrisonlandon51@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}