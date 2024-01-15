import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
// import Root from "./routes/root";
import Profile from './pages/profile/Profile';
import Post from './pages/post/Post';
import Search from './pages/search/Search';
import TweetDetails from './pages/tweetDetails/tweetDetails';


const router = createBrowserRouter([
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/",
    element: <App />,
  },
  {
    path: '/post',
    element: <Post/>
  },
  {
    path: '/search',
    element: <Search/>
  },
  {
    path: '/tweet/:tweetId',
    element: <TweetDetails />,
  },
]);


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
