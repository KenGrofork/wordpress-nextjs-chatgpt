import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import Login from "./loginform";

const LoginPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [modalText, setModalText] = useState("Content of the modal");

  const [form] = Form.useForm();

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      setModalText("The modal will be closed after two seconds");
      setConfirmLoading(true);
      // 发送请求验证用户身份
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
      }, 2000);
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal}>
        登录
      </Button>
      <Modal
        title="登录"
        visible={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Login />
      </Modal>
    </>
  );
};

export default LoginPopup;
