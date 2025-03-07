import useWebPlaygroundStore from "@/store";
import { TodoTask, TodoTaskStatus } from "@/store/calendar";
import { Badge, Box, Typography } from "@mui/material";
import LinearProgress, {
  LinearProgressProps,
} from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";

export interface DataAnalysisProps {
  todoTasks: Record<string, TodoTask[]>;
}

export interface ProgressValues {
  [TodoTaskStatus.TODO]: number;
  [TodoTaskStatus.DOING]: number;
  [TodoTaskStatus.DONE]: number;
}
function LinearProgressWithLabel({
  progressValues,
  label,
  ...props
}: LinearProgressProps & {
  progressValues: ProgressValues;
  label: TodoTaskStatus;
}) {
  const total =
    progressValues[TodoTaskStatus.TODO] +
    progressValues[TodoTaskStatus.DOING] +
    progressValues[TodoTaskStatus.DONE];
  const value =
    total === 0 ? 0 : Math.round((progressValues[label] / total) * 100);

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: "purple.light",
        paddingInline: "12px",
        borderRadius: "8px",
      }}
    >
      <Box sx={{ minWidth: 42 }}>
        <Badge
          badgeContent={progressValues[label]}
          color={props.color as any}
          anchorOrigin={{ vertical: "top", horizontal: "left" }}
        >
          <Typography
            variant="body2"
            sx={{ fontWeight: "bold", color: props.color, paddingLeft: "8px" }}
          >
            {label.toUpperCase()}:
          </Typography>
        </Badge>
      </Box>
      <Box sx={{ width: "100%", marginInline: 2 }}>
        <LinearProgress variant="determinate" value={value} {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2">{`${value}%`}</Typography>
      </Box>
    </Box>
  );
}
export default function DataAnalysis({ todoTasks }: DataAnalysisProps) {
  const [progressValues, setProgressValue] = useState<ProgressValues>({
    todo: 0,
    doing: 0,
    done: 0,
  });
  useEffect(() => {
    setProgressValue({
      todo: Object.values(todoTasks).reduce(
        (acc, curr) => acc + curr.filter((t) => t.status === "todo").length,
        0
      ),
      doing: Object.values(todoTasks).reduce(
        (acc, curr) => acc + curr.filter((t) => t.status === "doing").length,
        0
      ),
      done: Object.values(todoTasks).reduce(
        (acc, curr) => acc + curr.filter((t) => t.status === "done").length,
        0
      ),
    });
  }, [todoTasks]);
  return (
    <Box className="data-analysis" sx={{ bgcolor: "cardBg.main" }}>
      <Box
        className="data-analysis__header"
        sx={{
          bgcolor: "itemBg.main",
        }}
      >
        Data Analysis
      </Box>
      <div className="data-analysis__content">
        <LinearProgressWithLabel
          label={TodoTaskStatus.TODO}
          progressValues={progressValues}
          color="warning"
        />
        <LinearProgressWithLabel
          label={TodoTaskStatus.DOING}
          progressValues={progressValues}
          color="info"
        />
        <LinearProgressWithLabel
          label={TodoTaskStatus.DONE}
          progressValues={progressValues}
          color="success"
        />
      </div>
    </Box>
  );
}
