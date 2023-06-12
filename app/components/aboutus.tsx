import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ClassNames } from "@emotion/react";
import { Box } from "@mui/system";

export default function ControlledAccordions() {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box
      sx={{
        mb: 10,
        mt: 1,
        // "@media (max-width: 600px)": {
        //   maxHeight: "50vh",
        //   overflowY: "scroll",
        // },
      }}
    >
      <Accordion
        expanded={expanded === "panel1"}
        onChange={handleChange("panel1")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>会员说明</Typography>
          {/* <Typography sx={{ color: "text.secondary" }}>
            I am an accordion
          </Typography> */}
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            所有会员均使用openai官方接口获取回复数据，直连官方接口，速度极快.
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
            你们会持续更新吗？
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            我们团队正在壮大，计划紧跟openai官方的节奏，目前gpt4已支持，但是官方接口权限一直未申请下来，团队也在积极申请接口权限，一旦申请下来就会开放gpt4功能，同时我们也在开发文字生成图片，以及其他更贴合于办公场景的功能，不久就会发布上线.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel3"}
        onChange={handleChange("panel3")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3bh-content"
          id="panel3bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            有售后服务吗？
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            是的，你可以随时给我们的客服留言或者直接添加客服微信进行咨询，客服微信：zyt757620782.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion
        expanded={expanded === "panel4"}
        onChange={handleChange("panel4")}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4bh-content"
          id="panel4bh-header"
        >
          <Typography sx={{ width: "33%", flexShrink: 0 }}>
            会跑路吗？
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            我们已经稳定运行了超过半年时间，团队一直在做ai相关的项目，且目前已经积累一定的用户数量，请放心使用.
          </Typography>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}
