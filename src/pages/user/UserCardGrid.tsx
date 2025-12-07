import React, { useState } from "react";
import { Card, Avatar, Button, Row, Col } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import "./userCard.css";

type User = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  avatar?: string;
};

type Props = {
  users: User[];
  onEdit: (u: User) => void;
  onDelete: (id: number) => void;
  isDeleting?: boolean;
};

const DEFAULT_AVATAR = "https://avatars.dicebear.com/api/initials/default.svg";

const UserCardGrid: React.FC<Props> = ({
  users,
  onEdit,
  onDelete,
  isDeleting,
}) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="card-grid-wrap">
      <Row gutter={[24, 24]}>
        {users.map((u) => (
          <Col key={u.id} xs={24} sm={12} md={8} lg={6} xl={6}>
            <Card
              hoverable
              className={`user-card ${hovered === u.id ? "hovered" : ""}`}
              onMouseEnter={() => setHovered(u.id)}
              onMouseLeave={() => setHovered(null)}
              bodyStyle={{
                padding: 32,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div className="avatar-wrap">
                <Avatar
                  src={u.avatar ?? DEFAULT_AVATAR}
                  size={96}
                  className="user-avatar"
                />
                {hovered === u.id && (
                  <div className="card-overlay">
                    <Button
                      shape="circle"
                      size="large"
                      icon={<EditOutlined />}
                      className="overlay-btn edit"
                      onClick={() => onEdit(u)}
                    />
                    <Button
                      danger
                      type="primary"
                      shape="circle"
                      size="large"
                      icon={<DeleteOutlined />}
                      className="overlay-btn delete"
                      onClick={() => onDelete(u.id)}
                      loading={isDeleting}
                    />
                  </div>
                )}
              </div>

              <div style={{ marginTop: 18, textAlign: "center" }}>
                <div className="card-name">{`${u.first_name} ${u.last_name}`}</div>
                <div className="card-email">{u.email}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default UserCardGrid;
