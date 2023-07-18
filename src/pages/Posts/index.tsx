import './index.css';
import {Link, useLocation, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useMutation, useQuery} from "react-query";
import {Post} from "../../types";
import {Button, Input, Table} from "antd";
import axios from "axios";
import {ColumnsType} from "antd/es/table";
import {DeleteFilled} from "@ant-design/icons";

const PAGE_SIZE = 4;
const BASE_URL = 'http://localhost:4000';

const getPosts = async ({queryKey}: any) => {
    const [_, userId, currentPage] = queryKey;
    const {data} = await axios.get(`${BASE_URL}/posts?userId=${userId}&page=${currentPage}&take=${PAGE_SIZE}`);
    return data;
}

const deletePostFn = (id: number) => {
    return axios.delete(`${BASE_URL}/posts/${id}`);
};

const Posts = () => {
    const {id: userId} = useParams();
    const { state } = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    const {data, isLoading, refetch} = useQuery([`postsData`, userId, currentPage], getPosts);
    const deletePost = useMutation({mutationFn: deletePostFn});
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>();
    const [totalCount, setTotalCount] = useState();

    useEffect(() => {
        if (!isLoading && data) {
            const items = (data.data as Array<any>).map((item: any) => ({
                id: item.id,
                title: item.title,
                body: item.body,
            } as Post));

            setPosts(items);
            setFilteredPosts(items);
            setTotalCount(data.meta.itemCount);
        }
    }, [data, isLoading]);

    useEffect(() => {
        if (deletePost.isSuccess) {
            refetch();
        }
    }, [deletePost.isSuccess, refetch]);

    const onDelete = (postId: number) => {
        deletePost.mutate(postId);
    };

    const onFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
        const searchText = event.target.value;

        const items = posts.filter((post) => post.title.toLowerCase().includes(searchText.toLowerCase()));

        setFilteredPosts(items);
    }

    return <div className={'posts-container'}>
        <Link className={"all-users-link"} to={"/"}>{"All Users"}</Link>
        <h3>{state?.user ? `${state?.user}'s` : ""} Posts</h3>
        <div className={'search-input'}>
            <Input size={"large"} onChange={onFilter}/>
        </div>
        <Table
            columns={getColumns({onDelete})}
            dataSource={filteredPosts}
            loading={isLoading}
            pagination={{
                defaultCurrent: 1,
                defaultPageSize: PAGE_SIZE,
                total: totalCount,
                onChange: (page) => {
                    setCurrentPage(page);
                },
            }}
        />
    </div>
}

export default Posts;

const getColumns = ({onDelete}: any) => {
    const columns: ColumnsType<Post> = [
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            defaultSortOrder: 'ascend',
            sortDirections: ["ascend", "descend", "ascend"],
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Body',
            dataIndex: 'body',
            key: 'body',
        },
        {
            title: 'Delete',
            dataIndex: '',
            key: '',
            render: (value, record) => {
                return <Button danger icon={<DeleteFilled/>} onClick={() => onDelete(record.id)}></Button>
            }
        },
    ];

    return columns;
}
