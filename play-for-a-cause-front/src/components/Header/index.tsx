import { Box, HStack, Heading } from "@chakra-ui/react";
import { IoIosChatboxes } from "react-icons/io";
export function Header() {
    return (
        <Box p={1} backgroundColor={"yellow.400"}>
            <HStack color={"gray.900"} justify={"center"}>
                <Heading>ChatPlay</Heading>
                <IoIosChatboxes size="3rem" />
            </HStack>

        </Box>
    )
}