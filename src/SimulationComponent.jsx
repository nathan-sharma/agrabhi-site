import React, { useRef } from 'react';

const SimulationComponent = () => {
  const iframeRef = useRef(null);

  const handleActions = () => {
    const frame = iframeRef.current;

    if (frame && frame.contentWindow) {
      try {
        const doc = frame.contentDocument || frame.contentWindow.document;
        const win = frame.contentWindow;

        // --- 1. APPLY ZOOM (Scale) ---
        // To "zoom out" 30%, we set the scale to 0.7
        doc.body.style.transform = 'scale(0.4)';
        doc.body.style.transformOrigin = 'top left'; 
        // We expand the body width/height so the scale doesn't create white gaps
        doc.body.style.width = '250%'; // 1 / 0.7 = ~1.43
        doc.body.style.height = '250%';

        // --- 2. CALCULATE SCROLL ---
        // We use a small timeout to ensure the scale has updated the layout
        setTimeout(() => {
          const scrollWidth = doc.documentElement.scrollWidth;
          const scrollHeight = doc.documentElement.scrollHeight;
          const clientWidth = doc.documentElement.clientWidth;
          const clientHeight = doc.documentElement.clientHeight;

          const leftPos = (scrollWidth - clientWidth) * 0.4; // 50% horizontal
          const topPos = (scrollHeight - clientHeight) * 0.4; // 30% vertical

          win.scrollTo({
            left: leftPos,
            top: topPos,
            behavior: 'smooth',
          });
        }, 100);

      } catch (error) {
        console.error("Cross-origin error: Ensure kriging.html is in your public folder.", error);
      }
    }
  };

  return (
    <div className="w-full h-full border border-gray-200 rounded-lg overflow-hidden">
      <iframe
        ref={iframeRef}
        src="kriging.html"
        title="3D Moisture Simulation"
        className="w-full h-full border-none"
        onLoad={handleActions}
      />
    </div>
  );
};

export default SimulationComponent;