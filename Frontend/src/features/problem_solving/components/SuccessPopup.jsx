import React from 'react';

export default function SuccessPopup({
  isOpen,
  onClose,
  onReplay,
  onNextLevel,
  levelNumber,
  xpEarned,
  totalXp,
  runtime,
  memory,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 pointer-events-auto">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">
            Level {levelNumber} Completed!
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              You've earned <span className="font-bold text-green-600">+{xpEarned} XP</span>!
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Total XP: <span className="font-bold">{totalXp}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Runtime: <span className="font-bold">{runtime ?? '-'}</span>s
              {" "}| Memory: <span className="font-bold">{memory ?? '-'}</span> KB
            </p>
          </div>
          <div className="mt-4">
            <div className="flex gap-3 justify-center">
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-gray-800"
                onClick={onReplay}
              >
                Replay
              </button>
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                onClick={onNextLevel}
              >
                Next Level
              </button>
              <button
                type="button"
                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}