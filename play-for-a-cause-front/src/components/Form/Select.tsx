import {
    FormControl,
    FormLabel,
    Select as ChakraSelect,
    SelectProps as ChakraSelectProps
} from "@chakra-ui/react";
import {forwardRef, ForwardRefRenderFunction} from "react";

interface SelectProps extends ChakraSelectProps {
    pk: string;
    label?: string;
    options: Array<{ value: string; label: string }>;
}

const SelectBase: ForwardRefRenderFunction<HTMLSelectElement, SelectProps> = (
    {pk, label, options, ...rest}: SelectProps,
    ref
) => {
    return (
        <FormControl color="gray.500" mt={5}>
            {!!label && <FormLabel htmlFor={pk}>{label}</FormLabel>}
            <ChakraSelect
                id={pk}
                name={pk}
                placeholder='-- selecione --'
                focusBorderColor="yellow.500"
                bgColor="gray.900"
                variant="filled"
                _hover={{
                    bgColor: "gray.900"
                }}
                size="lg"
                ref={ref}
                {...rest}
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value} color="gray">
                        {option.label}
                    </option>
                ))}
            </ChakraSelect>
        </FormControl>
    );
};

export const Select = forwardRef(SelectBase);