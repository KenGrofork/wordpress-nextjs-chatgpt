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

const theme = createTheme({
  palette: {
    primary: {
      main: "#24292f",
    },
    secondary: {
      main: "#f48fb1",
    },
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

  const handleClickOpen = () => {
    setOpen(true);
    setImageURL(
      "https://api.xunhupay.com/payments/wechat/qrcode?id=20232100405&nonce_str=4936118325&time=1684935213&appid=201906155700&hash=889ef4f9ad88850e980f0ab3496e73d8",
    );
  };
  const handleClose = () => {
    setOpen(false);
  };
  // 调用https://chatgpt.funny-code.top/wp-json/wc/v3/orders端口，使用woocommerce restAPI创建一个订单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);
    const productId = formData.get("product_id");
    const selectedOption = membershipOptions.find(
      (option) => option.id === parseInt(productId?.toString() ?? ""),
    );
    const productTitle = selectedOption?.title;
    const productPrice = selectedOption?.price;
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
              payment: "wechat",
              total_fee: productPrice,
              title: productTitle,
            },
          );
          console.log(getpaymentimg.data);
          const qrcode = JSON.parse(getpaymentimg.data);
          console.log(qrcode);
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
        <Typography variant="h4" align="center" sx={{ mb: 6 }}>
          选择一个会员加入我们
        </Typography>
        <Grid
          container
          spacing={4}
          alignItems="center"
          justifyContent="center"
          sx={{ mb: 6 }}
        >
          {membershipOptions.map((option, index) => {
            const key = `membershipOption_${index}`;
            return (
              <Grid item xs={12} sm={6} md={6} lg={3} key={key}>
                <Card
                  sx={{
                    boxShadow: "0px 5px 20px rgba(0, 0, 0, 0.2)",
                    borderRadius: "5px",
                  }}
                  key={key}
                >
                  <CardContent
                    sx={{
                      backgroundColor: index === 3 ? "#f48fb1" : "",
                      color: index === 3 ? "#fff" : "",
                    }}
                  >
                    <Typography variant="h6" align="center" sx={{ mb: 2 }}>
                      {option.title}
                    </Typography>
                    <Typography variant="h5" align="center" sx={{ mb: 4 }}>
                      {option.price ? `¥${option.price}` : `Contact`}
                      <span>/{option.lenth}</span>
                    </Typography>
                    <Typography variant="body2" align="center" sx={{ mb: 4 }}>
                      {option.description}
                    </Typography>
                    <form onSubmit={handleSubmit}>
                      <Button
                        variant={index === 1 ? "contained" : "outlined"}
                        color={
                          option.buttonColor as
                            | "primary"
                            | "secondary"
                            | "error"
                            | "warning"
                            | "info"
                        }
                        fullWidth
                        type="submit"
                      >
                        {option.buttonText}
                      </Button>
                      <input
                        type="hidden"
                        name="product_id"
                        value={option.id}
                      />
                    </form>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
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
          Membership Benefits
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
                  Unlimited Access
                </Typography>
                <Typography variant="body2" sx={{ mb: 4 }}>
                  Access to all of our courses, no limits
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
                  Expert Instructors
                </Typography>
                <Typography variant="body2" sx={{ mb: 4 }}>
                  Our instructors are experts in their fields
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
                  Personalized Learning
                </Typography>
                <Typography variant="body2" sx={{ mb: 4 }}>
                  Custom recommendations and learning plans
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
