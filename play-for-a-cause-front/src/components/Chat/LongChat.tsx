import { ChatMessageDto } from '@/Types/ChatMessageDto'
import { Box, Button, Center, Flex, Grid, GridItem, IconButton, Input, InputGroup, InputRightElement, Spacer, Spinner, Text, useDisclosure, useToast } from '@chakra-ui/react'
import { useEffect, useState, useContext } from 'react'
import { MessageBox } from './Message';
import { AuthContext } from '@/contexts/AuthContext';
import React from 'react';
import { AppError } from '@/utils/AppError';
import { ChatsWithLastMessageDetailed, cssScrollBar } from '@/pages/chat';
import { UserDto } from '@/Types/UserDto';
import { FaUsers } from "react-icons/fa";
import { UsersOnChatsModal } from '../Users';
import { ApiBaseUrl, api } from '@/services/api';
import { MdSend } from 'react-icons/md';
type ApiResponse = {
    messages: ChatMessageDto[];
    totalPages: number;
};
type NewMessageProps = {
    authorId: string
    chatId: string
    content: string
}
export function LongChat({ chat }: { chat: ChatsWithLastMessageDetailed }) {
    const [messages, setMessages] = useState<ChatMessageDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [chatMessagePage, setChatMessagePage] = useState(2)
    const [chatMessageTotalNumberOfPages, setChatMessageTotalNumberOfPages] = useState(0)
    const [usersOnChat, setUsersOnChat] = useState<UserDto[]>([])
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user } = useContext(AuthContext)
    const toast = useToast()
    const [messageContent, setMessageContent] = React.useState('')
    useEffect(() => {
        setIsLoading(true);
        getUsersDetails()
        setMessages([])
        const sse = new EventSource(`${ApiBaseUrl}messages/sse/${chat.id}?page=1`);
        sse.onmessage = getRealtimeData;
        sse.onerror = () => {
            sse.close();
        };

        return () => {
            sse.close();
        };
    }, [chat]);
    function getRealtimeData(event: MessageEvent) {
        try {
            const data: ApiResponse = JSON.parse(event.data).data;
            setChatMessageTotalNumberOfPages(data.totalPages)
            setMessages((prevMessages) => {
                const newMessages = data.messages.filter((newMessage) => {
                    return !prevMessages.some((prevMessage) => prevMessage.id === newMessage.id);
                });
                if (newMessages.length > 0) {
                    setIsLoading(false);
                    return [...newMessages, ...prevMessages,];
                }
                return prevMessages;
            });

        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError
                ? error.message
                : 'Não foi possível criar atualizar as mensagens. Tente novamente mais tarde.'
            toast({
                title,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        } finally {
            setIsLoading(false);
        }
    }
    async function getRealOldMessagesData() {
        try {
            const response = await api.get(`/messages?chatId=${chat.id}&page=${chatMessagePage}`)
            const data: ApiResponse = response.data
            setMessages((prevMessages) => {
                const newMessages = data.messages.filter((newMessage) => {
                    return !prevMessages.some((prevMessage) => prevMessage.id === newMessage.id);
                });
                if (newMessages.length > 0) {
                    setIsLoading(false);
                    return [...prevMessages, ...newMessages,];
                }
                return prevMessages;
            });

        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError
                ? error.message
                : 'Não foi possível carregar as mensagens antigas. Tente novamente mais tarde.'
            toast({
                title,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        } finally {
            setIsLoading(false);
        }
    }

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
    async function loadPreviousMessages() {
        setChatMessagePage((prev) => prev + 1);
        await getRealOldMessagesData()
    }
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
    const handleKeyDown = (event: { key: string; preventDefault: () => void; }) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Evita quebra de linha no input
            sendMessage();
        }
    };
    return (
        <>
            {isLoading ? <Center h={"70vh"}><Spinner size={"lg"} /></Center> : <Grid
                h="100%"
                templateRows='repeat(20, 1fr)'
                templateColumns='repeat(5, 1fr)'
                gap={2}
            >
                <GridItem
                    rowSpan={{ base: 2, md: 2 }}
                    colSpan={{ base: 5, md: 5 }}
                >
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
                </GridItem>
                <GridItem
                    overflowY="auto"
                    css={cssScrollBar}
                    p={2}
                    rowSpan={{ base: 14, md: 16 }}
                    colSpan={{ base: 5, md: 5 }}
                >
                    {messages.length > 0 ? (
                        messages.map((message, index) => {
                            const authorUser = usersOnChat.find((user) => user.id === message.authorId);
                            const authorName = authorUser ? authorUser.name : 'Unknown User';
                            return (
                                <MessageBox
                                    key={message.id}
                                    author={authorName}
                                    content={message.content}
                                    date={message.createdAt}
                                    variant={user?.id === message.authorId}
                                    lastItem={messages.length === index + 1 && messages.length === 20 && chatMessageTotalNumberOfPages !== chatMessagePage - 1}
                                    loadPreviousMessage={loadPreviousMessages}
                                />
                            );
                        })
                    ) : (
                        <Text>Nenhuma mensagem enviada.</Text>
                    )}
                </GridItem>
                <GridItem
                    rowSpan={{ base: 5, md: 2 }}
                    colSpan={{ base: 5, md: 5 }}
                >
                    <InputGroup size='lg' mt={"auto"}>
                        <Input
                            pr='4.5rem'
                            placeholder='Digite a sua mensagem'
                            borderColor={"yellow.400"}
                            focusBorderColor='yellow.400'
                            value={messageContent}
                            onChange={(event) => setMessageContent(event.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <InputRightElement width='4.5rem'>
                            <Button backgroundColor={"yellow.400"} h='1.75rem' size='sm' onClick={sendMessage}>
                                <MdSend />
                            </Button>
                        </InputRightElement>
                    </InputGroup>
                </GridItem>

                <UsersOnChatsModal
                    isOpen={isOpen}
                    onClose={onClose}
                    users={usersOnChat}
                />
            </Grid>}
        </>
    )
}
