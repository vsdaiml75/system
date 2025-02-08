import React, { useRef, useEffect } from 'react';

function ResourceDistribution({ 
  totalResources, 
  distribution, 
  onChange 
}) {
  const fullTimeRef = useRef(null);
  const partTimeRef = useRef(null);
  const contractRef = useRef(null);
  const internRef = useRef(null);

  const handleChange = (type, value) => {
    const newValue = value === '' ? '' : parseInt(value);
    const newDistribution = { ...distribution, [type]: newValue };
    
    // Calculate total
    const currentTotal = Object.values(newDistribution)
      .reduce((sum, num) => sum + (num || 0), 0);
    
    // If total exceeds, reset the current field
    if (currentTotal > totalResources) {
      return;
    }
    
    onChange(newDistribution, currentTotal === totalResources);
  };

  const handleKeyDown = (e, currentRef, nextRef) => {
    const currentTotal = Object.values(distribution)
      .reduce((sum, num) => sum + (num || 0), 0);

    // Prevent tab if total exceeds or equals the limit
    if (e.key === 'Tab' && currentTotal >= totalResources) {
      e.preventDefault();
      return;
    }

    // Allow tab to next field only if there are remaining resources
    if (e.key === 'Tab' && !e.shiftKey && nextRef && currentTotal < totalResources) {
      e.preventDefault();
      nextRef.current.focus();
    }
  };

  const currentTotal = Object.values(distribution)
    .reduce((sum, num) => sum + (num || 0), 0);
  const remaining = totalResources - currentTotal;

  return (
    <div className="flex items-center justify-between text-xs">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="whitespace-nowrap">Full-time</span>
          <input
            ref={fullTimeRef}
            type="number"
            value={distribution.fullTime}
            onChange={(e) => handleChange('fullTime', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, fullTimeRef, partTimeRef)}
            className="w-10 p-1 border rounded text-center"
            min="0"
            max={totalResources}
          />
        </div>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-1.5">
          <span className="whitespace-nowrap">Part-time</span>
          <input
            ref={partTimeRef}
            type="number"
            value={distribution.partTime}
            onChange={(e) => handleChange('partTime', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, partTimeRef, contractRef)}
            className="w-10 p-1 border rounded text-center"
            min="0"
            max={totalResources}
          />
        </div>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-1.5">
          <span>Contract</span>
          <input
            ref={contractRef}
            type="number"
            value={distribution.contract}
            onChange={(e) => handleChange('contract', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, contractRef, internRef)}
            className="w-10 p-1 border rounded text-center"
            min="0"
            max={totalResources}
          />
        </div>
        <span className="text-gray-300">|</span>
        <div className="flex items-center gap-1.5">
          <span>Intern</span>
          <input
            ref={internRef}
            type="number"
            value={distribution.intern}
            onChange={(e) => handleChange('intern', e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, internRef, null)}
            className="w-10 p-1 border rounded text-center"
            min="0"
            max={totalResources}
          />
        </div>
      </div>
      <div className="ml-8">
        {remaining < 0 ? (
          <span className="text-red-500">
            Total exceeds resource count by {Math.abs(remaining)}
          </span>
        ) : remaining > 0 ? (
          <span className="text-red-500">
            Remaining: {remaining}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export default ResourceDistribution; 