import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import logo from "/blogo.png";
import image1 from "/image1.jpg";
import image2 from "/image2.png"
export default function About() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFullAbstract, setShowFullAbstract] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <div className="min-h-screen bg-[#0D1117] text-[#E2E8F0] font-sans overflow-x-hidden">
      
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D1117]/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-full mx-auto px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center text-xl font-bold tracking-tighter text-white">
            <img
              src={logo}
              alt="AgraBhi Logo"
              className="h-6 w-auto translate-y-[1px]"
            />

            <div>
              <Link to="/">
                Agra<span className="text-emerald-400">Bhi</span>
              </Link>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">

           
  <Link
              to="/"
              className="text-xs uppercase tracking-widest font-bold text-slate-400"
            >
              Home
            </Link>
  <Link
              to="/about"
              className="text-xs uppercase tracking-widest font-bold text-emerald-400"
            >
              Our Team
            </Link>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/nathan-sharma/Agrabhi"
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
            >
              GitHub
            </a>

            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.gofundme.com/manage/agrabhi-smarter-soil-moisture-for-farmers"
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500 transition-colors"
            >
              GoFundMe
            </a>

            <Link
              to="/data-hub"
              className="text-xs uppercase tracking-widest font-bold px-4 py-2 rounded-full bg-blue-500 text-[#0D1117] hover:bg-blue-400 transition-all"
            >
              Data Hub
            </Link>

          </div>

          <button
            onClick={toggleMenu}
            className="md:hidden text-slate-400 hover:text-white focus:outline-none"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0D1117] border-b border-slate-800 px-6 py-4 flex flex-col gap-4">

           
           

      
 <Link
              to="/"
              onClick={toggleMenu}
              className="text-xs uppercase tracking-widest font-bold text-slate-400"
            >
              Home
            </Link>
                  <a
              href="https://drive.google.com/file/d/1TR2aueFCylzw7Rai_YTZquHvooWqFICa/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-400 transition-colors"
            >
              Poster
            </a>
            
 <Link
              to="/about"
              onClick={toggleMenu}
              className="text-xs uppercase tracking-widest font-bold text-emerald-400"
            >
              Our Team
            </Link>
            <a
              href="https://github.com/nathan-sharma/Agrabhi"
              onClick={toggleMenu}
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500"
            >
              GitHub
            </a>

            <a
              href="https://www.gofundme.com/manage/agrabhi-smarter-soil-moisture-for-farmers"
              onClick={toggleMenu}
              className="text-xs uppercase tracking-widest font-bold text-slate-400 hover:text-emerald-500"
            >
              GoFundMe
            </a>

           


          </div>
        )}
      </nav>

      {/* PAGE CONTENT */}
      <main className="pt-32 px-6 py-10 max-w-6xl mx-auto space-y-16">

        {/* GROUP 1 */}
        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
          
          {/* Image Placeholder */}
          <div className="w-full md:w-1/2 h-80  rounded-2xl flex items-center justify-center text-slate-500 text-lg font-semibold">
            <img
         
    src={image1}
    alt="Placeholder 1"
    className="h-full w-relative"
  />
          </div>

          {/* Paragraph Placeholder */}
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-bold text-white mb-4">
              Nathan Sharma
            </h2>

            <p className="text-slate-400 leading-relaxed">
           Hi, I'm Nathan, and I am the founder and team lead of AgraBhi. I am an incoming junior at Cinco Ranch High School and love research, mathematics, and science. I am very involved in and have won multiple awards in science fairs, math competitions, and TMEA and other music competitions. In my free time, I enjoy running, playing the cello, and spending time with my family.
            </p>
          </div>

        </div>

        {/* GROUP 2 */}
        <div className="flex flex-col md:flex-row gap-8 items-center mt-8">
          
          {/* Image Placeholder */}
          <div className="w-full md:w-1/2 h-80 rounded-2xl flex items-center justify-center text-slate-500 text-lg font-semibold">
            <img
         
    src={image2}
    alt="Placeholder 2"
    className="h-[90%] w-relative mt-8"
  />
          </div>

          {/* Paragraph Placeholder */}
          <div className="w-full md:w-1/2">
            <h2 className="text-2xl font-bold text-white mb-4">
              Naitik Patel
            </h2>

            <p className="text-slate-400 leading-relaxed">
       I'm Naitik Patel, a student researcher at Cinco Ranch High School and co-founder of AgraBhi. I stay busy as Class Treasurer and lead weekly youth sessions at HSS. In my free time, I also enjoy playing guitar and tennis.
            </p>
          </div>

        </div>

      </main>
         <footer className="border-t border-slate-800 bg-[#0D1117] py-8">
        <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-y-2 md:gap-6">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start  mb-1">
              <img src="blogo.png" alt="Logo" className="h-5 w-auto" />
              <h2 className="text-lg font-bold text-white leading-none">
                Agra<span className="text-emerald-400">Bhi</span>
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Created by <span className="text-slate-200">Nathan Sharma, Naitik Patel, & Evan Quach</span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-x-6 gap-y-0 md:gap-y-1 text-center">
            <a href="mailto:nathansharma007@gmail.com" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
              nathansharma007@gmail.com
            </a>
            <a href="mailto:naitik.s.patel10@gmail.com" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
              naitik.s.patel10@gmail.com
            </a>
            <a href="mailto:quachevan@gmail.com" className="text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
              quachevan@gmail.com
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}