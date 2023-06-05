import React from "react";
import { Grid, Paper, Typography } from "@mui/material";
import "./Banner.scss";

const Banner = () => {
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        <Paper
          className="banner"
          sx={{
            height: "60px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
          }}
        >
          <Typography variant="subtitle1">
            新增越狱模式，企业合作请联系客服微信：zyt757620782
          </Typography>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default Banner;
