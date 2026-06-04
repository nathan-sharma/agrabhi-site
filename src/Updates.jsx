import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "/blogo.png";
import api from "/api.png";
import map from "/3dslices.png"
import funct from "/acquisitionfunction.png"
import formula from "/formula.png"
// Structured array containing your timeline data across 2026 and 2027
const MONTHS_DATA = [
  {
    name: "May",
    year: "2026",
    content: (
      <div className="space-y-4 mb-8">
         
        <p className="text-slate-400 leading-relaxed">
          <p className="text-slate-400 leading-relaxed">
          <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mb-[2px]"></span>
          May 31st, 2026: Finished coding the 3D Ordinary Kriging heatmap. The idea is we take multiple slices at specific depths and then analyze each of those 2d heatmaps individually. Check out the full code on the github!
          </p>

 <img
         
    src={map}
    alt="Placeholder 1"
    className="md:w-[50%] md:h-relative h-full w-relative mb-4 mt-4"
  />
   <p className="text-slate-400 leading-relaxed mb-4">
          <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mb-[2px]"></span>
          May 29th, 2026: GPR is extremely complicated and hard for us to code ourselves. Additionally, our farm field will likely not have proper sprinkler heads, so irrigation proximity becomes difficult to use as a covariate. Satellite data is outdated by weeks (the photo above shows data from May 13th), so it can't be used reliably either. We think the best way to move forward is to switch our model to 3D Ordinary Kriging. There are examples online, it doesn't need covariates so it is simpler to code, and it will still be much better than multispectral imagery for getting moisture data beneath the canopy to use for irrigation.
          </p>

            <p className="text-slate-400 leading-relaxed">
          <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mb-[2px]"></span>
          May 24th, 2026: Final copy of research plan finished. See it <span> </span> 
            <a target="_blank" rel="noopener noreferrer" href="https://docs.google.com/document/d/1VkqSs9pfrUfAJ6HdsIUOUExkudNJI-WOK1dk6pclt1k/edit?usp=sharing" className="underline hover:text-gray-500 ">here.</a>
          </p>
 <p className="text-slate-400 leading-relaxed mb-4">
          <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mb-[2px]"></span>
          May 24th, 2026: Pre drilling holes can cause the sensor we are using to give us faulty moisture measurements because of air pockets. We created a design that fixes this issue that could be used on the rovers after they pre-drill a hole into the ground (short video is shown below). The rover would drill a hole, then insert a hollow cylinder tube with a soil sensor and motors inside of it to sample at multiple depths without needing to worry about air pockets affecting results. The video below uses linear actuators to demonstrate our idea.
         </p>
         
          <div className="md:w-[30%] w-[70%] rounded-xl mb-4 overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl transition-all duration-300 hover:border-slate-700/80">
      <video 
        src="droneidea2.mp4" 
        controls 
        muted
        preload="metadata"
        className="w-full h-auto aspect-video object-cover block"
      >
        Your browser does not support the video tag.
      </video>
    </div>
   <p className="text-slate-400 leading-relaxed mb-4">
          <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mb-[2px]"></span>
          May 23rd, 2026: Idea to switch the project from a drone  to a swarm of five rovers that can communicate with one another. Rovers will be autonomous and will still adaptively sample the field. Each rover would cost approximately $400 for a total cost of $2000. The data and math are still the same, we're just changing the way data is being collected.
          </p>
          <p className="text-slate-400 leading-relaxed mb-4">
          <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mb-[2px]"></span>
          May 22nd, 2026: Nathan made an acquisition function for adaptive sampling. Learn more about it<span> </span>
          <a target="_blank" rel="noopener noreferrer" href="https://docs.google.com/document/d/1o6kB64x-la7LfA9-zpvW1XvdDKNfi7HZQpoSRrUACMo/edit?tab=t.0" className="underline hover:text-gray-500 ">here.</a>
        </p>
        
        <p className="flex items-center gap-3 text-slate-400 leading-relaxed mb-4">
          <span className="inline-block w-2 h-2 bg-white rounded-full shrink-0"></span>
          May 20th, 2026: Naitik confirmed a date for the first farm visit. Also got info on how the farm is irrigated.
        </p>
        <p className="flex items-center gap-3 text-slate-400 leading-relaxed mb-4">
          <span className="inline-block w-2 h-2 bg-white rounded-full shrink-0"></span>
          May 18th, 2026: Rover-Drone Hybrid design idea (scrapped 5/23), bought a better soil sensor.
        </p>
 <p className="flex items-center gap-3 text-slate-400 leading-relaxed mb-4">
          <span className="inline-block w-2 h-2 bg-white rounded-full shrink-0"></span>
          May 17th, 2026: Two important ideas were thought of today that we may implement in our project:
        </p>
        <p className="flex items-center gap-3 text-slate-400 leading-relaxed pl-5 mb-4">
          Idea #1 (scrapped 5/29): Use Gaussian Process Regression instead of Regression Kriging so we don't have to eyeball the variogram. Uncertainty is also much more adaptable to our data because it optimizes its parameters automatically, while Kriging mostly relies on the fixed sill, nugget, and range.
        </p>
        <p className="flex items-center gap-3 text-slate-400 leading-relaxed pl-5 mb-4">
          Idea #2: Have the drone create a path to sample at points it thinks will contribute the most information to the heatmap model, while also flying the shortest distance to minimize battery usage. This could be achieved by calculating an acquisition function with a travel cost penalty to sample the most optimal areas as it flies through the field.
        </p>
          <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mb-[2px]"></span>
          May 11th, 2026: Project research plan and deadlines draft finished.
        </p>
       
        
        
        
          
           
           
            

      </div>
    )
  },
  { name: "June", year: "2026", content: <div className="text-slate-500 pt-1">
      <p className="text-slate-400 leading-relaxed">
          <span className="inline-block w-2 h-2 bg-white rounded-full mr-3 mb-[2px]"></span>
          June 3rd, 2026: Coded the basic parts of the acquisition function. The code finds the point with the highest A(x) value out of all points on the heatmap. A higher A(x) value means that point will offer the most information and the rovers should go there to take a sample. Some code output is shown below (based on simulated data). Our function in the code assumes every term has a weight of 1. We will later run tests to see if it will work in all scenarios and how we should optimize weights.
        </p>
      
        

  <img
         
    src={funct}
    alt="Placeholder 1"
    className="md:w-[50%] md:h-relative h-full w-relative mt-4 mb-4"
  />
 
<figure>
  <img
         
    src={formula}
    alt="Placeholder 1"
    className="md:w-[50%] md:h-relative h-full w-relative mt-4 mb-4"
  />
  <figcaption className = "mb-4"> 
    Our acquisition function formula is shown above. The variables and how this will be used in the project are explained  <a target="_blank" rel="noopener noreferrer" href="https://docs.google.com/document/d/1o6kB64x-la7LfA9-zpvW1XvdDKNfi7HZQpoSRrUACMo/edit?usp=sharing" className="underline hover:text-gray-500 ">here.</a>
  </figcaption>
</figure>
  
  
  
  
  
  </div> },
  { name: "July", year: "2026", content: <div className="text-slate-500 italic pt-1">No updates yet.</div> },
  { name: "August", year: "2026", content: <div className="text-slate-500 italic pt-1">No updates yet.</div> },
  { name: "September", year: "2026", content: <div className="text-slate-500 italic pt-1">No updates yet.</div> },
  { name: "October", year: "2026", content: <div className="text-slate-500 italic pt-1">No updates yet.</div> },
  { name: "November", year: "2026", content: <div className="text-slate-500 italic pt-1">No updates yet.</div> },
  { name: "December", year: "2026", content: <div className="text-slate-500 italic pt-1">No updates yet.</div> },
  { name: "January", year: "2027", content: <div className="text-slate-500 italic pt-1">No updates yet.</div> },
  { name: "February", year: "2027", content: <div className="text-slate-500 italic pt-1">No updates yet.</div> },
  { name: "March", year: "2027", content: <div className="text-slate-500 italic pt-1">No updates yet.</div> },
  { name: "April", year: "2027", content: <div className="text-slate-500 italic pt-1">No updates yet.</div> },
  { name: "May", year: "2027", content: <div className="text-slate-500 italic pt-1">No updates yet.</div> }
];

