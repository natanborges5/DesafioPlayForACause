import { ChatDto } from '@/Types/ChatDto';
import { ChatMessageDto } from '@/Types/ChatMessageDto'
import { Box, Button, Center, Flex, IconButton, Spacer, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { useEffect, useState, useContext } from 'react'
import { MessageBox } from './Message';
import { AuthContext } from '@/contexts/AuthContext';
import React from 'react';
import { AppError } from '@/utils/AppError';
import { ChatsWithLastMessageDetailed } from '@/pages/chat';
import { UserDto } from '@/Types/UserDto';
import { FaUsers } from "react-icons/fa";
import { UsersOnChatsModal } from '../Users';
import { api } from '@/services/api';
export function LongChat({ chat }: { chat: ChatsWithLastMessageDetailed }) {
    const [messages, setMessages] = useState<ChatMessageDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [usersOnChat, setUsersOnChat] = useState<UserDto[]>([])
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user } = useContext(AuthContext)
    const toast = useToast()
    useEffect(() => {
        setIsLoading(true);
        getUsersDetails()
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
    async function getUsersDetails() {
        const newUsersOnChat: UserDto[] = []
        try {
            setIsLoading(true);
            for (const user of chat.users) {
                const response = await api.get(`/accounts/id/${user}`)
                newUsersOnChat.push(response.data.user)
            }
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError
                ? error.message
                : 'Não foi possível carregar os usuarios. Tente novamente mais tarde.'
            toast({
                title,
                status: 'error',
                duration: 6000,
                isClosable: true,
            })
        } finally {
            setUsersOnChat(newUsersOnChat)
            setIsLoading(true);
        }
    }
    return (
        <Box>
            {isLoading ? <Center h={"70vh"}><Spinner size={"lg"} /></Center> :
                <Box>
                    <Flex alignItems={"center"} align={"center"} justify={"center"}>
                        <Text
                            fontSize={{ base: '2xl', md: '2xl' }}
                            color={'yellow.400'}
                            fontWeight={'bold'}
                            mb={4}
                        >
                            {chat.name.toUpperCase()}
                        </Text>
                        <Spacer />
                        <IconButton
                            color="gray.100"
                            fontSize="32"
                            variant="unstyled"
                            onClick={onOpen}
                            _hover={{
                                color: 'yellow.500',
                            }} aria-label="Users info" icon={<FaUsers />} >

                        </IconButton>
                    </Flex>

                    {messages.map((message) => {
                        const authorUser = usersOnChat.find((user) => user.id === message.authorId);
                        const authorName = authorUser ? authorUser.name : 'Unknown User';

                        return (
                            <MessageBox
                                key={message.id}
                                author={authorName}
                                content={message.content}
                                date={message.createdAt}
                                variant={user?.id === message.authorId}
                            />
                        );
                    })}
                </Box>
            }
            <UsersOnChatsModal
                isOpen={isOpen}
                onClose={onClose}
                users={usersOnChat}
            />
        </Box>

    )
}
