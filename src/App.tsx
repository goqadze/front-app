import React from 'react';

import {createBrowserRouter} from "react-router-dom";
import Users from "./pages/Users";
import Posts from "./pages/Posts";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Users/>,
    },
    {
        path: "users/:id/posts",
        element: <Posts/>,
    },
]);

export default router;