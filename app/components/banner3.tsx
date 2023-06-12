import React from "react";
// import './index.css';
import { Alert, Space } from "antd";
import CountDown from "./countdown";

const Banner3: React.FC = () => (
  <Space direction="vertical" style={{ width: "100%" }}>
    <Alert
      type="success"
      showIcon
      closable
      message={
        <span style={{ fontSize: "14px" }}>
          <CountDown />
        </span>
      }
    />
  </Space>
);

export default Banner3;
