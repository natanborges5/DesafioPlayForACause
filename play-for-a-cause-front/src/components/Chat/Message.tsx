import { Box, Text, VStack } from '@chakra-ui/react'

type MessageBoxProps = {
    variant: boolean
    author: string
    content: string
    date: string
}
export function MessageBox({
    variant,
    author,
    content,
    date,
}: MessageBoxProps) {
    return (
        <Box
            ml={variant ? "auto" : ""}
            bg="gray.900"
            border={'2px solid'}
            borderRadius={'xl'}
            borderColor={variant ? "red.400" : 'yellow.400'}
            py={4}
            px={2}
            mb={3}
            w={"50%"}
            _hover={{
                transform: 'scale(1.01)',
                borderWidth: '2px',
            }}
            transition={'transform 0.5s'}
        >
            <VStack textAlign={'left'} align={'start'}>
                <Text fontSize={{ base: 'md', md: 'sm' }} fontWeight={'bold'}>
                    {author}
                </Text>
                <Text
                    fontSize={{ base: 'xl', md: 'md' }}
                    fontWeight={'bold'}
                    color={'yellow.400'}
                >
                    {content}
                </Text>
                <Text ml={"auto"} fontSize={{ base: 'sm', md: 'xs' }} noOfLines={2}>
                    {new Date(date).toLocaleString()}
                </Text>
            </VStack>
        </Box>
    )
}
