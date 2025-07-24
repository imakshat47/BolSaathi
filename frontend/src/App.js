import React, { useState } from 'react';
import { useSpeechRecognition, useSpeechSynthesis } from 'react-speech-kit';
import './App.css';

function App() {

    const [query, setQuery] = useState('');
    const [reply, setReply] = useState('');
    const { listen, listening, stop } = useSpeechRecognition({
        onResult: (text) => {
            setQuery(text);
        }
    });
    const { speak, speaking, cancel } = useSpeechSynthesis();

    const handleSend = async () => {
        if (!query.trim()) return;
        // console.error(query);
        // 1. send to your FastAPI backend
        try {
            const res = await fetch("http://localhost:8000/query", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({                    
                    query: query
                }),
            });
            if (!res.ok) {
                console.error("Server error:", await res.text());
                return;
            }
            const data = await res.json();
            console.log(data);
            setReply(data.res || query);
            speak({ text: data.res || query });
        } catch (err) {
            console.error("Network error:", err);
        }
    };

    return (
        <div className="app">
            <h1>Voice Chatbot</h1>

            <div className="controls">
                {listening ? (
                    <button onClick={stop} className="btn btn-stop">Stop Listening</button>
                ) : (
                    <button onClick={() => listen({ interim: true })} className="btn btn-listen">
                        🎙️ Listen
                    </button>
                )}
                {speaking && (
                    <button onClick={cancel} className="btn btn-stop-speech">Stop Speaking</button>
                )}
            </div>

            <textarea
                value={query}
                name='query'
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Speak or type your message..."
            />

            <button onClick={handleSend} className="btn btn-send">Send to Bot</button>

            {reply && (
                <div className="reply">
                    <h2>Bot says:</h2>
                    <p>{reply}</p>
                </div>
            )}
        </div>
    );
}

export default App;
