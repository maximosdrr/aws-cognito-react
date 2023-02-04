import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  HStack,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { AuthProvider } from "../../../libs/auth/auth_provider/auth_provider";
import { CognitoAuthProvider } from "../../../libs/auth/auth_provider/cognito/cognito_auth_provider";

export default function RegisterPage() {
  const authProvider: AuthProvider = new CognitoAuthProvider();

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit } = useForm();

  const handleRegister = async ({
    username,
    password,
    firstName,
    lastName,
    email,
  }: any) => {
    try {
      await authProvider.signUp({
        username,
        password,
        firstName,
        lastName,
        email,
      });

      navigate(`/verify-email?username=${username}`);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"} textAlign={"center"}>
            Sign up
          </Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <form
          onSubmit={handleSubmit((data: any) => {
            handleRegister({ ...data });
          })}
        >
          <Box
            rounded={"lg"}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={"lg"}
            p={8}
          >
            <Stack spacing={4}>
              <HStack>
                <Box>
                  <FormControl id="firstName" isRequired>
                    <FormLabel>First Name</FormLabel>
                    <Input
                      type="text"
                      {...register("firstName", { required: true })}
                    />
                  </FormControl>
                </Box>
                <Box>
                  <FormControl id="lastName">
                    <FormLabel>Last Name</FormLabel>
                    <Input
                      type="text"
                      {...register("lastName", { required: true })}
                    />
                  </FormControl>
                </Box>
              </HStack>
              <FormControl id="username" isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  {...register("username", { required: true })}
                />
              </FormControl>
              <FormControl id="username" isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  {...register("email", { required: true })}
                />
              </FormControl>
              <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? "text" : "password"}
                    {...register("password", { required: true })}
                  />
                  <InputRightElement h={"full"}>
                    <Button
                      variant={"ghost"}
                      onClick={() =>
                        setShowPassword((showPassword) => !showPassword)
                      }
                    >
                      {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Stack spacing={10} pt={2}>
                <Button
                  type="submit"
                  loadingText="Submitting"
                  size="lg"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Sign up
                </Button>
              </Stack>
              <Stack pt={6}>
                <Text align={"center"}>
                  Already a user? <Link color={"blue.400"}>Login</Link>
                </Text>
              </Stack>
            </Stack>
          </Box>
        </form>
      </Stack>
    </Flex>
  );
}
