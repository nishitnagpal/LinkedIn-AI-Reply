import { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import IconModal from '@/entrypoints/popup/iconModal'; 
import aiLogo from '@/assets/icon.svg';
import '@/entrypoints/popup/content.css';

export default defineContentScript({
  matches: ["*://www.linkedin.com/*"],
  main() {
    const App = () => {
      const [isIconVisible, setIsIconVisible] = useState(false);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [userInput, setUserInput] = useState('');
      const [response, setResponse] = useState(''); 
      const [isGenerated, setIsGenerated] = useState(false);
      const [modalWidth, setModalWidth] = useState<string | null>(null);
      const modalRef = useRef<HTMLDivElement>(null); // Ref for modal

      // Set modal width to 90% of message input width
      const setModalToMessageBoxWidth = () => {
        const messageBox = document.querySelector('.msg-form__msg-content-container.msg-form__message-texteditor');
        if (messageBox) {
          const messageBoxWidth = messageBox.getBoundingClientRect().width;
          setModalWidth(`${messageBoxWidth}px`);
        }
      };

      // Open modal and reset fields
      const handleIconClick = () => {
        // Restore the modal and input to the initial state
        setUserInput('');   
        setResponse('');    
        setIsGenerated(false);

        // Set modal width and open modal
        setModalToMessageBoxWidth();
        setIsModalOpen(true);
      };

      // Close modal
      const handleCloseModal = () => {
        setIsModalOpen(false);
      };

      // Handle response generation
      const handleGenerateClick = () => {
        setResponse("Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask.");
        setIsGenerated(true);
      };

      // Insert the generated response into LinkedIn's message input
      const handleInsertClick = () => {
        const messageInput = document.querySelector('div[contenteditable="true"]');
        if (messageInput) {
          messageInput.innerHTML = `<p>${response}</p>`;
          
          // Trigger input event to ensure proper rendering
          const event = new Event('input', { bubbles: true });
          messageInput.dispatchEvent(event);
          
          // Slight delay for visibility
          setTimeout(() => setIsIconVisible(true), 100); 
          setIsModalOpen(false);

          // Reset states after insertion
          setUserInput('');   
          setResponse('');    
          setIsGenerated(false);  
        }
      };

      // Close modal if click is outside
      useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
            setIsModalOpen(false);
          }
        };
        if (isModalOpen) {
          document.addEventListener('mousedown', handleClickOutside);
        } 
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [isModalOpen]);

      // Monitor and manage the message input field's focus and click events
      const checkForMessageInput = () => {
        const messageInput = document.querySelector('div[contenteditable="true"]');
        if (messageInput) {
          messageInput.addEventListener('focus', () => {
            setIsIconVisible(true);
          });
          document.addEventListener('click', (e) => {
            if (!messageInput.contains(e.target as Node)) {
              setIsIconVisible(false);
            }
          });
          return true;
        }
        return false;
      };

      // Check for the presence of message input field at intervals
      useEffect(() => {
        const intervalId = setInterval(() => {
          if (checkForMessageInput()) {
            clearInterval(intervalId);
          }
        }, 1000);
      }, []);

      // Manage AI icon visibility and transitions
      useEffect(() => {
        if (isIconVisible) {
          const parentContainer = document.querySelector('div.msg-form__msg-content-container--scrollable');
          if (parentContainer) {
            const root = document.createElement('div');
            root.id = 'ai-icon-root';
            parentContainer.appendChild(root);

            ReactDOM.createRoot(root).render(
              <div className="absolute w-12 h-12 bg-white rounded-full flex items-center justify-center bottom-2 right-2 cursor-pointer z-50 transition-transform duration-100 ease-in-out transform"
                style={{ opacity: isIconVisible ? 1 : 0, transform: isIconVisible ? 'scale(1)' : 'scale(0.95)' }}
              >  
                <img
                  src={aiLogo}
                  alt="AI Icon"
                  className="w-6 h-6 items-center justify-center"
                  onClick={handleIconClick}
                />
              </div>
            );
          }
        } else {
          const existingIconRoot = document.getElementById('ai-icon-root');
          if (existingIconRoot) {
            existingIconRoot.remove();
          }
        }
      }, [isIconVisible]);

      return (
        <>
          {isIconVisible && (
            <div onClick={handleIconClick}>
              <img src={aiLogo} alt="AI Icon" />
            </div>
          )}
          {isModalOpen && (
            <div ref={modalRef}>
              <IconModal
                showModal={isModalOpen}
                onGenerateClick={handleGenerateClick}
                onCloseModal={handleCloseModal}
                onInsertClick={handleInsertClick}
                userInput={userInput}
                setUserInput={setUserInput}
                response={response}
                isGenerated={isGenerated}
                modalWidth={modalWidth}
              />
            </div>
          )}
        </>
      );
    };

    const root = document.createElement('div');
    document.body.appendChild(root);
    ReactDOM.createRoot(root).render(<App />);
  },
});
