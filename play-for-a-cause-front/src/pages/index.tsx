import React, { useEffect, useState } from 'react';

export interface ChatMessage {
    chatId: string;
    content: string;
    authorId: string;
    createdAt: Date;
    updatedAt?: Date | null;
}
const App: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        const sse = new EventSource('http://localhost:3333/messages/sse/bd56e56d-38c6-4391-938f-a86f4f4afe8f');
        function getRealtimeData(event: MessageEvent) {
            try {
                const data = JSON.parse(event.data);
                // Certifique-se de que data.data seja um array antes de chamar map
                if (Array.isArray(data.data)) {
                    setMessages(data.data);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error('Erro ao parsear dados SSE:', error);
            }
        }

        sse.onmessage = getRealtimeData;
        sse.onerror = () => {
            // Tratar erro aqui
            sse.close();
        };

        return () => {
            sse.close();
        };
    }, []);
    function handleSendMessage() {
    }
    return (
        <div>
            <h1>WebSocket Example</h1>
            <div>
                {!isLoading && <ul>
                    {messages.map((message, index) => (
                        <li key={index}>{message.content}</li>
                    ))}
                </ul>}
            </div>
            <div>
                <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Enviar</button>
            </div>
        </div>
    );
};

export default App;
