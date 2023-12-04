import { Box, Flex, HStack, Heading, SimpleGrid, Spacer } from "@chakra-ui/react";
import { IoIosChatboxes } from "react-icons/io";
import { SignOutButton } from "./SignOutButton";
export function Header() {
    return (
        <Flex p={1} justify={"space-evenly"} backgroundColor={"yellow.400"}>
            <Spacer />
            <HStack color={"gray.900"} justify={"center"}>
                <Heading>ChatPlay</Heading>
                <IoIosChatboxes size="3rem" />
            </HStack>
            <Spacer />
            <SignOutButton />
        </Flex>
    )
}