import { useState, useRef, useEffect } from 'react';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: 'Hi! 👋 I\'m your Blog Assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickReplies = [
    'How do I create a post?',
    'How do I add videos?',
    'How do I edit my profile?',
    'How do I follow users?'
  ];

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();

    if (msg.includes('post') || msg.includes('create') || msg.includes('write')) {
      return 'To create a post, click on the "Write" button in the navigation bar. You can add a title, content, cover image or video, and tags. When ready, click "Publish Now" to share it with everyone! 📝';
    }

    if (msg.includes('video')) {
      return 'To add a video to your post, go to the "Create Post" page and click the Video icon. Videos will auto-play when users scroll to them. You can upload videos up to 50MB in size. 🎥';
    }

    if (msg.includes('profile') || msg.includes('edit')) {
      return 'To edit your profile, click on your avatar in the top right, then select "Settings" or visit your profile page and click "Edit Profile". You can update your name, bio, avatar, and more! ✏️';
    }

    if (msg.includes('follow')) {
      return 'To follow users, visit their profile page and click the "Follow" button. You\'ll see their posts in your personalized feed! You can also see who follows you and who you\'re following from your profile page. 👥';
    }

    if (msg.includes('like') || msg.includes('comment')) {
      return 'You can interact with posts by liking ❤️, commenting 💬, sharing 📤, or saving 🔖 them. All these options are available below each post in your feed!';
    }

    if (msg.includes('help') || msg.includes('hi') || msg.includes('hello')) {
      return 'Hello! I\'m here to help you navigate the blog. You can ask me about creating posts, adding videos, editing your profile, following users, and more. What would you like to know? 😊';
    }

    return 'I\'m still learning! Try asking me about creating posts, adding videos, editing profiles, or following users. You can also select from the quick replies below! 🤖';
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = {
        role: 'bot',
        text: getBotResponse(input),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 800);
  };

  const handleQuickReply = (reply) => {
    setInput(reply);
    setTimeout(() => handleSend(), 100);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="chatbot-floating-btn"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'var(--insta-accent-blue)',
          border: 'none',
          boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          zIndex: 9999
        }}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window">
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-avatar">
              🤖
            </div>
            <div>
              <h3 className="chatbot-title">Blog Assistant</h3>
              <p className="chatbot-subtitle">Always here to help</p>
            </div>
          </div>

          {/* Messages */}
          <div className="chatbot-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`chatbot-message ${msg.role}`}
              >
                <div className="chatbot-bubble">
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chatbot-message bot">
                <div className="chatbot-bubble typing">
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                  <span className="typing-dot"></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 2 && (
            <div className="chatbot-quick-replies">
              {quickReplies.map((reply, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickReply(reply)}
                  className="chatbot-quick-reply-btn"
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chatbot-input-container">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="chatbot-input"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="chatbot-send-btn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>
        {`
          .chatbot-floating-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5);
          }

          .chatbot-window {
            position: fixed;
            bottom: 90px;
            right: 20px;
            width: 380px;
            max-width: calc(100vw - 40px);
            height: 550px;
            max-height: calc(100vh - 120px);
            background: var(--insta-bg-primary);
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 9998;
            border: 1px solid var(--insta-border-primary);
            animation: slideUp 0.3s ease-out;
          }

          .chatbot-header {
            background: var(--insta-accent-blue);
            padding: 16px 20px;
            color: white;
            display: flex;
            align-items: center;
            gap: 12px;
          }

          .chatbot-avatar {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
          }

          .chatbot-title {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
          }

          .chatbot-subtitle {
            margin: 0;
            font-size: 12px;
            opacity: 0.9;
          }

          .chatbot-messages {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .chatbot-message {
            display: flex;
          }

          .chatbot-message.user {
            justify-content: flex-end;
          }

          .chatbot-message.bot {
            justify-content: flex-start;
          }

          .chatbot-bubble {
            max-width: 75%;
            padding: 10px 14px;
            border-radius: 16px;
            font-size: 14px;
            line-height: 1.5;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          }

          .chatbot-message.user .chatbot-bubble {
            background: var(--insta-accent-blue);
            color: white;
            border-radius: 16px 16px 4px 16px;
          }

          .chatbot-message.bot .chatbot-bubble {
            background: var(--insta-bg-secondary);
            color: var(--insta-text-primary);
            border-radius: 16px 16px 16px 4px;
          }

          .chatbot-bubble.typing {
            display: flex;
            gap: 4px;
            padding: 12px 14px;
          }

          .typing-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--insta-text-tertiary);
            animation: bounce 1.4s infinite;
          }

          .typing-dot:nth-child(2) {
            animation-delay: 0.2s;
          }

          .typing-dot:nth-child(3) {
            animation-delay: 0.4s;
          }

          .chatbot-quick-replies {
            padding: 8px 16px;
            border-top: 1px solid var(--insta-border-primary);
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
          }

          .chatbot-quick-reply-btn {
            padding: 6px 12px;
            border-radius: 16px;
            border: 1px solid var(--insta-border-primary);
            background: var(--insta-bg-secondary);
            color: var(--insta-text-secondary);
            font-size: 12px;
            cursor: pointer;
            transition: all 0.2s;
          }

          .chatbot-quick-reply-btn:hover {
            background: var(--insta-accent-blue);
            color: white;
            border-color: var(--insta-accent-blue);
          }

          .chatbot-input-container {
            padding: 16px;
            border-top: 1px solid var(--insta-border-primary);
            display: flex;
            gap: 8px;
          }

          .chatbot-input {
            flex: 1;
            padding: 10px 14px;
            border-radius: 20px;
            border: 1px solid var(--insta-border-primary);
            background: var(--insta-bg-secondary);
            color: var(--insta-text-primary);
            font-size: 14px;
            outline: none;
            font-family: inherit;
          }

          .chatbot-input:focus {
            border-color: var(--insta-accent-blue);
          }

          .chatbot-send-btn {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: none;
            background: var(--insta-accent-blue);
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
          }

          .chatbot-send-btn:disabled {
            background: var(--insta-bg-tertiary);
            cursor: not-allowed;
            opacity: 0.5;
          }

          .chatbot-send-btn:not(:disabled):hover {
            transform: scale(1.05);
            box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
          }

          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes bounce {
            0%, 60%, 100% {
              transform: translateY(0);
              opacity: 0.4;
            }
            30% {
              transform: translateY(-4px);
              opacity: 1;
            }
          }

          /* Mobile Responsive */
          @media (max-width: 768px) {
            .chatbot-window {
              bottom: 0;
              right: 0;
              left: 0;
              width: 100%;
              max-width: 100%;
              height: 100vh;
              max-height: 100vh;
              border-radius: 0;
            }

            .chatbot-floating-btn {
              bottom: 16px;
              right: 16px;
              width: 50px;
              height: 50px;
            }

            .chatbot-bubble {
              max-width: 85%;
            }
          }

          @media (max-width: 480px) {
            .chatbot-header {
              padding: 12px 16px;
            }

            .chatbot-messages {
              padding: 12px;
            }

            .chatbot-input-container {
              padding: 12px;
            }

            .chatbot-quick-reply-btn {
              font-size: 11px;
              padding: 5px 10px;
            }
          }
        `}
      </style>
    </>
  );
};

export default ChatBot;
