import { Input } from "@/components/Form/Input";
import { Button, Flex, HStack, Heading } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoIosChatboxes } from "react-icons/io";

type FormState = {
    name: string
    email: string;
    password: string;
};

export default function SignUp() {

    const { register, handleSubmit, formState } = useForm<FormState>();

    const handleLogin: SubmitHandler<FormState> = async (values) => {
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
                    label="Nome"
                    pk="name"
                    type="text"
                    {...register('name')}
                />
                <Input
                    label="E-mail"
                    pk="email"
                    type="email"
                    {...register('email')}
                />

                <Input
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
            </Flex>
        </Flex>
    )
}
