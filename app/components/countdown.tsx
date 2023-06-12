import type { CountdownProps } from "antd";
import { Col, Row, Statistic } from "antd";
import React from "react";

const { Countdown } = Statistic;

const deadline = Date.now() + 1000 * 60 * 60 * 2 + 1000 * 3; // Dayjs is also OK

const onFinish: CountdownProps["onFinish"] = () => {
  console.log("finished!");
};

const onChange: CountdownProps["onChange"] = (val) => {
  if (typeof val === "number" && 4.95 * 1000 < val && val < 5 * 1000) {
    console.log("changed!");
  }
};

const CountDown: React.FC = () => (
  <Row gutter={16}>
    <Col span={24} style={{ marginTop: 10 }}>
      <span style={{ fontSize: "14px" }}>
        折扣剩余时间：
        <Countdown
          style={{ fontSize: "14px" }}
          value={deadline}
          format=" H 时 m 分 s 秒"
        />
      </span>
    </Col>
  </Row>
);

export default CountDown;
