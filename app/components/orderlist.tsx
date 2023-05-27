import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getMenberInfo } from "../api/restapi/restapi";
import { Button, Typography } from "@mui/material";

export default function DataGridDemo() {
  const columns: GridColDef[] = [
    //   { field: 'ID', headerName: 'ID', width: 90 },
    {
      field: "post_title",
      headerName: "会员类型",
      width: 150,
      editable: false,
    },
    {
      field: "_start_date",
      headerName: "开始时间",
      width: 300,
      editable: false,
    },
    {
      field: "_end_date",
      headerName: "结束时间",
      // type: 'number',
      width: 300,
      editable: false,
    },
  ];
  const [rows, setRows] = React.useState([]);
  const [showGrid, setShowGrid] = React.useState(true);
  const [showButton, setShowButton] = React.useState(false);
  React.useEffect(() => {
    async function fetchData() {
      const memberInfo = await getMenberInfo();
      if (memberInfo.length === 0) {
        setShowGrid(false);
        setShowButton(true);
        return;
      }
      const newData = memberInfo.map((item: any, index: number) => {
        return {
          ...item,
          id: index + 1,
        };
      });
      setRows(newData);
    }
    fetchData();
  }, []);
  // 依赖数组为空，只在组件加载时调用异步函数

  return (
    <div>
      {showGrid && (
        <Box sx={{ height: 400, width: "100%" }}>
          <Typography variant="h6" sx={{ mb: 2, mt: 4 }}>
            会员列表
          </Typography>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            disableRowSelectionOnClick
          />
        </Box>
      )}
    </div>
  );
}
