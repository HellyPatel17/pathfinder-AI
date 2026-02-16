
import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center space-x-2 mb-8">
      {Array.from({ length: totalSteps }).map((_, idx) => (
        <React.Fragment key={idx}>
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              idx <= currentStep
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-slate-800 text-slate-500'
            }`}
          >
            {idx + 1}
          </div>
          {idx < totalSteps - 1 && (
            <div
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                idx < currentStep ? 'bg-blue-600' : 'bg-slate-800'
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepIndicator;
