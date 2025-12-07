import React from "react";
import { Card, Form, Input, Button, Checkbox, message } from "antd";
import { useLoginMutation } from "../../services/auth/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "./../../App.css";
import { LockOutlined, UserOutlined } from "@ant-design/icons";

const defaultValues = {
  email: "",
  password: "",
  remember: false,
};

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    try {
      const res = await login({
        email: values.email,
        password: values.password,
      }).unwrap();
      dispatch(setCredentials({ token: res.token, email: values.email }));
      message.success("Login successful");
      navigate("/users");
    } catch (err: any) {
      const errMsg = err?.data?.error || "Login failed. Check credentials.";
      message.error(errMsg);
    }
  };

  return (
    <div className="auth-page-wrap">
      <Card className="auth-card">
        <Form
          form={form}
          layout="vertical"
          initialValues={defaultValues}
          onFinish={onFinish}
          className="auth-form"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Please input your password!" },
              { min: 6, message: "Minimum 6 characters" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="password" />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isLoading}>
              Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
