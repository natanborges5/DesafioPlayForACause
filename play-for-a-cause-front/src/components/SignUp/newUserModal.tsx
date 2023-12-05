import { UserDto } from '@/Types/UserDto';
import { api } from '@/services/api';
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    HStack,
    Heading,
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
import { IoIosChatboxes } from 'react-icons/io';
import { Input } from '../Form/Input';
interface ModalNewAccounttProps {
    isOpen: boolean
    onClose: () => void
}
type FormState = {
    name: string
    email: string;
    password: string;
};

export function ModalNewAccount({ isOpen, onClose }: ModalNewAccounttProps) {
    const { register, handleSubmit, formState } = useForm<FormState>();
    const toast = useToast()
    const handleCreateAccount: SubmitHandler<FormState> = async (values) => {
        try {
            await api.post("/accounts", {
                name: values.name,
                email: values.email,
                password: values.password
            })
            toast({
                title: 'Conta Criada!',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            onClose()
        } catch (error) {
            const isAppError = error instanceof AppError
            const title = isAppError
                ? error.message
                : 'Não foi possível criar conta. Tente novamente mais tarde.'
            toast({
                title,
                status: 'error',
                duration: 9000,
                isClosable: true,
            })
        }
    }
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent backgroundColor={'gray.800'}>
                <ModalHeader textAlign={'center'} color={'yellow.400'}>
                    <HStack justify={"center"}>
                        <Heading>ChatPlay</Heading>
                        <IoIosChatboxes size="3rem" />
                    </HStack>
                </ModalHeader>
                <ModalCloseButton />

                <ModalBody as={"form"} onSubmit={handleSubmit(handleCreateAccount)}>
                    <FormControl isRequired>
                        <Stack spacing={3}>

                            <Input
                                isRequired
                                label="Nome"
                                pk="name"
                                type="text"
                                {...register('name')}
                            />
                            <Input
                                isRequired
                                label="E-mail"
                                pk="email"
                                type="email"
                                {...register('email')}
                            />

                            <Input
                                isRequired
                                label="Password"
                                pk="password"
                                type="password"
                                {...register('password')}
                            />

                            <Button
                                type="submit"
                                mt="6"
                                colorScheme="yellow"
                                size="lg">
                                Criar conta!
                            </Button>
                        </Stack>
                    </FormControl>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}
