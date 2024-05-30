import { createBrowserRouter, } from "react-router-dom";
import DiaryMain from "./components/diary/diaryMain";
import CalenderMain from "./components/calender/CalenderMain";
import Root from './components/Root';
import Main from './components/module/Main';
import Calender from './components/calender/Calender';
import Diet from './components/diet/diet';
import Body from './components/module/Body';
import CreateFoodForm from './components/diet/createFoodForm';
import CreateFoodCategoryForm from './components/diet/createFoodCategoryForm';
import Root from "./components/Root";
import Main from "./components/module/Main";
import Body from "./components/module/Body";
import Calender from "./components/calender/Calender";
import Diary from "./components/diary/diary";
import FriendSection from "./components/friend/FriendSection";
import SearchSection from "./components/search/SearchSection";
import ExerciseList from "./components/search/ExerciseList";
import ExerciseDetail from "./components/exercise/ExerciseDetail";
import ExerciseEdit from "./components/exercise/ExerciseEdit";
import FeedList from "./components/feed/feedList";
import FeedDetail from "./components/feed/feedDetail";
const router = createBrowserRouter(
	[
		{
			path: '/',
			element: <Root />,
			children: [
				{
					path: '',
					element: <Main />,
				},
			],
			errorElement: (
				<>
					<h4>오류입니다~</h4>
				</>
			),
		},
		{
			paht: '/user',
			element: <Root />,
			children: [
				{
					path: '/calender',
					element: <Calender />,
				},
				{
					path: '/diary',
					element: <Diary />,
				},
			],
		},
		{
			path: "/search",
			element: <Root />,
			children: [
				{
					path: "/search",
					element: <Body children={<SearchSection />} />
				},
			]
		},
		{
			path: "/friends",
			element: <Root />,
			children: [
				{
					path: "/friends",
					element: <Body children={<FriendSection />} />
				},
			]
		},
		{
			path: "/exercises",
			element: <Root />,
			children: [
				{
					path: "/exercises",
					element: <Body children={<ExerciseList />} />
				},
				{
					path: "/exercises/:index",
					element: <Body children={<ExerciseDetail />} />
				},
				{
					path: "/exercises/edit/:index",
					element: <Body children={<ExerciseEdit />} />
				},
			]
		},
		{
			path: '/diet',
			element: <Root />,
			children: [
				{
					path: '/diet',
					element: <Body children={<Diet />} />,
				},
				{
					path: '/diet/createFood',
					element: <Body children={<CreateFoodForm />} />,
				},
				{
					path: '/diet/createFoodCategory',
					element: <Body children={<CreateFoodCategoryForm />} />,
				},
			],
		},
		{
        path: "/feed",
        element : <Root/>,
        children: [
            {
                path:"/feed",
                element:<FeedList/>
            },
            {
                path:"/feed/:feedIndex",
                element:<FeedDetail/>
            }
        ]
    }
	],
	{
		basename: "/gymunity/v1"
	}
);
export default router;
