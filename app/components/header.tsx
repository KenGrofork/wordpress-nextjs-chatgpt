import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import CloseIcon from "../icons/close.svg";
import { IconButton } from "./button";

export default function DefaultHeader() {
  const navigate = useNavigate();

  return (
    <div className="window-header">
      <div className="window-header-title">
        <div className="window-header-main-title">登录&注册</div>
        <div className="window-header-sub-title">加入我们开始AIChat</div>
      </div>
      <div className="window-actions">
        <div className="window-action-button">
          <IconButton
            icon={<CloseIcon />}
            onClick={() => navigate(Path.Home)}
            bordered
          />
        </div>
      </div>
    </div>
  );
}
