import { ChatDto } from '@/Types/ChatDto';
import { ChatMessageDto } from '@/Types/ChatMessageDto';
import { UserDto } from '@/Types/UserDto';
import { LongChat } from '@/components/Chat/LongChat';
import { ModalNewChat } from '@/components/Chat/NewChatModal';
import { ShortChatCard } from '@/components/Chat/SmallChat';
import { Header } from '@/components/Header';
import { AuthContext } from '@/contexts/AuthContext';
import { ApiBaseUrl, api } from '@/services/api';
import { AppError } from '@/utils/AppError';
import { Box, Button, Flex, Grid, GridItem, HStack, Heading, IconButton, Input, InputGroup, InputRightElement, useDisclosure, useToast, Text, useBreakpointValue } from '@chakra-ui/react';
import React, { memo, useContext, useEffect, useState } from 'react';
import { IoMdAddCircleOutline } from "react-icons/io";
import { MdSend } from 'react-icons/md';
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
import MessageDrawer from '@/components/Chat/LongChatDrawer';
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
export const cssScrollBar = {
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
}
export default function Chat() {
    const [isLoading, setIsLoading] = useState(false);
    const [chatSelectedPage, setChatSelectedPage] = useState(1);
    const [chatTotalNumberOfPage, setChatTotalNumberOfPage] = useState(1);
    const [localChats, setLocalChats] = useState<ChatsWithLastMessageDetailed[]>()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { isOpen: isOpenDrawer, onOpen: onOpenDrawer, onClose: onCloseDrawer } = useDisclosure()
    const { user } = useContext(AuthContext)
    const [selectedChat, setSelectedChat] = useState<ChatsWithLastMessageDetailed>()
    const [sse, setSSE] = useState<EventSource | null>(null);
    const toast = useToast()
    const size = useBreakpointValue({
        base: 'small',
        md: 'medium',
        lg: 'large',
    })
    async function fetchUserChats() {
        if (sse) {
            sse.close();
        }
        const newSSE = new EventSource(`${ApiBaseUrl}chats/sse?userId=${user?.id}&page=${chatSelectedPage}`);
        setSSE(newSSE)
        async function getRealtimeData(event: MessageEvent) {
            const chatDetailed: ChatsWithLastMessageDetailed[] = []
            try {
                const data = JSON.parse(event.data);
                const chats: ChatDto[] = data.data.chats
                setChatTotalNumberOfPage(data.data.totalPages)
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
                setLocalChats(chatDetailed);
                setIsLoading(false);
            }
        }
        newSSE.onmessage = getRealtimeData;
        newSSE.onerror = () => {
            newSSE.close();
        };
        return () => {
            newSSE.close();
        };
    }
    useEffect(() => {
        fetchUserChats()
        return () => {
            if (sse) {
                sse.close();
            }
        };
    }, [chatSelectedPage]);
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
                    rowSpan={{ base: 10, md: 10 }}
                    colSpan={{ base: 10, md: 1 }}
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
                    <Flex mt={4} justify={"space-evenly"}>
                        <IconButton
                            color="gray.100"
                            fontSize="28"
                            variant="unstyled"
                            onClick={() => setChatSelectedPage((prevPage) => Math.max(1, prevPage - 1))}
                            mr={"auto"}
                            _hover={{
                                color: 'yellow.500',
                            }} aria-label="Users info" icon={<FaArrowLeft />} >
                        </IconButton>
                        <Text textAlign={"center"} fontSize={"2xl"} color={"yellow.400"}>Pagina: {chatSelectedPage}</Text>
                        <IconButton
                            color="gray.100"
                            fontSize="28"
                            variant="unstyled"
                            onClick={() => {
                                if (chatSelectedPage < chatTotalNumberOfPage) {
                                    setChatSelectedPage((prevPage) => Math.max(1, prevPage + 1))
                                }

                            }}
                            ml="auto"
                            _hover={{
                                color: 'yellow.500',
                            }} aria-label="Users info" icon={<FaArrowRight />} >
                        </IconButton>
                    </Flex>

                    <Flex direction={"column"} p={2} mt={6}
                        css={cssScrollBar}
                        h={"80%"}
                        overflowY="auto">
                        {localChats?.map((chat, index) => (
                            <MemoizedShortChatCard
                                key={index}
                                author={chat.lastMessage ? new Date(chat.lastMessage.createdAt).toLocaleString() : ""}
                                name={chat.name}
                                message={chat.lastMessage ? chat.lastMessage.content : "Mande a primeira mensagem!"}
                                onClick={() => {
                                    setSelectedChat(chat)
                                    onOpenDrawer()
                                }}
                            />
                        ))}
                    </Flex>
                </GridItem>
                {size !== "small" && selectedChat &&
                    <GridItem
                        rowSpan={{ base: 4, md: 10 }}
                        colSpan={{ base: 10, md: 4 }}
                        bg="gray.800"
                        p={6}
                        borderRadius={'md'}
                    >
                        <MemoizedLongChatCard chat={selectedChat} />
                    </GridItem>
                }
                {size === "small" && selectedChat &&
                    <MessageDrawer chat={selectedChat} isOpen={isOpenDrawer} onClose={onCloseDrawer} />
                }


            </Grid>
            <ModalNewChat
                isOpen={isOpen}
                onClose={onClose}
            />
        </Box>
    );
};
