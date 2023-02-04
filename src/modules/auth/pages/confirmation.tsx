import { Center, Heading, Link } from "@chakra-ui/react";
import {
  Button,
  FormControl,
  Flex,
  Stack,
  useColorModeValue,
  HStack,
  Text,
} from "@chakra-ui/react";
import { PinInput, PinInputField } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { AuthProvider } from "../../../libs/auth/auth_provider/auth_provider";
import { CognitoAuthProvider } from "../../../libs/auth/auth_provider/cognito/cognito_auth_provider";

export default function VerifyEmailPage() {
  const authProvider: AuthProvider = new CognitoAuthProvider();

  const [searchParams] = useSearchParams();
  const username = searchParams.get("username");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const handleVerify = async ({ username, code }: any) => {
    await authProvider.confirmSignUp(username, code);
  };

  const sendCodeAgain = async ({ username }: any) => {
    await authProvider.sendConfirmationCode(username);
  };

  return (
    <form
      onSubmit={handleSubmit((data: any) => {
        const code = Object.values(data).join("");
        handleVerify({ code, username });
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
          maxW={"sm"}
          bg={useColorModeValue("white", "gray.700")}
          rounded={"xl"}
          boxShadow={"lg"}
          p={6}
          my={10}
        >
          <Center>
            <Heading lineHeight={1.1} fontSize={{ base: "2xl", md: "3xl" }}>
              Verify your Email
            </Heading>
          </Center>
          <Center
            fontSize={{ base: "sm", sm: "md" }}
            color={useColorModeValue("gray.800", "gray.400")}
          >
            <Text textAlign="center">
              We have sent code to email registered in your account{" "}
            </Text>
          </Center>
          <Center
            fontSize={{ base: "sm", sm: "md" }}
            fontWeight="bold"
            color={useColorModeValue("gray.800", "gray.400")}
          >
            {username ?? "missing param"}
          </Center>
          <FormControl>
            <Center>
              <HStack>
                <PinInput>
                  <PinInputField {...register("f1", { required: true })} />
                  <PinInputField {...register("f2", { required: true })} />
                  <PinInputField {...register("f3", { required: true })} />
                  <PinInputField {...register("f4", { required: true })} />
                  <PinInputField {...register("f5", { required: true })} />
                  <PinInputField {...register("f6", { required: true })} />
                </PinInput>
              </HStack>
            </Center>
          </FormControl>
          <Stack spacing={6}>
            <Button
              type="submit"
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
            >
              Verify
            </Button>
          </Stack>
          <Center>
            <Link
              color={"blue.400"}
              onClick={() => sendCodeAgain({ username })}
            >
              Resend code
            </Link>
          </Center>
        </Stack>
      </Flex>
    </form>
  );
}
