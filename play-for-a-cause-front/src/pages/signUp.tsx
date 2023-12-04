import { Input } from "@/components/Form/Input";
import { api } from "@/services/api";
import { AppError } from "@/utils/AppError";
import { Button, Flex, HStack, Heading, Link, useToast, Text } from "@chakra-ui/react";
import Router from 'next/router'
import { SubmitHandler, useForm } from "react-hook-form";
import { IoIosChatboxes } from "react-icons/io";

type FormState = {
    name: string
    email: string;
    password: string;
};

export default function SignUp() {

    const { register, handleSubmit, formState } = useForm<FormState>();
    const toast = useToast()
    const handleLogin: SubmitHandler<FormState> = async (values) => {
        try {
            const response = await api.post("/accounts", {
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
            Router.push('/chat')
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
        <Flex
            w="100vw"
            h="100vh"
            alignItems="Center"
            justify="center"
        >
            <Flex
                as="form"
                width="100%"
                maxWidth={360}
                bg="gray.800"
                p="8"
                borderRadius={8}
                flexDir="column"
                onSubmit={handleSubmit(handleLogin)}
            >
                <HStack color={"white.400"} justify={"center"}>
                    <Heading>ChatPlay</Heading>
                    <IoIosChatboxes size="3rem" />
                </HStack>
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
                <Link mt={4} textAlign={"center"} color={"yellow.400"} href="/">Voltar ao login</Link>
            </Flex>
        </Flex>
    )
}
