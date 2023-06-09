import React, { use, useEffect } from "react";
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
import ControlledAccordions from "./aboutus";
import { isUserLogin } from "../api/restapi/authuser";
import MySnackbar from "./mysnackbar";
import mixpanel from "mixpanel-browser";

mixpanel.init("6c4c1c926708fd247571a67ed0a25d6f", { debug: true });

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
    fontFamily: "PingFang SC",
    fontSize: 12,
    fontWeightRegular: 600,
    fontWeightBold: 600,
  },
});

// 从JSON数组中获取会员订阅信息
const membershipOptions = [
  {
    title: "周会员",
    price: 14.9,
    description: "¥2/天.",
    buttonColor: "primary",
    buttonText: "加入会员",
    id: 99,
    lenth: "周",
  },
  {
    title: "月度会员",
    price: 29.8,
    description: "¥2/天.",
    buttonColor: "secondary",
    buttonText: "加入会员",
    id: 319,
    lenth: "月",
  },
  {
    title: "季度会员",
    price: 59.8,
    description: "¥2/天.",
    buttonColor: "primary",
    buttonText: "加入会员",
    id: 320,
    lenth: "三个月",
  },
  {
    title: "永久会员",
    price: 199,
    description: "¥2/天.",
    buttonColor: "primary",
    buttonText: "加入会员",
    id: 321,
    lenth: "-",
  },
];
function Pricing() {
  React.useEffect(() => {
    const res = isUserLogin();
    console.log(res);
    if (!res) {
      window.location.href = "/#/signup";
    }
  }, []);
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [imageURL, setImageURL] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };
  const [SelectedPaymentMethod, setSelectedPaymentMethod] =
    React.useState("wechat");
  const [transpayment, setTranspayment] = React.useState("微信");
  const [selectedMembershipOption, setSelectedMembershipOption] =
    React.useState(0);
  const user_id = localStorage.getItem("user_info");
  const [order_id, setOrder_id] = React.useState(
    localStorage.getItem("current_order_id"),
  );

  // 调用https://chatgpt.funny-code.top/wp-json/wc/v3/orders端口，使用woocommerce restAPI创建一个订单
  const handleSubmit = async () => {
    setLoading(true);
    const userAgent = isWebApp();
    console.log(userAgent);
    const productId = membershipOptions[selectedMembershipOption].id;
    const productTitle = membershipOptions[selectedMembershipOption].title;
    const productPrice = membershipOptions[selectedMembershipOption].price;
    console.log(productId, productTitle, productPrice);
    mixpanel.track("去支付", {
      用户名: user_id,
      支付方式: selectedMembershipOption,
      会员选项: productTitle,
      会员价格: productPrice,
    });
    const config = {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_JWT_TOKEN}`,
      },
    };
    const data = {
      payment_method: SelectedPaymentMethod,
      payment_method_title: SelectedPaymentMethod,
      set_paid: false,
      customer_id: user_id,
      billing: {},
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
    const localorderdata = localStorage.getItem(
      "orderdata_" + productId + "_" + SelectedPaymentMethod,
    );
    const currentTime = new Date();
    const currentTimestmp = currentTime.getTime();
    const getexptime = localorderdata ? JSON.parse(localorderdata).exptime : 0;
    if (localorderdata && currentTimestmp < getexptime) {
      setLoading(false);
      if (userAgent) {
        window.location.href = JSON.parse(localorderdata).url;
        return;
      } else {
        setImageURL(JSON.parse(localorderdata).urlQrcode);
        setOpen(true);
        return;
      }
    } else {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/wp-json/wc/v3/orders`,
          data,
          config,
        );
        console.log(response.data);
        const orderId = response.data.id;
        setOrder_id(orderId);
        localStorage.setItem("current_order_id", orderId);
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
              const ordertime = new Date();
              const exptime = new Date(ordertime.getTime() + 15 * 60 * 1000);
              const ordertimestamp = ordertime.getTime();
              const exptimestamp = exptime.getTime();
              let orderdata = {
                urlQrcode: qrcode.url_qrcode,
                url: qrcode.url,
                productId: productId,
                ordertime: ordertimestamp,
                exptime: exptimestamp,
                payment: SelectedPaymentMethod,
              };
              localStorage.setItem(
                "orderdata_" + productId + "_" + SelectedPaymentMethod,
                JSON.stringify(orderdata),
              );
              window.location.href = qrcode.url;
              return;
            }
            setImageURL(qrcode.url_qrcode);
            setOpen(true);
            const ordertime = new Date();
            const exptime = new Date(ordertime.getTime() + 15 * 60 * 1000);
            const ordertimestamp = ordertime.getTime();
            const exptimestamp = exptime.getTime();

            let orderdata = {
              urlQrcode: qrcode.url_qrcode,
              url: qrcode.url,
              productId: productId,
              ordertime: ordertimestamp,
              exptime: exptimestamp,
              payment: SelectedPaymentMethod,
            };
            localStorage.setItem(
              "orderdata_" + productId + "_" + SelectedPaymentMethod,
              JSON.stringify(orderdata),
            );
          } catch (error) {
            console.error(error);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
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
      <Container maxWidth="lg" sx={{ mt: 4, overflow: "auto" }}>
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
                        ? "2px solid #000"
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
                      sx={{ mb: 0 }}
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
                  SelectedPaymentMethod === "wechat" ? "2px solid #000" : "",
              }}
              onClick={() => {
                setSelectedPaymentMethod("wechat");
                setTranspayment("微信");
              }}
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
                  SelectedPaymentMethod === "alipay" ? "2px solid #000" : "",
              }}
              onClick={() => {
                setSelectedPaymentMethod("alipay");
                setTranspayment("支付宝");
              }}
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
          paymentId={transpayment}
          orderId={order_id}
        />
        <Typography
          variant="h6"
          align="left"
          sx={{
            mb: 3,
            mt: 3,
            // "@media (max-width: 600px)": {
            //   maxHeight: "50vh",
            //   overflowY: "scroll",
            // },
          }}
        >
          为什么选择我们？
        </Typography>
        <ControlledAccordions />
      </Container>
    </ThemeProvider>
  );
}

export default Pricing;
