import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AbsoluteCenter, Box, Button, Center, Flex, Grid, Heading, Text } from "@chakra-ui/react";
import Context from "../../Context";
import ListSection from "../search/ListSection";
import LoadingSpinner from "../chakra/LoadingSpinner";
import Sort from "../../utils/sort";
import Toast from "../chakra/Toast";
import Feed from "./Feed";


const FeedList = ({ searchQuery, isDescOrder, isTotalSearch }) => {
    const [feeds, setFeeds] = useState([]);
    let [pageNumber, setPageNumber] = useState(0);
    const [isFetching, setIsFetching] = useState(true);
    const { isLoggedIn, sessionUser } = useContext(Context);
    const navigate = useNavigate();
    
    const fetchFeeds = () => {
        let params = searchQuery ?
            `command=feedReadByQuery&query=${searchQuery}` :
            `command=feedCurrentPage`;

        params += `&pageNumber=${pageNumber}`;

        console.log(params)

        fetch(`${process.env.REACT_APP_SERVER_URL}/feed?${params}`, {
            method: "GET", 
            headers: {
                "Authorization": sessionUser.code, 
            },
        })
        .then(response => response.json())
        .then(data => 
            {setFeeds(data)

        })
        .catch(() => Toast.showFailed("피드 목록 로드 실패"))
        .finally(() => {
            setIsFetching(false);
        });
    };

    const fetchFeedsAfterPageClick = () => {
        let params = searchQuery ?
            `command=feedReadByQuery&query=${searchQuery}` :
            `command=feedRead`;

        
            params += `&pageNumber=${pageNumber}`;

        console.log(params)

        fetch(`${process.env.REACT_APP_SERVER_URL}/feed?${params}`, {
            method: "GET", 
            headers: {
                "Authorization": sessionUser.code, 
            },
        })
        .then(response => response.json())
        .then(data => 
            {setFeeds([...feeds, ...data] )

        })
        .catch(() => Toast.showFailed("피드 목록 로드 실패"))
        .finally(() => {
            setIsFetching(false);
        });
    };

    const fetchLikeButtonOnClick = (feedIndex, checkFavorite) => { 
        const params = `command=${checkFavorite ? "feedFavoriteDelete" : "feedFavoritePlus"}`;

        fetch(`${process.env.REACT_APP_SERVER_URL}/feed/${feedIndex}?${params}`, {
            method: "GET", 
            headers: {
                "Authorization": sessionUser.code, 
            },
        })
        .catch(() => Toast.showFailed("좋아요 처리 실패"))
        .finally(() => {
            fetchFeeds();
        });
    };

    const handleLikeButtonOnClick = (feedIndex, checkFavorite) => {
        console.log(feedIndex, checkFavorite)
        if (!isLoggedIn) {
            Toast.showInfo("로그인이 필요합니다");
            return;
        }

        fetchLikeButtonOnClick(feedIndex, checkFavorite);
    };

    const sortFeeds = () => {
        if (isDescOrder)
            setFeeds(Sort.ObjectArrayInDescOrder(feeds, "createDate"));
        else
            setFeeds(Sort.ObjectArrayInAsecOrder(feeds, "createDate"));
    };

    const addItemLimit =() => {
        setPageNumber(pageNumber++)
    }

    const feedCreateButton = () => {
        if(!isLoggedIn) {
            Toast.showFailed("로그인 후 이용가능")
            return
        }
        navigate("/feed/feedCreate")
    }


    useEffect(() => {
        fetchFeedsAfterPageClick();
    }, [pageNumber]);


    return (
        <ListSection>
            <Heading textAlign="center">피드목록</Heading>
            { isFetching ?
                <Center>
                    <LoadingSpinner />
                </Center>
                :
                <Flex direction="column" gap="10px">
                    <Flex direction="row-reverse">
                    <Button w="fitcontent" colorScheme="blue" onClick={feedCreateButton}>피드작성</Button>
                    
                    </Flex>

                    <Center>
                    <Grid  w="50%" templateColumns="repeat(1, 1fr)" gap="30px" justifyContent="center" >
                        { feeds.map(feed =>
                            <Feed key={feed.feedIndex} feed={feed} handleLikeButtonOnClick={handleLikeButtonOnClick} />
                        )}
                    </Grid> 
                    </Center>
                    { isTotalSearch && (feeds.length >= pageNumber) &&
                    <Flex justify="right">
                        <Button onClick={() => navigate("/search", { state: { searchQuery: searchQuery, category: "feed" }})} >
                            게시글 더보기
                        </Button>
                    </Flex>
                    }
                </Flex>
            }
            <Button onClick={()=> addItemLimit()}>다음</Button>
        </ListSection>
    );
};

export default FeedList;