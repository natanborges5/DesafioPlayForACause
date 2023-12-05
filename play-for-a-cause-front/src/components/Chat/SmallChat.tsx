import { Box, Divider, Text, VStack } from '@chakra-ui/react'

type ShortEmailCardProps = {
    name: string
    message: string
    author: string
    onClick: () => void
}
export function ShortChatCard({
    name,
    message,
    author,
    onClick,
}: ShortEmailCardProps) {
    return (
        <Box
            minWidth={{ base: "200px", md: "auto" }}
            minH={{ base: "200px", md: "auto" }}
            mr={{ base: 2, md: 0 }}
            onClick={onClick}
            cursor={'pointer'}
            bg="gray.900"
            border={'1px solid'}
            borderRadius={'xl'}
            borderColor={'yellow.400'}
            py={{ base: 4, md: 6 }}
            px={3}
            mb={4}
            _hover={{
                transform: 'scale(1.03)',
                borderWidth: '2px',
            }}
            transition={'transform 0.5s'}
        >
            <VStack textAlign={'left'} align={'start'}>
                <Text fontSize={{ base: 'xl', md: 'lg' }} fontWeight={'bold'}>
                    {name}
                </Text>
                <Divider borderColor={'yellow.400'} />
                <Text
                    fontSize={{ base: 'lg', md: 'md' }}
                    fontWeight={'bold'}
                    color={'yellow.400'}
                    noOfLines={3}
                    maxInlineSize={"250px"}
                >
                    {message}
                </Text>
                <Text fontSize={{ base: 'md', md: 'sm' }} noOfLines={2}>
                    {author}
                </Text>
            </VStack>
        </Box>
    )
}
