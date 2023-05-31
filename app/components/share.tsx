import React, { useState } from "react";
import QRCode from "qrcode.react";
import {
  Button,
  TextField,
  Typography,
  Grid,
  Box,
  InputAdornment,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { FileCopy } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

type ShareComponentProps = {
  shareLink: string;
  shareCode: string;
};

const ShareComponent = ({ shareLink, shareCode }: ShareComponentProps) => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert("已复制到剪贴板");
      },
      (err) => {
        console.error("无法复制到剪贴板", err);
      },
    );
  };

  return (
    <Grid
      container
      direction={{ xs: "column", sm: "row" }}
      sx={{ mt: 8 }}
      spacing={2}
    >
      <Grid item xs={12} sm={5} sx={{ mt: 8 }}>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5">分享得会员</Typography>
          <TextField
            sx={{ mt: 3 }}
            fullWidth
            label="分享链接"
            value={shareLink}
            id="code"
            variant="outlined"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => copyToClipboard(shareLink)}
                  >
                    <FileCopy />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <TextField
            label="分享码"
            fullWidth
            value={shareCode}
            id="code"
            InputProps={{
              readOnly: true,
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => copyToClipboard(shareCode)}
                  >
                    <FileCopy />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            variant="outlined"
          />
        </Box>
        <Box sx={{ mt: 3 }}>
          <QRCode value={shareLink} />
        </Box>
      </Grid>
      <Grid item xs={12} sm={7} sx={{ mt: 8 }}>
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1">分享说明</Typography>
        </Box>
        <Accordion
          expanded={expanded === "panel1"}
          onChange={handleChange("panel1")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1bh-content"
            id="panel1bh-header"
          >
            <Typography sx={{ width: "33%", flexShrink: 0 }}>
              分享方式
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              你可以使用任何方式进行分享，复制分享链接、分享码、分享二维码发送给你的朋友或同事，以及群聊，当有人痛过你的专属链接注册我们平台时，你将获得1天的免费使用时长.可以无限累计叠加.
            </Typography>
          </AccordionDetails>
        </Accordion>
        <Accordion
          expanded={expanded === "panel2"}
          onChange={handleChange("panel2")}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2bh-content"
            id="panel2bh-header"
          >
            <Typography sx={{ width: "33%", flexShrink: 0 }}>
              奖励获取方式
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              用户注册后，系统将直接下发奖励，你可以刷新本页面查看是否到账，其次如果你有任何疑问，你可以添加我们的客服微信了解情况#wx：zyt757620782.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Grid>
    </Grid>
  );
};

export default ShareComponent;
