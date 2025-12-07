import React from "react";
import { Button, Space } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

type Props = {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
};

const PaginationControls: React.FC<Props> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: totalPages }).map((_, i) => i + 1);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Button
        disabled={page === 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        <LeftOutlined />
      </Button>

      <Space>
        {pages.map((p) => (
          <Button
            key={p}
            type={p === page ? "primary" : "default"}
            onClick={() => onPageChange(p)}
          >
            {p}
          </Button>
        ))}
      </Space>

      <Button
        disabled={page >= totalPages}
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
      >
        <RightOutlined />
      </Button>
    </div>
  );
};

export default PaginationControls;
