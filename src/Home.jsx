import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from "/blogo.png";
import agrilife from "/agrilife.jpg"
import { HashLink } from 'react-router-hash-link';
import meetup from "/meetup625.png";
import second from "/second.png";
import third from "/third.png";

export default function Home() {
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFullAbstract, setShowFullAbstract] = useState(false);
  

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E2E8F0] font-sans overflow-x-hidden">
      
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
      {/* EVERYTHING BELOW IS COMPLETELY UNCHANGED */}
      {/* (rest of your file remains exactly the same) */}

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-15 -z-20"></div>

      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10"></div>

   {/* Header / Hero Section */}
      <header className="relative pt-32 pb-2 sm:pb-8 px-6 text-center">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-2 sm:mb-4 tracking-tight text-white py-2 animate-pop-slow">
          Agra<span className="text-emerald-400">Bhi</span>
        </h1>
        <h2 className="text-xl md:text-3xl font-medium tracking-tight text-slate-300 max-w-7xl mx-auto leading-tight animate-slide-slow">
         Accurate, Low Cost Soil Moisture Mapping for Smarter Decisions.
        </h2>
      </header>

<section className="relative z-10 px-4 py-1 mb-12 mt-8 sm:mt-3">
  <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
    
    {/* Medals Container */}
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-8 md:gap-12">
      
      {/* Award 1 */}
      <div className="animate-slide-slow flex flex-row items-start sm:items-center text-left gap-3" style={{ animationDelay: '1s' }}>
        <img 
          src={second} 
          alt="Second Place" 
          className="h-10 w-auto shrink-0" 
        />
        <div className="pt-1 sm:pt-0">
          <p className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold mb-0.5 sm:h-8 flex items-end">
            Category Winner &amp; State Finalist
          </p>
          <p className="text-sm font-medium text-slate-200">
            2026 Science &amp; Engineering Fair of Houston
          </p>
        </div>
      </div>

      {/* Vertical Divider for Desktop Only */}
      <div className="hidden sm:block w-px h-12 bg-slate-600 self-center"></div>

      {/* Award 2 */}
      <div className="animate-slide-slow flex flex-row items-start sm:items-center text-left gap-3" style={{ animationDelay: '1500ms' }}>
        <img 
          src={third} 
          alt="Third Place" 
          className="h-10 w-auto shrink-0" 
        />
        <div className="pt-1 sm:pt-0">
          <p className="text-[11px] sm:text-xs uppercase tracking-wider text-slate-400 font-semibold mb-0.5 sm:h-8 flex items-end">
            Category Winner
          </p>
          <p className="text-sm font-medium text-slate-200">
            2026 Texas Science &amp; Engineering Fair
          </p>
        </div>
      </div>

    </div>

  </div>
</section>
      <main className="max-w-5xl mx-auto px-6">
        
        {/* PROJECT VIDEO SECTION */}
   <section className="py-1 mt-0 sm:py-4 sm:mt-3 mt-6 flex flex-col items-center justify-center">
    <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-black w-full md:w-[70%]">
    <img 
      src={meetup}
      alt="AgraBhi Presentation Visual" 
      className="absolute top-0 left-0 w-full h-full object-cover"
    />
  </div>
  
  


</section>

        <hr className="border-slate-900" />

        {/* UPDATED ABSTRACT SECTION */}
        <section id="abstract" className="py-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4">
            What AgraBhi Is
          </h2>
          <div className="text-base font-light text-slate-300 leading-relaxed">
            <p>
              AgraBhi is a project being made to help farmers better understand soil moisture patterns on their farm fields before planting crops. Rather than relying on cameras or other contactless sensors, which can provide uncertain data, AgraBhi uses physical sensors to measure moisture at the depth where crops are being planted, significantly improving measurement accuracy. We then use interpolation models to predict moisture across the rest of the farm field.               The goal of our project is to make crop decisions more precise, efficient, and affordable for farmers with this data.
            </p>
    

            <div className="pt-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-4">
                Why This Matters
              </h2>
              
              
              <p>
                Soil moisture significantly changes across farm fields, and yet today, many farmers lack the data they need to make informed decisions on where to plant their crops. With this data, they can decide whether they should wait for better conditions, if they should irrigate before planting in extremely dry areas, and the best depth for sowing seeds.
              </p>
              
            </div>

           
          </div>
        </section>
           <hr className="border-slate-900" />
 <section id="development" className="py-4 scroll-mt-24">
  <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-6">
    Current work (Rover project)
  </h2>
  
  {/* The 2-column grid now holds the first two balanced items */}
