import {
    FormControl,
    FormLabel,
    Input as ChakraInput,
    InputProps as ChakraInputProps
} from "@chakra-ui/react";
import {forwardRef, ForwardRefRenderFunction} from "react";

interface InputProps extends ChakraInputProps {
    pk: string;
    label?: string;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = ({
                                                                               pk,
                                                                               label,
                                                                               ...rest
                                                                           }: InputProps, ref) => {

    return (
        <FormControl mt={5}>
            {!!label && <FormLabel htmlFor={pk}>{label}</FormLabel>}
            <ChakraInput
                id={pk}
                name={pk}
                focusBorderColor="yellow.500"
                bgColor="gray.900"
                variant="filled"
                _hover={{
                    bgColor: 'gray.900'
                }}
                size="lg"
                ref={ref}
                {...rest}
            />
        </FormControl>
    );
}

export const Input = forwardRef(InputBase);