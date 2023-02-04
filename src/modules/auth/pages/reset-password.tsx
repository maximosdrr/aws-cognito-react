import {
  Button,
  FormControl,
  Flex,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("username") ?? "";

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const handleResetPassword = async (data: any) => {
    console.log(data);
  };

  return (
    <form
      onSubmit={handleSubmit((data: any) => {
        handleResetPassword({ ...data });
      })}
    >
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={12}
        >
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
            Forgot your password?
          </Heading>
          <Text
            fontSize={{ base: "sm", sm: "md" }}
            color={useColorModeValue("gray.800", "gray.400")}
          >
            You'll get an email with a reset link
          </Text>
          <FormControl id="username">
            <Input
              placeholder="username"
              _placeholder={{ color: "gray.500" }}
              defaultValue={username}
              type="text"
              {...register("username", { required: true })}
            />
          </FormControl>
          <Stack spacing={6}>
            <Button
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
            >
              Request Reset
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
