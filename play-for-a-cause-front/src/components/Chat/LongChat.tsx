import { ChatDto } from '@/Types/ChatDto';
import { ChatMessageDto } from '@/Types/ChatMessageDto'
import { Box, Center, Spinner, Text, useToast } from '@chakra-ui/react'
import { useEffect, useState, useContext } from 'react'
import { MessageBox } from './Message';
import { AuthContext } from '@/contexts/AuthContext';
import React from 'react';
import { AppError } from '@/utils/AppError';

export function LongChat({ chat }: { chat: ChatDto }) {
    const [messages, setMessages] = useState<ChatMessageDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext)
    const toast = useToast()
    useEffect(() => {
        setIsLoading(true);
        const sse = new EventSource(`http://localhost:3333/messages/sse/${chat.id}`);
        function getRealtimeData(event: MessageEvent) {
            try {
                const data = JSON.parse(event.data);
                if (Array.isArray(data.data)) {
                    setMessages(data.data);
                    setIsLoading(false);
                }
            } catch (error) {
                const isAppError = error instanceof AppError
                const title = isAppError
                    ? error.message
                    : 'Não foi possível carregar as mensagens. Tente novamente mais tarde.'
                toast({
                    title,
                    status: 'error',
                    duration: 6000,
                    isClosable: true,
                })
            }
        }
        sse.onmessage = getRealtimeData;
        sse.onerror = () => {
            sse.close();
        };

        return () => {
            sse.close();
        };
    }, [chat]);
    return (
        <Box>
            {isLoading ? <Center h={"70vh"}><Spinner size={"lg"} /></Center> :
                <Box>
                    <Text
                        fontSize={{ base: '2xl', md: '2xl' }}
                        color={'yellow.400'}
                        fontWeight={'bold'}
                        mb={4}
                        textAlign={"center"}
                    >
                        {chat.name.toUpperCase()}
                    </Text>
                    {messages.map((message) => (
                        <MessageBox key={message.id} author={message.authorId} content={message.content} date={message.createdAt} variant={user?.id === message.authorId} />

                    ))}
                </Box>
            }
        </Box>

    )
}
