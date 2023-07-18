import './index.css';
import {useQuery} from "react-query";
import {useEffect, useState} from "react";
import {Table} from "antd";
import {User} from "../../types";
import {ColumnsType} from "antd/es/table";
import {Typography} from 'antd';
import {useNavigate} from "react-router-dom";
import axios from "axios";

const BASE_URL = 'https://jsonplaceholder.typicode.com';

const getUsers = async () => {
    const {data} = await axios.get(`${BASE_URL}/users`);
    return data;
}

const Users = () => {
    let navigate = useNavigate();
    const {data, isLoading} = useQuery(`usersData`, getUsers);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        if (!isLoading && data) {
            const items = (data as Array<any>).map((item: any) => ({
                id: item.id,
                fullName: item.name,
                email: item.email,
                address: `${item.address.street}, ${item.address.suite}, ${item.address.city}, ${item.address.zipcode}`,
            } as User));

            setUsers(items);
        }
    }, [data, isLoading]);

    return <div className={'users-container'}>
        <h3>
           Users
        </h3>
        <Table
            columns={columns}
            dataSource={users}
            loading={isLoading}
            onRow={(record, rowIndex) => {
                return {
                    onClick: event => {
                        const userId = record.id;
                        navigate(`users/${userId}/posts`, { state: { user: record.fullName } });
                    },
                };
            }}
            rowClassName={"user-row"}
            pagination={{defaultCurrent: 1, defaultPageSize: 4}}
        />
    </div>
}

export default Users;

const columns: ColumnsType<User> = [
    {
        title: 'Full Name',
        dataIndex: 'fullName',
        key: 'fullName',
        defaultSortOrder: 'ascend',
        sortDirections: ["ascend", "descend", "ascend"],
        sorter: (a, b) => a.fullName.localeCompare(b.fullName),
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
        render: (value) => {
            return <Typography.Text
                style={{width: 50}}
                ellipsis={{tooltip: value}}
            >
                {value}
            </Typography.Text>
        }
    },
];