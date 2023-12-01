import { ChatDto } from '@/Types/ChatDto';
import { ShortChatCard } from '@/components/Chat/SmallChat';
import { AuthContext } from '@/contexts/AuthContext';
import { api } from '@/services/api';
import { AppError } from '@/utils/AppError';
import { Box, Flex, Grid, GridItem, useDisclosure } from '@chakra-ui/react';
import React, { memo, useContext, useEffect, useState } from 'react';

export interface ChatMessage {
    chatId: string;
    content: string;
    authorId: string;
    createdAt: Date;
    updatedAt?: Date | null;
}
const MemoizedShortChatCard = memo(ShortChatCard)
export default function Chat() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [localChats, setLocalChats] = useState<ChatDto[]>()
    const { isOpen, onOpen, onClose } = useDisclosure()
    const { user } = useContext(AuthContext)
    const [selectedChat, setSelectedChat] = useState<ChatDto>({
        users: [],
        name: '',
        createdAt: '',
        updatedAt: '',
    })

    async function fetchUserChats() {
        try {
            setIsLoading(true);
            const response = await api.get("/chats/user", {
                params:
                {
                    page: 1,
                    userId: user?.id
                }
            })
            setLocalChats(response.data.chats)
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError
                ? error.message
                : 'Não foi possível atualizar. Tente novamente mais tarde.'
            throw new AppError(title)
        }
    }
    function handleChatClick(chat: ChatDto, onOpen: () => void) {
        setSelectedChat(chat)
        onOpen()
    }
    useEffect(() => {
        fetchUserChats()
    }, []);
    return (
        <Box>
            <Grid
                h="100vh"
                templateRows='repeat(2, 1fr)'
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
                    rowSpan={{ base: 2, md: 2 }}
                    colSpan={{ base: 1, md: 1 }}
                    w={'auto'}
                    overflowY="auto"
                    bg="gray.800"
                    borderRadius={'md'}
                    p={4}
                >
                    <Box mt={6}>
                        {localChats?.map((chat, index) => (
                            <MemoizedShortChatCard
                                key={index}
                                author={chat.name}
                                name={chat.name}
                                message={chat.name}
                                onClick={() => handleChatClick(chat, onOpen)}
                            />
                        ))}
                    </Box>
                </GridItem>
                <GridItem colSpan={4} rowSpan={2} bg='tomato' />
            </Grid>
        </Box>
    );
};
