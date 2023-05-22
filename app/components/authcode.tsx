import { useState } from "react";
import { Input, Button, Space } from "antd";
import axios from "axios";
function VerificationCodeInput() {
  const [phone, setPhone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSending, setIsSending] = useState(false);

  // 通过接口发送短信验证码
  const sendSmsVerificationCode = async () => {
    setIsSending(true);

    try {
      const response = await axios.post(
        "https://chatgpt.funny-code.top/wp-json/myplugin/v1/sms-send",
        { phone: phone },
      );
      console.log(response);
    } catch (error) {
      console.error(error);
    }

    setIsSending(false);
  };

  return (
    <Space.Compact>
      <Input
        style={{ width: "60%" }}
        placeholder="输入手机号"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <Input.Search
        style={{ width: "40%" }}
        placeholder="输入短信验证码"
        value={verificationCode}
        onChange={(e) => setVerificationCode(e.target.value)}
        onSearch={(value) => console.log(value)}
        addonAfter={
          <Button
            onClick={sendSmsVerificationCode}
            loading={isSending}
            disabled={phone.length !== 11}
          >
            发送验证码
          </Button>
        }
      />
    </Space.Compact>
  );
}

export default VerificationCodeInput;
