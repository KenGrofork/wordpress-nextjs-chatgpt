import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { IconButton, Link, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export function TitlebarBelowMasonryImageList() {
  return (
    <Box
      sx={{ width: 200, height: 450 }}
      style={{ padding: "10px 40px 30px 40px" }}
    >
      <ImageList variant="masonry" cols={1} gap={8}>
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            <Typography
              variant="h6"
              color="text.primary"
              sx={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
            >
              {item.title}
            </Typography>
            <img
              src={`${item.img}?w=248&fit=crop&auto=format`}
              srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}

const itemData = [
  {
    img: "./611686556446_.pic.jpg",
    title: "第一步：复制当前页面网址",
    author: "swabdesign",
  },
  {
    img: "./621686556589_.pic.jpg",
    title: "第二步：打开微信，粘贴网址并搜索",
    author: "Pavel Nekoranec",
  },
  {
    img: "./631686556626_.pic.jpg",
    title: "第三步：点击搜索结果",
    author: "Charles Deluvio",
  },
  {
    img: "./641686556698_.pic.jpg",
    title: "第四步：访问网页并重新登录发起支付",
    author: "Christian Mackie",
  },
];

export default function AlertDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Link variant="body2" onClick={handleClickOpen}>
        手机端微信支付方法
      </Link>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"手机浏览器微信支付方法"}
          <IconButton
            sx={{ position: "absolute", top: 8, right: 8 }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <TitlebarBelowMasonryImageList />
      </Dialog>
    </div>
  );
}
