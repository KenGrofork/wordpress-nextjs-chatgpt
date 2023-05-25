import React from "react";
import {
  Container,
  Grid,
  Typography,
  Button,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Path } from "../constant";
import CloseIcon from "../icons/close.svg";
import { IconButton } from "./button";
import axios from "axios";
import QRCodeDialog from "./payment";
import { CircularProgress } from "@mui/material";
import Wechat from "./wechat";
import Alipay from "./alipay";
import Divider from "@mui/material/Divider";
import PaymentIcon from "@mui/icons-material/Payment";
import { isWebApp } from "./iswapapp";

const theme = createTheme({
  palette: {
    primary: {
      main: "#24292f",
    },
    secondary: {
      main: "#f48fb1",
    },
  },
  typography: {
    fontFamily: "SF Pro SC",
    fontSize: 12,
    fontWeightRegular: 400,
    fontWeightBold: 600,
  },
});

// 从JSON数组中获取会员订阅信息
const membershipOptions = [
  {
    title: "周会员",
    price: 10,
    description: "¥2/天.",
    buttonColor: "primary",
    buttonText: "加入会员",
    id: 99,
    lenth: "周",
  },
  {
    title: "月度会员",
    price: 20,
    description: "¥2/天.",
    buttonColor: "secondary",
    buttonText: "加入会员",
    id: 319,
    lenth: "月",
  },
  {
    title: "季度会员",
    price: 30,
    description: "¥2/天.",
    buttonColor: "primary",
    buttonText: "加入会员",
    id: 320,
    lenth: "三个月",
  },
  {
    title: "年度会员",
    price: 30,
    description: "¥2/天.",
    buttonColor: "primary",
    buttonText: "加入会员",
    id: 321,
    lenth: "年",
  },
];
function Pricing() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [imageURL, setImageURL] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [redirectUrl, setRedirectUrl] = React.useState("");

  // const handleClickOpen = () => {
  //     setOpen(true);
  //     setImageURL(
  //         "https://api.xunhupay.com/payments/wechat/qrcode?id=20232100405&nonce_str=4936118325&time=1684935213&appid=201906155700&hash=889ef4f9ad88850e980f0ab3496e73d8",
  //     );
  // };
  const handleClose = () => {
    setOpen(false);
  };
  const [SelectedPaymentMethod, setSelectedPaymentMethod] =
    React.useState("wechat");
  const [selectedMembershipOption, setSelectedMembershipOption] =
    React.useState(0);

  // 调用https://chatgpt.funny-code.top/wp-json/wc/v3/orders端口，使用woocommerce restAPI创建一个订单
  const handleSubmit = async () => {
    setLoading(true);
    const userAgent = isWebApp();
    console.log(userAgent);
    const productId = membershipOptions[selectedMembershipOption].id;
    const productTitle = membershipOptions[selectedMembershipOption].title;
    const productPrice = membershipOptions[selectedMembershipOption].price;
    console.log(productId, productTitle, productPrice);
    const config = {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_TOKEN}`,
      },
    };
    const data = {
      payment_method: "bacs",
      payment_method_title: "Direct Bank Transfer",
      set_paid: true,
      billing: {
        first_name: "John",
        last_name: "Doe",
        address_1: "969 Market",
        address_2: "",
        city: "San Francisco",
        state: "CA",
        postcode: "94103",
        country: "US",
        email: "evanrobertsca@gmail.com",
      },
      shipping: {},
      line_items: [
        {
          product_id: productId,
          quantity: 1,
        },
      ],
      shipping_lines: [
        {
          method_id: "flat_rate",
          method_title: "Flat Rate",
          total: "0",
        },
      ],
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wc/v3/orders`,
        data,
        config,
      );
      console.log(response.data);
      const orderId = response.data.id;
      // setOrderId(response.data.id);
      if (response.data.id) {
        try {
          const getpaymentimg = await axios.post(
            `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/my-plugin/v1/xunhupay`,
            {
              trade_order_id: orderId,
              payment: SelectedPaymentMethod,
              total_fee: productPrice,
              title: productTitle,
            },
          );
          console.log(getpaymentimg.data);
          const qrcode = JSON.parse(getpaymentimg.data);
          console.log(qrcode);
          if (userAgent) {
            window.location.href = qrcode.url;
            return;
          }
          setImageURL(qrcode.url_qrcode);
          setOpen(true);
        } catch (error) {
          console.error(error);
        }
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="window-header">
        <div className="window-header-title">
          <div className="window-header-main-title">开通会员</div>
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
      <Container
        maxWidth="lg"
        sx={{ mt: 4, minHeight: "100vh", overflow: "auto" }}
      >
        <Typography variant="h6" align="left" sx={{ mb: 3 }}>
          选择一个会员加入我们
        </Typography>
        <Grid
          container
          spacing={1}
          alignItems="left"
          justifyContent="left"
          sx={{ mb: 3 }}
        >
          {membershipOptions.map((option, index) => {
            const key = `membershipOption_${index}`;
            return (
              <Grid item xs={6} sm={3} md={3} lg={3} key={key}>
                <Card
                  sx={{
                    boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.4)",
                    borderRadius: "5px",
                    cursor: "pointer",
                    border:
                      selectedMembershipOption === index
                        ? "1px solid #000"
                        : "",
                  }}
                  onClick={() => setSelectedMembershipOption(index)}
                >
                  <CardContent
                    sx={{
                      color:
                        selectedMembershipOption === index ? "#f48fb1" : "",
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      align="center"
                      sx={{ mb: 1 }}
                    >
                      {option.title}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      align="center"
                      sx={{ mb: 1 }}
                    >
                      {option.price ? `¥${option.price}` : `Contact`}
                      <span>/{option.lenth}</span>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        <Divider sx={{ mb: 3 }} />
        <Typography variant="h6" align="left" sx={{ mb: 2 }}>
          选择支付方式
        </Typography>
        <Grid
          container
          spacing={1}
          alignItems="left"
          justifyContent="left"
          sx={{ mb: 3 }}
        >
          <Grid item xs={6} sm={3} md={3} lg={3}>
            <Card
              sx={{
                boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.4)",
                borderRadius: "5px",
                cursor: "pointer",
                border:
                  SelectedPaymentMethod === "wechat" ? "1px solid #000" : "",
              }}
              onClick={() => setSelectedPaymentMethod("wechat")}
            >
              <CardContent
                sx={
                  {
                    // backgroundColor: SelectedPaymentMethod === "wechat" ? "#f48fb1" : "",
                    // color: SelectedPaymentMethod === "wechat" ? "#fff" : "",
                  }
                }
              >
                <Grid
                  container
                  alignItems="center"
                  spacing={0}
                  sx={{ padding: 0 }}
                  justifyContent="center"
                >
                  <Grid item sx={{ mr: 2 }}>
                    <Wechat />
                  </Grid>
                  <Typography variant="h6" align="center" sx={{ mb: 0 }}>
                    微信支付
                  </Typography>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={6} sm={3} md={3} lg={3}>
            <Card
              sx={{
                boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.4)",
                borderRadius: "5px",
                cursor: "pointer",
                border:
                  SelectedPaymentMethod === "alipay" ? "1px solid #000" : "",
              }}
              onClick={() => setSelectedPaymentMethod("alipay")}
            >
              <CardContent
                sx={
                  {
                    // backgroundColor: SelectedPaymentMethod === "alipay" ? "#f48fb1" : "",
                    // color: SelectedPaymentMethod === "alipay" ? "#fff" : "",
                  }
                }
              >
                <Grid
                  container
                  alignItems="center"
                  spacing={0}
                  sx={{ padding: 0 }}
                  justifyContent="center"
                >
                  <Grid item sx={{ mr: 2 }}>
                    <Alipay />
                  </Grid>
                  <Typography variant="h6" align="center" sx={{ mb: 0 }}>
                    支付宝支付
                  </Typography>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid item xs={6} sx={{ mb: 3 }}>
          <Grid container justifyContent="right">
            <Grid container justifyContent="right">
              <Typography variant="h6" align="right" sx={{ mb: 1, mt: 1 }}>
                订单合计：{membershipOptions[selectedMembershipOption].price}元
              </Typography>
            </Grid>
            <Grid container justifyContent="right">
              <Typography variant="inherit" align="right" sx={{ mb: 1, mt: 0 }}>
                当前选择：{membershipOptions[selectedMembershipOption].title}
              </Typography>
            </Grid>
            <Grid item>
              <Button
                size="large"
                color="primary"
                variant="contained"
                startIcon={<PaymentIcon />}
                onClick={handleSubmit}
              >
                去支付
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Divider sx={{ mb: 3 }} />

        {loading && (
          <Box
            sx={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              zIndex: 9999,
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress color="success" />
            {/* <Typography variant="h5" sx={{ mb: 2 }}>
                            二维码生成中，请稍等...
                        </Typography> */}
          </Box>
        )}
        <QRCodeDialog
          open={open}
          handleClose={handleClose}
          imageURL={imageURL}
        />
        <Typography variant="h4" align="center" sx={{ mb: 6, mt: 6 }}>
          为什么选择我们？
        </Typography>
        <Grid container spacing={4} alignItems="center" justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.2)",
                borderRadius: "10px",
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  会员说明
                </Typography>
                <Typography variant="body2" sx={{ mb: 4 }}>
                  所有会员均使用相同api接口，区别在于使用时长.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.2)",
                borderRadius: "10px",
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  为什么要收费
                </Typography>
                <Typography variant="body2" sx={{ mb: 4 }}>
                  api接口需要服务器支持，服务器需要成本，所以需要收费.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Card
              sx={{
                boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.2)",
                borderRadius: "10px",
              }}
            >
              <CardContent>
                <Typography variant="h5" sx={{ mb: 2 }}>
                  售后稳定吗，会不会跑路
                </Typography>
                <Typography variant="body2" sx={{ mb: 4 }}>
                  自从openai推出接口，我们就开始做这个了，一直在做，不会跑路.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </ThemeProvider>
  );
}

export default Pricing;
