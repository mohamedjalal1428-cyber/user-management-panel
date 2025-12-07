import React from "react";
import { Drawer, Form, Input, Button, Space, message, Spin } from "antd";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUserQuery,
} from "../../services/auth/authApi";

import "./CreateEditUserDrawer.css";

type Props = {
  open: boolean;
  id?: number;
  onClose: () => void;
  onDone?: () => void;
};

const CreateEditUserDrawer: React.FC<Props> = ({
  open,
  id,
  onClose,
  onDone,
}) => {
  const [form] = Form.useForm();
  const isEdit = typeof id === "number";
  const { data: userData, isFetching: fetchingUser } = useGetUserQuery(id!, {
    skip: !isEdit,
  });

  const user = isEdit ? userData?.data : null;

  const [createUser, { isLoading: creating }] = useCreateUserMutation();
  const [updateUser, { isLoading: updating }] = useUpdateUserMutation();

  async function handleFinish(values: any) {
    try {
      if (!isEdit) {
        const payload = {
          name: `${values.first_name} ${values.last_name}`,
          job: values.job ?? "New User",
        };
        await createUser(payload).unwrap();
        message.success("User created");
        if (onDone) onDone();
      } else {
        const payload = {
          id: id!,
          name: `${values.first_name} ${values.last_name}`,
          job: values.job ?? "Updated",
        };
        await updateUser(payload as any).unwrap();
        message.success("User updated");
        if (onDone) onDone();
      }
      form.resetFields();
      onClose();
    } catch (err: any) {
      console.error(err);
      message.error(err?.data?.error || "Operation failed");
    }
  }

  const loading = creating || updating || fetchingUser;

  return (
    <Drawer
      title={isEdit ? "Edit User" : "Create New User"}
      placement="right"
      closeIcon={false}
      onClose={() => onClose()}
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
      {loading ? (
        <div className="drawer-loading">
          <Spin />
        </div>
      ) : (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          preserve={false}
          key={isEdit ? `edit_${user?.id}` : "create"}
          initialValues={
            isEdit && user
              ? {
                  first_name: user.first_name,
                  last_name: user.last_name,
                  email: user.email,
                  avatar: user.avatar,
                }
              : {
                  first_name: "",
                  last_name: "",
                  email: "",
                  avatar: "",
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
              { required: !isEdit, message: "Please enter profile image link" },
            ]}
          >
            <Input placeholder="Please enter profile image link" />
          </Form.Item>

          <Form.Item name="job" label={<span className="form-label">Job</span>}>
            <Input placeholder="Job (optional)" />
          </Form.Item>

          <div style={{ height: 24 }} />
        </Form>
      )}
    </Drawer>
  );
};

export default CreateEditUserDrawer;
