import { Input } from "@/components/Form/Input";
import { AuthContext } from "@/contexts/AuthContext";
import { Button, Flex, HStack, Heading, Link, Text } from "@chakra-ui/react";
import { useContext } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { IoIosChatboxes } from "react-icons/io";

type FormState = {
    email: string;
    password: string;
};

export default function Home() {

    const { register, handleSubmit, formState } = useForm<FormState>();
    const { signIn } = useContext(AuthContext);

    const handleLogin: SubmitHandler<FormState> = async (values) => {
        await signIn(values);
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
                    Entrar
                </Button>
                <Text mt={4}>Ainda nao possui conta? Clique <Link color={"yellow.400"} href="/signUp">Aqui!</Link></Text>
            </Flex>
        </Flex>
    )
}
