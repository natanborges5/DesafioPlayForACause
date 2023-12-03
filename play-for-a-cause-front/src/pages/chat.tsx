import { ChatDto } from '@/Types/ChatDto';
import { ChatMessageDto } from '@/Types/ChatMessageDto';
import { UserDto } from '@/Types/UserDto';
import { LongChat } from '@/components/Chat/LongChat';
import { ModalNewChat } from '@/components/Chat/NewChatModal';
import { ShortChatCard } from '@/components/Chat/SmallChat';
import { Header } from '@/components/Header';
import { AuthContext } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { AppError } from '@/utils/AppError';
import { Box, Button, Flex, Grid, GridItem, HStack, Heading, Input, InputGroup, InputRightElement, useDisclosure, useToast } from '@chakra-ui/react';
import React, { memo, useContext, useEffect, useState } from 'react';
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdSend } from 'react-icons/md';
type NewMessageProps = {
    authorId: string
    chatId: string
    content: string
}
export type ChatsWithLastMessageDetailed = {
    id: string
    name: string;
    users: string[];
    lastMessage?: ChatMessageDto
    createdAt: string;
    updatedAt: string;
}
const MemoizedShortChatCard = memo(ShortChatCard)
const MemoizedLongChatCard = memo(LongChat)
export default function Chat() {
    const [isLoading, setIsLoading] = useState(false);
    const [localChats, setLocalChats] = useState<ChatsWithLastMessageDetailed[]>()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user } = useContext(AuthContext)
    const [selectedChat, setSelectedChat] = useState<ChatsWithLastMessageDetailed>()
    const [messageContent, setMessageContent] = React.useState('')

    const toast = useToast()
    async function fetchUserChats() {
        const sse = new EventSource(`http://localhost:3333/chats/sse/${user?.id}`);
        async function getRealtimeData(event: MessageEvent) {
            const chatDetailed: ChatsWithLastMessageDetailed[] = []
            try {
                const data = JSON.parse(event.data);
                if (Array.isArray(data.data)) {
                    const chats: ChatDto[] = data.data
                    for (const chat of chats) {
                        const newChatDetaild: ChatsWithLastMessageDetailed = {
                            ...chat,
                            lastMessage: undefined
                        }
                        if (chat.lastMessage) {
                            const response = await api.get(`/messages/${chat.lastMessage}`)
                            newChatDetaild.lastMessage = response.data.message
                        }
                        chatDetailed.push(newChatDetaild)
                    }
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
            finally {
                console.log(chatDetailed)
                setLocalChats(chatDetailed);
                setIsLoading(false);
            }
        }
        sse.onmessage = getRealtimeData;
        sse.onerror = () => {
            sse.close();
        };

        return () => {
            sse.close();
        };
    }
    async function sendMessage() {
        try {
            if (user && selectedChat) {
                const newMessage: NewMessageProps = {
                    authorId: user?.id,
                    chatId: selectedChat.id,
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
        fetchUserChats()
    }, []);
    return (
        <Box>
            <Header />
            <Grid
                h="100vh"
                templateRows='repeat(10, 1fr)'
                templateColumns='repeat(5, 1fr)'
                gap={4}
            >
                <GridItem
                    css={{
                        '&::-webkit-scrollbar': {
                            width: '0px', // Largura da barra de rolagem
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: 'teal.500', // Cor da alça da barra de rolagem
                            borderRadius: '6px', // Borda arredondada
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: 'teal.700', // Cor da alça ao passar o mouse
                        },
                    }}
                    rowSpan={{ base: 10, md: 10 }}
                    colSpan={{ base: 1, md: 1 }}
                    w={'auto'}
                    overflowY="auto"
                    bg="gray.800"
                    borderRadius={'md'}
                    p={4}
                >
                    <Flex justify={"space-evenly"}>
                        <Heading textAlign={"center"}>Chats</Heading>
                        <Button size={"md"} colorScheme="yellow" onClick={onOpen}>
                            <IoMdAddCircleOutline size="2rem" />
                        </Button>
                    </Flex>

                    <Box mt={6}>
                        {localChats?.map((chat, index) => (
                            <MemoizedShortChatCard
                                key={index}
                                author={chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleString() : ""}
                                name={chat.name}
                                message={chat.lastMessage ? chat.lastMessage.content : "Mande a primeira mensagem!"}
                                onClick={() => { setSelectedChat(chat) }}
                            />
                        ))}
                    </Box>
                </GridItem>
                <GridItem
                    colSpan={4}
                    rowSpan={8}
                    bg="gray.800"
                    p={6}
                    borderRadius={'md'}
                    overflowY="auto"
                    css={{
                        '&::-webkit-scrollbar': {
                            width: '0px', // Largura da barra de rolagem
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: 'teal.500', // Cor da alça da barra de rolagem
                            borderRadius: '6px', // Borda arredondada
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: 'teal.700', // Cor da alça ao passar o mouse
                        },
                    }}
                >
                    {selectedChat && (
                        <MemoizedLongChatCard
                            chat={selectedChat}
                        />
                    )}
                </GridItem>
                <GridItem
                    colSpan={4}
                    rowSpan={2}
                    px={2}
                >
                    {selectedChat && (
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
                    )}
                </GridItem>
            </Grid>
            <ModalNewChat
                isOpen={isOpen}
                onClose={onClose}
            />
        </Box>
    );
};
