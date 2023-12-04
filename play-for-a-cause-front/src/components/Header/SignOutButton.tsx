import { AuthContext, SignOut } from '@/contexts/AuthContext'
import { HStack, Icon, IconButton } from '@chakra-ui/react'
import { RiLogoutBoxLine, RiUserAddLine } from 'react-icons/ri'
export function SignOutButton() {
    function logOut() {
        SignOut()
    }
    return (
        <IconButton
            aria-label="LogOut"
            icon={<Icon as={RiLogoutBoxLine} />}
            color="gray.900"
            fontSize="32"
            variant="unstyled"
            onClick={logOut}
            mr="2"
            _hover={{
                color: 'white',
            }}
        ></IconButton>
    )
}