<div className="grid gap-6">
  <div>
    <h3 className="text-white font-bold flex items-center gap-2">
      Drone to Rovers
    </h3>
    <p className="text-slate-400 font-light text-sm leading-relaxed">
      An important limitation of our project last year was that the drone struggled to get through the crop canopy, and its blades could easily damage crops. To fix this, we decided to switch our project to a swarm of rovers. Each rover costs ~$1000, is autonomous, and communicates with one another to take samples effectively.
    </p>
  </div>
  <div>
    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
      Adaptive Sampling
    </h3>
    <p className="text-slate-400 font-light text-sm leading-relaxed">
      Our rovers can improve their own predictive accuracy by driving to the most uncertain or unexplored parts of the fields in real time. The swarm starts by randomly taking moisture measurements across the farm field and generates a heatmap. Then, a mother rover receives all data from the other rovers to calculate the most unexplored or uncertain spots each rover should sample.
    </p>
  </div>
   <div>
    <h3 className="text-white font-bold mb-3 flex items-center gap-2">
      Implementation on Farms
    </h3>
    <p className="text-slate-400 font-light text-sm leading-relaxed">
       AgraBhi is being implemented in collaboration with the Texas A&M AgriLife Extension and their partner farms. Our moisture data will inform farmers' planting decisions and help the analytical models AgriLife uses to predict crop yield with ground-truth moisture measurements.
     </p>
  </div>
</div>

  <div className=" max-w-4xl">
 
    {/* Stylized Video Player Wrapper */}
    
  </div>

</section>
       
  <section id="poster" className="py-2 scroll-mt-24">
  <hr className="border-slate-900 mb-3" />
  <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 mb-6">
    Old Work (Drone Project)
  </h2>

  {/* Hidden on small screens, shown on md and up */}
   <div className="mt-6 mx-auto relative aspect-video rounded-xl overflow-hidden border border-slate-800 bg-black w-full md:w-[70%]">
    <iframe
      className="absolute top-0 left-0 w-full h-full"
      src="https://www.youtube.com/embed/Bgpvw7TuoMc"
      title="AgraBhi 2026 Video"
      frameBorder="0"
      allowFullScreen
    ></iframe>
  </div>
  <div className="hidden md:block bg-[#161B22] border border-slate-800 p-1 rounded-xl shadow-xl mt-4 mb-4">
    <div className="bg-[#0D1117] w-full h-[800px] overflow-hidden rounded-lg">
      <iframe
        src="/poster.pdf"
        className="w-full h-full border-none"
        title="AgraBhi Research Poster"
      ></iframe>
    </div>
  </div>

  {/* Visible on all screens, centered, with dynamic width for mobile vs desktop */}
 
</section>
        {/* CURRENT DEVELOPMENT SECTION */}
      

        <hr className="border-slate-900" />

        {/* RESEARCH POSTER SECTION */}


        {/* NEXT STEPS & SUPPORT */}
     
      </main>

   <footer className="border-t border-slate-800 bg-[#0D1117] py-8">
    
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-y-2 md:gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start  mb-1">
              <img src={logo} alt="Logo" className="h-5 w-auto" />
              <h2 className="text-lg font-bold text-white leading-none">
                Agra<span className="text-emerald-400">Bhi</span>
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Created by <span className="text-slate-200">Nathan Sharma & Landon Morrison </span>
            </p>
            
          </div>
          

          <div className="flex flex-col md:flex-row gap-x-6 gap-y-0 md:gap-y-1 text-center">
            <a href="mailto:nathansharma007@gmail.com" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
              nathansharma007@gmail.com
            </a>
          
               <a href="mailto:morrisonlandon51@gmail.com" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
          morrisonlandon51@gmail.com
            </a>
             
          </div>
        </div>
      </footer>
    </div>
  );
}