export default function About() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentMonthIndex, setCurrentMonthIndex] = useState(1);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handlePrev = () => {
    if (currentMonthIndex > 0) {
      setCurrentMonthIndex(currentMonthIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentMonthIndex < MONTHS_DATA.length - 1) {
      setCurrentMonthIndex(currentMonthIndex + 1);
    }
  };

  const activeMonth = MONTHS_DATA[currentMonthIndex];

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E2E8F0] font-sans overflow-x-hidden flex flex-col justify-between">
      {/* Dynamic style tag to ensure scrollbar hiding behaves cleanly on all mobile web views */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="flex-1 flex flex-col">
        {/* Navigation Bar */}
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D1117]/80 backdrop-blur-md border-b border-slate-800">
       <div className="max-w-full mx-auto px-6 h-16 flex items-center justify-between">
         
         {/* Logo Link */}
         <div className="flex items-center text-xl font-bold tracking-tighter text-white">
           <img src={logo} alt="AgraBhi Logo" className="h-6 w-auto translate-y-[1px]" />
           <div>
             <a 
               href="https://agrabhi.com" 
               onClick={(e) => { e.preventDefault(); window.location.href = "https://agrabhi.com"; }}
               className="cursor-pointer"
             >
               Agra<span className="text-emerald-400">Bhi</span>
             </a>
           </div>
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
             href="https://agrabhi.com/about.html" 
             onClick={(e) => { e.preventDefault(); window.location.href = "https://agrabhi.com/about.html"; }}
             className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
           >
             Our Team
           </a>
   
           <a 
             href="https://agrabhi.com/updates.html" 
             onClick={(e) => { e.preventDefault(); window.location.href = "https://agrabhi.com/updates.html"; }}
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
             onClick={(e) => { e.preventDefault(); window.location.href = "https://agrabhi.com/data-hub.html"; }}
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
             href="https://agrabhi.com/" 
             onClick={(e) => { e.preventDefault(); toggleMenu(); window.location.href = "https://agrabhi.com/"; }}
             className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
           >
             Home
           </a>
           
           
           <a 
             href="https://agrabhi.com/about.html" 
             onClick={(e) => { e.preventDefault(); toggleMenu(); window.location.href = "https://agrabhi.com/about.html"; }}
             className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
           >
             Our Team
           </a>
           
           <a 
             href="https://agrabhi.com/updates.html" 
             onClick={(e) => { e.preventDefault(); toggleMenu(); window.location.href = "https://agrabhi.com/updates.html"; }}
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
             href="https://drive.google.com/file/d/1TR2aueFCylzw7Rai_YTZquHvooWqFICa/view?usp=sharing"
             target="_blank"
             rel="noopener noreferrer"
             className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-400 transition-colors"
           >
             Poster
           </a>
   <a 
             href="https://agrabhi.com/data-hub.html" 
             onClick={(e) => { e.preventDefault(); toggleMenu(); window.location.href = "https://agrabhi.com/data-hub.html"; }}
             className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
           >
             Data Hub
           </a>
         </div>
       )}
     </nav>
        {/* Main Content Area */}
        <main className="pt-24 px-6 max-w-6xl w-full mx-auto flex-1 flex flex-col">
          {/* Content block grows dynamically to fill space */}
          <div className="flex-1 flex flex-col">
            {/* Header Title Section for Active Month */}
            <div className="flex items-center gap-3 mb-6 shrink-0">
              <h2 className="text-3xl font-bold text-white">{activeMonth.name}</h2>
            </div>

            {/* Dynamic content rendering */}
            <div className="transition-all duration-300 ease-in-out">
              {activeMonth.content}
            </div>
          </div>

          {/* Tight Controls Section - Spacing variables match your original exact settings */}
          <div className="flex flex-col items-center justify-center border-t border-slate-800/60 shrink-0 py-3 gap-1">
            <div className="flex items-center gap-6 max-w-full justify-center">
              {/* Previous Arrow Button */}
              <button 
                onClick={handlePrev} 
                disabled={currentMonthIndex === 0}
                className={`flex items-center justify-center p-2 rounded-full border transition-all shrink-0 ${
                  currentMonthIndex === 0 
                    ? "border-slate-800 text-slate-600 cursor-not-allowed" 
                    : "border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
                }`}
                aria-label="Previous Month"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {/* Pagination Dots - Constrained to prevent device window blowout */}
              <div className="flex items-center gap-2.5 max-w-[145px] xs:max-w-[200px] sm:max-w-md overflow-x-auto py-1 px-2 no-scrollbar flex-nowrap">
                {MONTHS_DATA.map((month, idx) => (
                  <button
                    key={`${month.name}-${month.year}-${idx}`}
                    onClick={() => setCurrentMonthIndex(idx)}
                    title={`${month.name} ${month.year}`}
                    className={`h-2.5 rounded-full transition-all duration-300 shrink-0 ${
                      idx === currentMonthIndex 
                        ? "w-6 bg-emerald-400" 
                        : "w-2.5 bg-slate-600 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>

              {/* Next Arrow Button */}
              <button 
                onClick={handleNext} 
                disabled={currentMonthIndex === MONTHS_DATA.length - 1}
                className={`flex items-center justify-center p-2 rounded-full border transition-all shrink-0 ${
                  currentMonthIndex === MONTHS_DATA.length - 1 
                    ? "border-slate-800 text-slate-600 cursor-not-allowed" 
                    : "border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
                }`}
                aria-label="Next Month"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Contextual indicator label right below the dots */}
            <span className="text-xs tracking-wider font-semibold uppercase text-slate-500 select-none">
              {activeMonth.name} {activeMonth.year}
            </span>
          </div>
        </main>
      </div>

      {/* Tighter Bottom Footer */}
      <footer className="border-t border-slate-800 bg-[#0D1117] py-6 shrink-0">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-y-4 md:gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start mb-1">
              <img src={logo} alt="Logo" className="h-5 w-auto mr-1" />
              <h2 className="text-lg font-bold text-white leading-none">Agra<span className="text-emerald-400">Bhi</span></h2>
            </div>
            <p className="text-xs text-slate-400">Created by <span className="text-slate-200">Nathan Sharma, Naitik Patel, & Landon Morrison</span></p>
          </div>
          <div className="flex flex-col md:flex-row gap-x-6 gap-y-1 text-center">
            <a href="mailto:nathansharma007@gmail.com" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">nathansharma007@gmail.com</a>
            <a href="mailto:naitik.s.patel10@gmail.com" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">naitik.s.patel10@gmail.com</a>
              <a href="mailto:morrisonlandon51@gmail.com" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
          morrisonlandon51@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}