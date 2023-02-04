import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import "amazon-cognito-identity-js";
import { AuthProvider } from "../../../libs/auth/auth_provider/auth_provider";
import { CognitoAuthProvider } from "../../../libs/auth/auth_provider/cognito/cognito_auth_provider";
import {
  NotAuthorizedException,
  UserNotConfirmedException,
} from "../../../libs/auth/auth_provider/erros";
import { useState } from "react";

export default function LoginPage() {
  const authProvider: AuthProvider = new CognitoAuthProvider();
  const [username, setUsername] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  const handleLogin = async ({ username, password }: any) => {
    try {
      const session = await authProvider.signIn({ username, password });

      if (session) {
        authProvider.setUserSession(session);
      }
    } catch (e: any) {
      if (e instanceof UserNotConfirmedException) {
        await handleConfirmationError({ username });
      }

      if (e instanceof NotAuthorizedException) {
        console.log(e.message);
      }
    }
  };

  const handleConfirmationError = async ({ username }: any) => {
    await authProvider.sendConfirmationCode(username);
    navigate(`/verify-email?username=${username}`);
  };

  const handleForgotPassword = async () => {
    navigate(`/reset-password?username=${username}`);
  };

  return (
    <>
      <Flex
        minH={"100vh"}
        align={"center"}
        justify={"center"}
        bg={useColorModeValue("gray.50", "gray.800")}
      >
        <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
          <Stack align={"center"}>
            <Heading fontSize={"4xl"}>Sign in to your account</Heading>
            <Text fontSize={"lg"} color={"gray.600"}>
              to enjoy all of our cool <Link color={"blue.400"}>features</Link>{" "}
              ✌️
            </Text>
          </Stack>
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <form
                onSubmit={handleSubmit((data: any) => {
                  handleLogin({ ...data });
                })}
              >
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <Input
                    id="username"
                    type="text"
                    {...register("username", { required: true })}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </FormControl>
                <FormControl mt={2}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    id="password"
                    type="password"
                    {...register("password", { required: true })}
                  />
                </FormControl>
                <Stack spacing={10} mt={2}>
                  <Stack
                    direction={{ base: "column", sm: "row" }}
                    align={"start"}
                    justify={"space-between"}
                  >
                    <Checkbox {...register("rememberMe")}>Remember me</Checkbox>
                    <Link color={"blue.400"} onClick={handleForgotPassword}>
                      Forgot password?
                    </Link>
                  </Stack>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                  >
                    Sign in
                  </Button>
                </Stack>
              </form>
            </Stack>
          </Box>
        </Stack>
      </Flex>
    </>
  );
}
