import React from "react";
import { Alert, Space } from "antd";
import { Link } from "react-router-dom";

const Banner2: React.FC = () => {
  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Alert
        message={
          <>
            每分享给一名用户，可获得1天免费使用时长，
            <Link to="/usercenter">立即分享</Link>
          </>
        }
        type="success"
        showIcon
        closable
      />
    </Space>
  );
};

export default Banner2;
