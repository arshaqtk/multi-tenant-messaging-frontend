import { useState } from 'react';

function ChatPanel({ activeGroup, messages, onSendMessage, sending, loadingMessages, socketStatus }) {
  const [text, setText] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setText('');
  }

  if (!activeGroup) {
    return (
      <section className="chat card">
        <p className="muted">Select a group to start chatting.</p>
      </section>
    );
  }

  return (
    <section className="chat card">
      <div className="chat-header">
        <h2># {activeGroup.name}</h2>
        <span className="muted">Socket: {socketStatus}</span>
      </div>

      <div className="messages">
        {loadingMessages ? <p className="muted">Loading messages...</p> : null}

        {!loadingMessages && messages.length === 0 ? <p className="muted">No messages yet.</p> : null}

        {messages.map((message) => {
          const senderName = message?.senderId?.name || 'Unknown';
          const timestamp = new Date(message.createdAt).toLocaleTimeString();

          return (
            <article key={message._id} className="message-item">
              <header>
                <strong>{senderName}</strong>
                <span className="muted">{timestamp}</span>
              </header>
              <p>{message.text}</p>
            </article>
          );
        })}
      </div>

      <form onSubmit={handleSubmit} className="composer">
        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Type a message"
          maxLength={2000}
        />
        <button type="submit" disabled={sending}>
          {sending ? 'Sending...' : 'Send'}
        </button>
      </form>
    </section>
  );
}

export default ChatPanel;
