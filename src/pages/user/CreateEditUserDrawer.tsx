// src/components/CreateEditUserDrawer.tsx
import React, { useEffect } from "react";
import { Drawer, Form, Input, Button, Space, message, Spin } from "antd";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUserQuery,
} from "../../services/auth/authApi";

import "./CreateEditUserDrawer.css";

type Props = {
  open: boolean;
  id?: number | string;
  onClose: () => void;
  onDone?: () => void;
};

type ApiUser = {
  id?: number;
  first_name?: string;
  last_name?: string;
  email?: string;
  avatar?: string;
  job?: string;
};

const CreateEditUserDrawer: React.FC<Props> = ({
  open,
  id,
  onClose,
  onDone,
}) => {
  const [form] = Form.useForm();
  const numericId = typeof id === "string" ? Number(id) : id;
  const isEdit = typeof numericId === "number" && !Number.isNaN(numericId);

  const {
    data: userData,
    isFetching: fetchingUser,
    isError: fetchError,
  } = useGetUserQuery(numericId as number, { skip: !isEdit });

  const user: ApiUser | null = isEdit ? userData?.data ?? null : null;

  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  useEffect(() => {
    if (isEdit) {
      if (user) {
        form.setFieldsValue({
          first_name: user.first_name ?? "",
          last_name: user.last_name ?? "",
          email: user.email ?? "",
          avatar: user.avatar ?? "",
          job: user.job ?? "",
        });
      } else {
        form.resetFields();
      }
    } else {
      form.resetFields();
    }
    if (!open) {
      form.resetFields();
    }
  }, [isEdit, user, form, open]);

  async function handleFinish(values: any) {
    try {
      if (!isEdit) {
        const payload = {
          name: `${values.first_name ?? ""} ${values.last_name ?? ""}`.trim(),
          job: values.job ?? "New User",
          email: values.email,
          avatar: values.avatar,
        };
        await createUser(payload as any).unwrap();
        message.success("User created");
        if (onDone) onDone();
      } else {
        const payload = {
          id: numericId!,
          name: `${values.first_name ?? ""} ${values.last_name ?? ""}`.trim(),
          job: values.job ?? "Updated",
          email: values.email,
          avatar: values.avatar,
        };
        await updateUser(payload as any).unwrap();
        message.success("User updated");
        if (onDone) onDone();
      }
      form.resetFields();
      onClose();
    } catch (err: any) {
      console.error(err);
      const errMsg =
        (err?.data && (err.data as any).error) ||
        err?.message ||
        "Operation failed";
      message.error(errMsg);
    }
  }

  const loading = creating || updating || fetchingUser;

  return (
    <Drawer
      title={isEdit ? "Edit User" : "Create New User"}
      placement="right"
      onClose={() => {
        form.resetFields();
        onClose();
      }}
      open={open}
      size={520}
      destroyOnHidden
      maskClosable={false}
      bodyStyle={{ paddingBottom: 80 }}
      footer={
        <div className="drawer-footer">
          <Space>
            <Button
              onClick={() => {
                form.resetFields();
                onClose();
              }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              onClick={() => form.submit()}
              loading={loading}
            >
              {isEdit ? "Save" : "Submit"}
            </Button>
          </Space>
        </div>
      }
    >
      {isEdit && fetchingUser ? (
        <div
          className="drawer-loading"
          style={{ textAlign: "center", padding: 36 }}
        >
          <Spin />
        </div>
      ) : fetchError && isEdit ? (
        <div style={{ padding: 12 }}>Failed to load user data.</div>
      ) : (
        (!isEdit || user) && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleFinish}
            preserve={false}
            key={isEdit ? `edit_${user?.id ?? numericId}` : "create"}
            initialValues={
              isEdit && user
                ? {
                    first_name: user.first_name ?? "",
                    last_name: user.last_name ?? "",
                    email: user.email ?? "",
                    avatar: user.avatar ?? "",
                    job: user.job ?? "",
                  }
                : {
                    first_name: "",
                    last_name: "",
                    email: "",
                    avatar: "",
                    job: "",
                  }
            }
            className="drawer-form"
          >
            <Form.Item
              label={<span className="form-label">First Name</span>}
              name="first_name"
              rules={[{ required: true, message: "Please enter first name" }]}
            >
              <Input placeholder="Please enter first name" />
            </Form.Item>

            <Form.Item
              label={<span className="form-label">Last Name</span>}
              name="last_name"
              rules={[{ required: true, message: "Please enter last name" }]}
            >
              <Input placeholder="Please enter last name" />
            </Form.Item>

            <Form.Item
              label={<span className="form-label">Email</span>}
              name="email"
              rules={[
                { required: true, message: "Please enter email" },
                { type: "email", message: "Enter valid email" },
              ]}
            >
              <Input placeholder="Please enter email" />
            </Form.Item>

            <Form.Item
              label={<span className="form-label">Profile Image Link</span>}
              name="avatar"
              rules={[
                {
                  required: !isEdit,
                  message: "Please enter profile image link",
                },
              ]}
            >
              <Input placeholder="Please enter profile image link" />
            </Form.Item>

            <Form.Item
              name="job"
              label={<span className="form-label">Job</span>}
            >
              <Input placeholder="Job (optional)" />
            </Form.Item>

            <div style={{ height: 24 }} />
          </Form>
        )
      )}
    </Drawer>
  );
};

export default CreateEditUserDrawer;
