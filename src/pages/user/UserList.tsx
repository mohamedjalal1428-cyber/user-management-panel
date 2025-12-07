import React, { useMemo, useState } from "react";
import {
  Layout,
  Button,
  Space,
  Spin,
  Input,
  Typography,
  message,
  Modal,
} from "antd";
import {
  TableOutlined,
  AppstoreOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import UsersTable from "./UsersTable";
import UserCardGrid from "./UserCardGrid";
import PaginationControls from "./PaginationControls";
import CreateEditUserModal from "./CreateEditUserDrawer";
import {
  useFetchUsersQuery,
  useDeleteUserMutation,
} from "../../services/auth/authApi";
import "./UserList.css";
const { Content } = Layout;
const { Title } = Typography;
const { confirm } = Modal;
const UsersList: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<"table" | "card">("table");
  const [search, setSearch] = useState<string>("");
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useFetchUsersQuery(page, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const users = data?.data ?? [];

  const filtered = useMemo(() => {
    if (!search) return users;
    const q = search.toLowerCase();
    return users.filter(
      (u: any) =>
        u.email.toLowerCase().includes(q) ||
        u.first_name.toLowerCase().includes(q) ||
        u.last_name.toLowerCase().includes(q)
    );
  }, [search, users]);

  async function handleDelete(id: number) {
    try {
      await deleteUser(id).unwrap();
      message.success("User deleted");
      refetch();
    } catch (err: any) {
      console.error(err);
      message.error("Failed to delete user");
    }
  }
  function showDeleteConfirm(id: number) {
    confirm({
      title: "Are you sure you want to delete this user?",
      icon: <ExclamationCircleOutlined />,
      content: "This action cannot be undone.",
      okText: "Yes, Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDelete(id);
      },
    });
  }
  return (
    <Layout className="layout">
      <Content className="layout-content">
        <div className="layout-content-inner">
          <div style={{ background: "#fff", borderRadius: 6, padding: 16 }}>
            <div className="alignItems">
              <div className="toggle-conatiner">
                <Title level={4} style={{ margin: 0 }}>
                  Users
                </Title>
                <div className="toggle-view-wrap">
                  <Button
                    size="small"
                    type={viewMode === "table" ? "primary" : "default"}
                    onClick={() => setViewMode("table")}
                  >
                    <TableOutlined style={{ marginRight: 8 }} />
                    Table
                  </Button>

                  <Button
                    size="small"
                    type={viewMode === "card" ? "primary" : "default"}
                    onClick={() => setViewMode("card")}
                  >
                    <AppstoreOutlined style={{ marginRight: 8 }} />
                    Card
                  </Button>
                </div>
              </div>

              <Space>
                <Input.Search
                  placeholder="input search text"
                  allowClear
                  onSearch={(v) => setSearch(v)}
                  onChange={(e) => setSearch(e.target.value)}
                  style={{ width: 260 }}
                />
                <Button type="primary" onClick={() => setCreateModalOpen(true)}>
                  Create User
                </Button>
              </Space>
            </div>

            {isLoading ? (
              <div style={{ textAlign: "center", padding: 60 }}>
                <Spin size="large" />
              </div>
            ) : isError ? (
              <div style={{ padding: 24 }}>
                <p>Failed to load users</p>
                <Button onClick={() => refetch()}>Retry</Button>
              </div>
            ) : viewMode === "table" ? (
              <UsersTable
                users={filtered}
                onEdit={(u) => {
                  setEditingUser(u.id);
                  setCreateModalOpen(true);
                }}
                onDelete={showDeleteConfirm}
              />
            ) : (
              <UserCardGrid
                users={filtered}
                onEdit={(u) => {
                  setEditingUser(u.id);
                  setCreateModalOpen(true);
                }}
                onDelete={showDeleteConfirm}
                isDeleting={isDeleting}
              />
            )}
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: 16,
              gap: 8,
            }}
          >
            <PaginationControls
              page={page}
              totalPages={data?.total_pages ?? 1}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </div>
      </Content>

      <CreateEditUserModal
        open={createModalOpen}
        id={editingUser ?? undefined}
        onClose={() => {
          setCreateModalOpen(false);
          setEditingUser(null);
        }}
        onDone={() => refetch()}
      />
    </Layout>
  );
};

export default UsersList;
