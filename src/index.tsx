import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {RouterProvider} from "react-router-dom";
import router from "./App";
import {QueryClient, QueryClientProvider} from "react-query";

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

// const BASE_URL = 'https://jsonplaceholder.typicode.com';

const queryClient = new QueryClient(
    // {
    //     defaultOptions: {
    //         queries: {
    //             queryFn: async ({queryKey: [url]}) => {
    //                 if (typeof url === 'string') {
    //                     const {data} = await axios.get(`${BASE_URL}/${url.toLowerCase()}`);
    //                     return data;
    //                 }
    //                 throw new Error('Invalid QueryKey');
    //             },
    //         },
    //     },
    // }
);

root.render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router}/>
        </QueryClientProvider>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
