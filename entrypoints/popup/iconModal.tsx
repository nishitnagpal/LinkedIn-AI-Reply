import React from 'react';
import './content.css';
import generateIcon from '@/assets/generateIcon.svg';
import regenerateIcon from '@/assets/regenerateIcon.svg';
import insertIcon from '@/assets/insertIcon.svg';

interface IconModalProps {
  showModal: boolean;
  onGenerateClick: () => void;
  onCloseModal: () => void;
  onInsertClick: () => void;
  userInput: string;
  setUserInput: (input: string) => void;
  response: String;
  isGenerated: boolean;
  modalWidth: string | null; 
}

const IconModal: React.FC<IconModalProps> = ({
  showModal,
  onGenerateClick,
  onCloseModal,
  onInsertClick,
  userInput,
  setUserInput,
  response,
  isGenerated,  
  modalWidth 
}) => {
  
  // Don't render if modal is not visible
  if (!showModal) return null;

  // Prevent clicks within modal from propagating
  const handleModalClick = (event: React.MouseEvent) => {
    event.stopPropagation(); 
  };

  return (
    <div className="fixed inset-0 z-40">

      {/* Modal backdrop */}
      <div className="fixed inset-0 bg-black opacity-50 z-30"></div>

      {/* Modal container */}
      <div className="fixed inset-0 flex items-center justify-center z-40" onClick={onCloseModal}>

        {/* Modal content */}
        <div 
          className="bg-white p-6 rounded-lg modal-content m-6"
          style={{ width: modalWidth || '40%' }} // Apply dynamic width or fallback
          onClick={handleModalClick} 
        >
          {/* Input field if no response is generated */}
          {!response && (
            <input 
              id="customInput"
              type="text"
              className="rounded-lg p-2 w-full border-2 border-gray-400"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder='Your Prompt'
            />
          )}

          {/* Display user input and response if generated */}
          {isGenerated && (
            <div className="w-full p-2">
              <div className="flex  mb-2 w-full justify-end">
                <p className="bg-[#DFE1E7] rounded-lg text-black text-left px-4 py-4" style={{ maxWidth: '80%' }}>{userInput}</p>
              </div>
              <div className="flex mb-2 w-full justify-start">
                <p className="bg-[#DBEAFE] rounded-lg text-black text-left px-4 py-4" style={{ maxWidth: '80%' }}>{response}</p>
              </div> 
              <input 
                id="customInput"
                type="text"
                className="rounded p-2 w-full border border-gray-400"
                placeholder='Your Prompt'
              /> 
            </div>
          )}          

          {/* Action buttons */}
          <div className="flex justify-end mt-4 space-x-4">
            {isGenerated ? (
              <>
                <button 
                  className="flex items-center bg-white rounded-lg px-4 py-2 border-gray-500 border border-solid mr-2" 
                  style={{ color: '#666D80'}}
                  onClick={onInsertClick}
                >
                  <img src={insertIcon} alt="Insert Icon" className="w-6 h-6 mr-2" />
                  Insert
                </button>
                <button className="bg-[#2563EB] flex items-center text-white rounded-lg px-4 py-2">
                  <img src={regenerateIcon} alt="Regenerate Icon" className="w-6 h-6 mr-2 ml-2" />
                  Regenerate
                </button>
              </>
            ) : (
              <button
                onClick={onGenerateClick}
                className= "flex items-center text-white rounded-lg px-4 py-2" 
                style={{ backgroundColor: '#2563EB' }}
                disabled={!userInput} // Disable button if input is empty(extra)
              >
                <img src={generateIcon} alt="Generate Icon" className="w-6 h-6 mr-2 ml-2" />
                Generate
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IconModal;
