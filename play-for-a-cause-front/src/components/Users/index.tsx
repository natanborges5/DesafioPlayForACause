import { UserDto } from "@/Types/UserDto";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, Text } from "@chakra-ui/react";
interface UsersOnChatModalProps {
    isOpen: boolean
    onClose: () => void
    users: UserDto[]
}
export function UsersOnChatsModal({ isOpen, onClose, users }: UsersOnChatModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent backgroundColor={'gray.800'}>
                <ModalHeader textAlign={'center'} color={'yellow.400'}>
                    Usuarios no chat
                </ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    {users.map((user, index) => (
                        <Text>{index + 1} - {user.email}</Text>
                    ))}
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}