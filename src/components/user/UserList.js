import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarGroup, Button, Center, Flex, Grid, Heading, Text, VStack } from "@chakra-ui/react";
import ListSection from "../search/ListSection";
import LoadingSpinner from "../chakra/LoadingSpinner";
import Toast from "../chakra/Toast";
import UserCard from "./UserCard";

const UserList = ({ searchQuery, isTotalSearch }) => {
    const [users, setUsers] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [userLimit] = useState(5);
    const navigate = useNavigate();

    const fetchUsers = () => { 
        let params = searchQuery ?
            `command=read_all_by_query&query=${searchQuery}` :
            `command=read_all`;

        params += `&pageNumber=${pageNumber}`;

        fetch(`${process.env.REACT_APP_SERVER_URL}/user?${params}`)
        .then(response => response.json())
        .then(data => {
            if (pageNumber === 1)
                setUsers(data);
            else
                setUsers([...users, ...data]);
        })
        .catch(() => {
            Toast.showFailed("유저 로드 실패");
        })
        .finally(() => {
            setIsFetching(false);
        });
    };

    const handleNextPageOnClick = () => {
        setPageNumber(pageNumber + 1);
    };

    const showAvatar = () => {
        const avatars = [];

        for (let i = 0; i < users.length; i++)
            avatars.push(<Avatar key={`user_image_${i}`} src="" />);

        return avatars;
    };


    const showUserMoreSection = () => {
        return (
            <Flex justify="right">
                <Button h="100%" p="10px"
                    onClick={() => navigate("/search", { state: { searchQuery: searchQuery, category: "user" }})} >
                    <VStack>
                        <AvatarGroup size="md" max={userLimit}>
                            {showAvatar()}
                        </AvatarGroup>
                        <Text color="gray.600">유저 더보기</Text>
                    </VStack>
                </Button>
            </Flex>
        );
    };

    useEffect(() => {
        setPageNumber(1);
        fetchUsers();
    }, [searchQuery, isTotalSearch]);

    useEffect(() => {
        fetchUsers();
    }, [pageNumber]);

    return (
        <ListSection>
            <Heading textAlign="center">유저목록</Heading>
            { isFetching ?
                <Center><LoadingSpinner /></Center>
                :
                users.length > 0 ? 
                <Flex direction="column" w="100%" gap="10px">
                    <Grid gridTemplateColumns={`repeat(${userLimit}, 1fr)`} w="100%" gap="10px" overflow="hidden">
                        { users.map(user =>
                            <UserCard key={user.code} user={user} />
                        )}
                    </Grid>
                    { isTotalSearch ? 
                        (users.length >= userLimit) && showUserMoreSection()
                        :
                        <Button onClick={handleNextPageOnClick} >
                            더보기
                        </Button>
                    }
                </Flex>
                :
                <Heading textAlign="center" fontSize="20px">유저가 없습니다</Heading>
            }
        </ListSection>
    );
};

export default UserList;