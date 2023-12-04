import { UserDto } from '@/Types/UserDto';
import { api } from '@/services/api';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    VStack,
    useToast,
} from '@chakra-ui/react'
import { AsyncSelect, ChakraStylesConfig } from "chakra-react-select";
import { useContext, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { AuthContext } from '@/contexts/AuthContext';
import { AppError } from '@/utils/AppError';
interface ModalNewChatProps {
    isOpen: boolean
    onClose: () => void
}
type FormState = {
    name: string
    usersIds: string[]
}
interface SelectOption {
    value: string;
    label: string;
}
const chakraStyles: ChakraStylesConfig = {
    option: (provided, state) => ({
        ...provided,
        color: "gray.900"
    }),
};
export function ModalNewChat({ isOpen, onClose }: ModalNewChatProps) {
    const {
        register,
        handleSubmit,
        setValue,
        getValues,
        watch,
    } = useForm<FormState>();
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast()
    const { user } = useContext(AuthContext)
    const loadOptionsForUsers = async (email: string) => {
        try {
            const response = await api.get(`/accounts/${email}`)
            const options: SelectOption[] = response.data.users.map((user: UserDto) => ({
                value: user.id,
                label: `${user.email.toUpperCase()}`,
            }));
            const optionsWithoutUser = options.filter(
                (option) => option.value !== user?.id
            );
            return optionsWithoutUser;
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError
                ? error.message
                : 'Não foi possível carregar os usuarios. Tente novamente mais tarde.'
            toast({
                title,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
            return [];
        }
    };

    const createChat = useMutation(async (values: FormState) => {
        try {
            if (user) values.usersIds.push(user?.id)
            const response = await api.post('/chats', {
                name: values.name,
                usersIds: values.usersIds
            })
            console.log(response.data)
            toast({
                title: 'Chat Criado!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError
                ? error.message
                : 'Não foi possível criar o chat. Tente novamente mais tarde.'
            toast({
                title,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    });
    const handleCreateChat: SubmitHandler<FormState> = async (values) => {
        try {
            setIsLoading(true)
            await createChat.mutateAsync(values);
            onClose()
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError
                ? error.message
                : 'Não foi possível criar o chat. Tente novamente mais tarde.'
            toast({
                title,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
        finally {
            setIsLoading(false)
        }
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent backgroundColor={'gray.800'}>
                <ModalHeader textAlign={'center'} color={'yellow.400'}>
                    Criar Chat
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody as={"form"} onSubmit={handleSubmit(handleCreateChat)}>
                    <FormControl isRequired>
                        <Stack spacing={3}>
                            <FormLabel>Nome do Chat</FormLabel>
                            <Input id='name' {...register('name')} focusBorderColor='yellow.400' placeholder='Descrição' />
                            <FormLabel>
                                Usuarios
                            </FormLabel>
                            <AsyncSelect
                                isMulti
                                {...register('usersIds')}
                                useBasicStyles
                                id="User-select"
                                name="Usuarios"
                                chakraStyles={chakraStyles}
                                loadOptions={loadOptionsForUsers}
                                onChange={(selectedOptions: any) => {
                                    const selectedValues = selectedOptions.map((item: SelectOption) => item.value);
                                    setValue("usersIds", selectedValues);
                                }}
                                isLoading={isLoading}
                                placeholder="Digite o nome"
                                closeMenuOnSelect={true}
                                size="md"
                            />
                            <Button m={6} size={"lg"} colorScheme="yellow" type="submit">
                                Criar
                            </Button>
                        </Stack>
                    </FormControl>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
