import React, { useState } from 'react';
import { RollNumberInput } from './components/RollNumberInput';
import { CourseSelector } from './components/CourseSelector';
import { SwapResult } from './components/SwapResult';
import { SwapService } from './services/swapService';
import { SwapRequest, SwapMatch } from './types/swap';

type AppState = 'roll-input' | 'course-selection' | 'result';

function App() {
  const [currentState, setCurrentState] = useState<AppState>('roll-input');
  const [rollNumber, setRollNumber] = useState('');
  const [swapMatch, setSwapMatch] = useState<SwapMatch | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleValidRollNumber = (roll: string) => {
    setRollNumber(roll);
    setCurrentState('course-selection');
  };

  const handleSwapRequest = async (
    current: string, 
    target: string, 
    semester: number, 
    department: string
  ) => {
    setIsLoading(true);

    const request: SwapRequest = {
      roll_number: rollNumber,
      course_current: current,
      course_target: target,
      semester,
      department
    };

    try {
      // Check for existing match first
      const match = await SwapService.checkForMatch(request);
      
      if (match) {
        setSwapMatch(match);
      } else {
        // No match found, create pending request
        await SwapService.createSwapRequest(request);
        setSwapMatch({ success: false, counterpart_roll: '' });
      }
      
      setCurrentState('result');
    } catch (error) {
      console.error('Error processing swap request:', error);
      // Handle error - maybe show error state
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartOver = () => {
    setCurrentState('roll-input');
    setRollNumber('');
    setSwapMatch(null);
  };

  const handleBackToCourseSelection = () => {
    setCurrentState('course-selection');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for matches...</p>
        </div>
      </div>
    );
  }

  switch (currentState) {
    case 'roll-input':
      return <RollNumberInput onValidRollNumber={handleValidRollNumber} />;
    
    case 'course-selection':
      return (
        <CourseSelector 
          rollNumber={rollNumber}
          onSwapRequest={handleSwapRequest}
          onBack={handleStartOver}
        />
      );
    
    case 'result':
      return (
        <SwapResult 
          rollNumber={rollNumber}
          matchFound={swapMatch?.success || false}
          counterpartRoll={swapMatch?.counterpart_roll}
          onStartOver={handleStartOver}
        />
      );
    
    default:
      return <RollNumberInput onValidRollNumber={handleValidRollNumber} />;
  }
}

export default App;