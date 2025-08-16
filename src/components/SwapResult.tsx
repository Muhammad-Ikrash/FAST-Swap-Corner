import React from 'react';
import { CheckCircle, Clock, RefreshCw, Mail } from 'lucide-react';
import { rollNumberToEmail } from '../utils/validation';

interface SwapResultProps {
  rollNumber: string;
  matchFound: boolean;
  counterpartRoll?: string;
  onStartOver: () => void;
}

export const SwapResult: React.FC<SwapResultProps> = ({ 
  rollNumber, 
  matchFound, 
  counterpartRoll,
  onStartOver 
}) => {
  if (matchFound && counterpartRoll) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Match Found! 🎉
          </h1>
          
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">You have been matched with:</p>
            <p className="text-xl font-bold text-green-600 mb-2">{counterpartRoll}</p>
           <div className="flex items-center justify-center gap-2">
             <Mail className="w-4 h-4 text-blue-600" />
             <a 
               href={`https://mail.google.com/mail/?view=cm&fs=1&to=${rollNumberToEmail(counterpartRoll)}&su=${encodeURIComponent(`Course Section Swap - ${rollNumber} & ${counterpartRoll}`)}&body=${encodeURIComponent(`Hi,\n\nI found your contact through the Course Section Swap system. We have been matched for a course swap.\n\nMy roll number: ${rollNumber}\nYour roll number: ${counterpartRoll}\n\nLet's coordinate our section swap.\n\nBest regards`)}`}
               target="_blank"
               rel="noopener noreferrer"
               className="text-blue-600 hover:text-blue-800 font-medium underline transition-colors duration-200"
             >
               {rollNumberToEmail(counterpartRoll)}
             </a>
           </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-700">
              📧 Both students have been notified via email. Contact them directly to coordinate the swap.
            </p>
          </div>
          
          <button
            onClick={onStartOver}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Find Another Swap
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6">
          <Clock className="w-8 h-8 text-amber-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          No Match Found
        </h1>
        
        <div className="bg-amber-50 rounded-lg p-6 mb-6">
          <p className="text-amber-700">
            Your swap request has been added to the database. You'll be automatically matched when someone requests the reverse swap.
          </p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-700">
            <strong>Come back again!</strong> Check periodically or ask classmates if they need your swap.
          </p>
        </div>
        
        <button
          onClick={onStartOver}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 font-medium flex items-center justify-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Start Over
        </button>
      </div>
    </div>
  );
};