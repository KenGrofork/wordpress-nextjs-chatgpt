import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { styled } from "@mui/system";

const CustomDialogTitle = styled(DialogTitle)({
  backgroundColor: "#3f51b5",
  color: "white",
  textAlign: "center",
});

const CustomDialogContent = styled(DialogContent)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  padding: "32px",
});

function QRCodeDialog(props: { open: any; handleClose: any; imageURL: any }) {
  const { open, handleClose, imageURL } = props;

  return (
    <div>
      <Dialog onClose={handleClose} open={open}>
        <CustomDialogTitle>展示图片</CustomDialogTitle>
        <CustomDialogContent>
          <img src={imageURL} alt="图片" />
        </CustomDialogContent>
      </Dialog>
    </div>
  );
}

export default QRCodeDialog;
