import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/system";
import { Button, Stack } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import React from "react";
import getOrderStatus from "../api/restapi/authorder";
import MySnackbar from "./mysnackbar";

const CustomDialogTitle = styled(DialogTitle)({
  backgroundColor: "#3f51b5",
  color: "white",
  textAlign: "center",
});

const CustomDialogContent = styled(DialogContent)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "28px",
});

function QRCodeDialog(props: {
  open: any;
  handleClose: any;
  imageURL: any;
  paymentId: any;
  orderId: any;
}) {
  const { open, handleClose, imageURL, paymentId, orderId } = props;
  const [loading, setLoading] = React.useState(false);
  const [message, setMessage] = React.useState("");
  const [severity, setSeverity] = React.useState("success");
  const [isopen, setIsopen] = React.useState(false);
  const onhandleClose = () => {
    setIsopen(false);
  };

  async function handleClick() {
    setLoading(true);
    const status = await getOrderStatus(orderId);
    if (status === "completed") {
      setMessage("支付成功");
      setSeverity("success");
      setIsopen(true);
      setTimeout(() => {
        handleClose();
      }, 1000);
    }
    if (status === "pending") {
      setMessage("暂未收到付款，请稍后重试");
      setSeverity("warning");
      setIsopen(true);
    }
    console.log(status);
    setLoading(false);
  }
  return (
    <div>
      <Dialog open={open}>
        <CustomDialogTitle sx={{ mb: 2 }}>
          使用{paymentId}扫描下方二维码支付
        </CustomDialogTitle>
        <CustomDialogContent sx={{ mb: 0 }}>
          <img src={imageURL} alt="图片" />
        </CustomDialogContent>
        <Stack
          spacing={2}
          justifyContent="center"
          direction="row"
          sx={{ mb: 2 }}
        >
          <Button onClick={handleClose} variant="text">
            取消
          </Button>
          <LoadingButton
            size="small"
            onClick={handleClick}
            loading={loading}
            loadingIndicator="。。"
            variant="outlined"
          >
            <span>已支付</span>
          </LoadingButton>
          <MySnackbar
            open={isopen}
            handleClose={onhandleClose}
            severity={severity}
            message={message}
          />
        </Stack>
      </Dialog>
    </div>
  );
}

export default QRCodeDialog;
