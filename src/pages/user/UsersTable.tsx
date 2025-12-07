import React from "react";
import { Table, Avatar, Button, Space } from "antd";
import type { ColumnsType } from "antd/es/table";

type UserRow = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
};

type Props = {
  users: UserRow[];
  onEdit: (u: UserRow) => void;
  onDelete: (id: number) => void;
};

const UsersTable: React.FC<Props> = ({ users, onEdit, onDelete }) => {
  const columns: ColumnsType<UserRow> = [
    {
      title: "",
      dataIndex: "avatar",
      key: "avatar",
      width: 80,
      render: (v) => <Avatar src={v} size={48} />,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "First Name",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_text, record) => (
        <Space>
          <Button onClick={() => onEdit(record as UserRow)} type="primary">
            Edit
          </Button>
          <Button danger type="primary" onClick={() => onDelete(record.id)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table<UserRow>
      rowKey="id"
      columns={columns}
      dataSource={users}
      pagination={false}
    />
  );
};

export default UsersTable;
