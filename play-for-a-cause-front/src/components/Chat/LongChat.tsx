import { ChatDto } from '@/Types/ChatDto';
import { ChatMessageDto } from '@/Types/ChatMessageDto'
import { Box, Button, Center, Input, InputGroup, InputRightElement, Spinner, Text, useToast } from '@chakra-ui/react'
import { useEffect, useState, useContext } from 'react'
import { MessageBox } from './Message';
import { AuthContext } from '@/contexts/AuthContext';
import { MdSend } from "react-icons/md";
import React from 'react';
import { api } from '@/services/api';
import { AppError } from '@/utils/AppError';
type NewMessageProps = {
    authorId: string
    chatId: string
    content: string
}


export function LongChat({ chat }: { chat: ChatDto }) {
    const [messages, setMessages] = useState<ChatMessageDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useContext(AuthContext)
    const [messageContent, setMessageContent] = React.useState('')
    const toast = useToast()

    async function sendMessage() {
        try {
            if (user) {
                const newMessage: NewMessageProps = {
                    authorId: user?.id,
                    chatId: chat.id,
                    content: messageContent
                }
                await api.post("/messages", newMessage)
            }
            setMessageContent("")
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError
                ? error.message
                : 'Não foi possível enviar a mensagem. Tente novamente mais tarde.'
            toast({
                title,
                status: 'error',
                duration: 6000,
                isClosable: true,
            })
        }
    }
    useEffect(() => {
        setIsLoading(true);
        console.log(chat.id)
        const sse = new EventSource(`http://localhost:3333/messages/sse/${chat.id}`);
        function getRealtimeData(event: MessageEvent) {
            try {
                const data = JSON.parse(event.data);
                //console.log(data)
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
                    >
                        {chat.name}
                    </Text>
                    {messages.map((message) => (
                        <MessageBox key={message.id} author={message.authorId} content={message.content} date={message.createdAt} variant={user?.id === message.authorId} />

                    ))}
                    <InputGroup size='lg'>
                        <Input
                            pr='4.5rem'
                            placeholder='Digite a sua mensagem'
                            borderColor={"yellow.400"}
                            focusBorderColor='yellow.400'
                            value={messageContent}
                            onChange={(event) => setMessageContent(event.target.value)}
                        />
                        <InputRightElement width='4.5rem'>
                            <Button backgroundColor={"yellow.400"} h='1.75rem' size='sm' onClick={sendMessage}>
                                <MdSend />
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </Box>
            }
        </Box>

    )
}
