import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, FormControl, FormLabel, Flex, Input, Stack, Heading } from '@chakra-ui/react';
import Context from "../../Context";
import Toast from "../chakra/Toast";

const LoginForm = () => {
    const [id, setId] = useState("");
    const [password, setPassword] = useState("");
    const { isLoggedIn, handleLoginSuccess } = useContext(Context);
    const navigate = useNavigate();

    const sendLogin = async (e) => {
        e.preventDefault();

        const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/user?command=login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                password: password
            })
        });

        if (response.status === 200) {
            const result = await response.json();
            handleLoginSuccess(result.code, id, result.profileImage);
            navigate('/');
        } else {
            Toast.showFailed("로그인 실패");
        }
    };
    const onClickSignUp = () =>{
        navigate("/user/join");
    }
    useEffect(() => {
        if (isLoggedIn)
            navigate("/");
    }, []);

    return (
        <Flex w="100%" p="10px">
            <Stack w="100%">
                <form onSubmit={sendLogin}>
                    <Flex direction="column" gap="50px" justify="center" align="center">
                    <Heading as="h2" size="lg">로그인</Heading>
                    <FormControl>
                        <Flex justify="center">
                            <FormLabel width="100px" fontWeight="bold">아이디</FormLabel>
                            <Input type="text" value={id}
                                onChange={(e) => setId(e.target.value)}
                                width="500px"
                                borderColor="gray.400"
                                _hover={{ borderColor: "gray.400" }}
                                _focus={{
                                    // boxShadow: 'none',
                                    borderColor: "darkgray"
                                }}
                            />
                        </Flex>
                    </FormControl>
                    <FormControl>
                        <Flex justify="center">
                            <FormLabel width="100px" fontWeight="bold">비밀번호</FormLabel>
                            <Input
                                type="password" value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                width="500px"
                                borderColor="gray.400"
                                _hover={{ borderColor: "gray.400" }}
                                _focus={{
                                    // boxShadow: 'none',
                                    borderColor: "darkgray"
                                }}
                            />
                        </Flex>
                    </FormControl>

                    <Flex justify="center" gap="30px">
                        <Button width="120px" colorScheme="green" onClick={sendLogin}>
                            로그인
                        </Button>
                        <Button as="a" width="120px" colorScheme="blue" onClick={onClickSignUp}>
                            회원가입
                        </Button>
                    </Flex>
                    </Flex>
                </form>

            </Stack>
        </Flex>
    );
};

export default LoginForm;