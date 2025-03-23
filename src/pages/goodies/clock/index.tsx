import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  IconButton,
  InputLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useLocalStorageState } from "ahooks";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSnackbar } from "notistack";
import CheckpointsDialog from "./components/CheckpointsDialog";

dayjs.extend(duration);

// 计时类型
enum TimerType {
  COUNTDOWN = "countdown",
  NORMAL = "normal",
}

// 内容标签
enum ContentTag {
  DATA_ANALYSIS = "data_analysis",
  QUANTITY = "quantity",
  POLITICS = "politics",
  LANGUAGE = "language",
  LOGIC = "logic",
}

const ContentTagConfig = {
  [ContentTag.DATA_ANALYSIS]: { label: "资料分析", color: "#ff4d4f" },
  [ContentTag.QUANTITY]: { label: "数量关系", color: "#1890ff" },
  [ContentTag.POLITICS]: { label: "时政常识", color: "#52c41a" },
  [ContentTag.LANGUAGE]: { label: "言语理解", color: "#722ed1" },
  [ContentTag.LOGIC]: { label: "判断推论", color: "#faad14" },
};

// 打点信息
export interface Checkpoint {
  id: number;
  time: number; // 打点时间（相对于开始时间的毫秒数）
  interval: number; // 与上一次打点的时间间隔
  name: string; // 打点名称
}

// 计时记录
interface TimerRecord {
  id: number;
  name: string;
  type: TimerType;
  score: string; // 成绩
  duration: number; // 总时长（毫秒）
  checkpoints?: Checkpoint[]; // 打点信息（仅倒计时模式）
  contentTag?: ContentTag; // 内容标签（仅普通计时模式）
  createdAt: number;
}

const Clock: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  // 计时模式
  const [timerType, setTimerType] = useState<TimerType>(TimerType.COUNTDOWN);
  // 倒计时总时间（毫秒）
  const [countdownDuration, setCountdownDuration] = useState<number>(
    90 * 60000
  );
  // 当前剩余时间
  const [remainingTime, setRemainingTime] = useState<number>(0);
  // 是否正在计时
  const [isRunning, setIsRunning] = useState<boolean>(false);
  // 计时记录
  const [records, setRecords] = useLocalStorageState<TimerRecord[]>(
    "timer_records",
    {
      defaultValue: [],
    }
  );

  // 表格搜索项状态
  const [nameSearch, setNameSearch] = useState<string>("");
  const [typeSearch, setTypeSearch] = useState<TimerType | "">("");
  const [tagSearch, setTagSearch] = useState<string>("");

  // 节点信息
  const [editingCheckpoints, setEditingCheckpoints] = useState<{
    recordId: number;
    checkpoints: Checkpoint[];
  } | null>(null);

  // 表格删除确认
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // 打点信息，需要在interval中获取最新值，不能用 state，要用 ref
  const checkpointsRef = useRef<Checkpoint[]>([]);
  // 计时器引用
  const timerRef = useRef<NodeJS.Timeout>();
  // 开始时间引用
  const startTimeRef = useRef<number>(0);
  // 暂停时剩余时间引用
  const pausedTimeRef = useRef<number>(0);

  // 组件卸载时清理计时器
  useEffect(() => {
    return () => clearTimer();
  }, []);

  // 添加更新节点名称的函数
  const updateCheckpointName = (checkpoint: Checkpoint) => {
    if (!editingCheckpoints) return;

    setRecords(
      records.map((record) =>
        record.id === editingCheckpoints.recordId
          ? {
              ...record,
              checkpoints: record.checkpoints?.map((cp) =>
                cp.id === checkpoint.id ? checkpoint : cp
              ),
            }
          : record
      )
    );

    setEditingCheckpoints({
      ...editingCheckpoints,
      checkpoints: editingCheckpoints.checkpoints.map((cp) =>
        cp.id === checkpoint.id ? checkpoint : cp
      ),
    });
  };

  // 更新记录名称
  const updateRecordName = (id: number, name: string) => {
    setRecords(
      records.map((record) => (record.id === id ? { ...record, name } : record))
    );
  };

  // 更新内容标签
  const updateContentTag = (id: number, tag: ContentTag) => {
    setRecords(
      records.map((record) =>
        record.id === id ? { ...record, contentTag: tag } : record
      )
    );
  };

  // 添加更新成绩的函数
  const updateRecordScore = (id: number, score: string) => {
    setRecords(
      records.map((record) =>
        record.id === id ? { ...record, score } : record
      )
    );
  };

  // 过滤记录
  const filteredRecords = records.filter((record) => {
    const nameMatch = record.name
      .toLowerCase()
      .includes(nameSearch.toLowerCase());
    const typeMatch = !typeSearch || record.type === typeSearch;
    const tagMatch =
      !tagSearch ||
      (record.contentTag &&
        ContentTagConfig[record.contentTag].label
          .toLowerCase()
          .includes(tagSearch.toLowerCase())) ||
      record.checkpoints?.some((cp) =>
        cp.name.toLowerCase().includes(tagSearch.toLowerCase())
      );

    return nameMatch && typeMatch && tagMatch;
  });

  // 格式化时间显示（毫秒转换为 mm:ss.SSS 格式）
  const formatTime = (ms: number, showMilliseconds: boolean = true) => {
    const duration = dayjs.duration(ms);
    const baseTime = `${String(duration.hours()).padStart(2, "0")}:${String(
      duration.minutes()
    ).padStart(2, "0")}:${String(duration.seconds()).padStart(2, "0")}`;

    return showMilliseconds
      ? `${baseTime}.${String(Math.floor(duration.milliseconds())).padStart(
          3,
          "0"
        )}`
      : baseTime;
  };

  // 清理计时器
  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = undefined;
    }
  };

  // 重置计时器状态
  const resetTimer = () => {
    clearTimer();
    setIsRunning(false);
    setRemainingTime(0);
    setCountdownDuration(90 * 60000);
    checkpointsRef.current = [];
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
  };

  // 开始计时
  const startTimer = () => {
    if (timerType === TimerType.COUNTDOWN && countdownDuration <= 0) return;

    clearTimer();
    setIsRunning(true);
    startTimeRef.current = Date.now() - (pausedTimeRef.current || 0);

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;

      if (timerType === TimerType.COUNTDOWN) {
        const remaining = countdownDuration - elapsed;
        if (remaining <= 0) {
          endTimer();
        } else {
          setRemainingTime(remaining);
        }
      } else {
        setRemainingTime(elapsed);
      }
    }, 10); // 每 10ms 更新一次显示
  };

  // 暂停计时
  const pauseTimer = () => {
    clearTimer();
    setIsRunning(false);
    pausedTimeRef.current = Date.now() - startTimeRef.current;
  };

  // 添加打点
  const addCheckpoint = () => {
    if (!isRunning || timerType !== TimerType.COUNTDOWN) return;

    const currentTime = countdownDuration - remainingTime;
    const lastCheckpoint =
      checkpointsRef.current[checkpointsRef.current.length - 1];
    const checkpointNumber = checkpointsRef.current.length + 1;

    const newCheckpoint: Checkpoint = {
      id: Date.now(),
      time: currentTime,
      interval: lastCheckpoint
        ? currentTime - lastCheckpoint.time
        : currentTime,
      name: `节点 ${checkpointNumber}`,
    };

    checkpointsRef.current = [...checkpointsRef.current, newCheckpoint];
    enqueueSnackbar(`节点 ${checkpointNumber} 记录成功`, {
      variant: "success",
      autoHideDuration: 1000,
    });
  };

  // 结束计时并保存记录
  const endTimer = () => {
    clearTimer();
    setIsRunning(false);

    const duration =
      timerType === TimerType.COUNTDOWN
        ? countdownDuration - remainingTime
        : remainingTime;

    const newRecord: TimerRecord = {
      id: Date.now(),
      name: `记录 ${records.length + 1}`,
      type: timerType,
      score: "",
      duration,
      checkpoints:
        timerType === TimerType.COUNTDOWN
          ? [...checkpointsRef.current]
          : undefined,
      createdAt: Date.now(),
    };

    setRecords([newRecord, ...records]);
    // 重置计时器状态
    resetTimer();
  };

  // 删除记录
  const deleteRecord = (id: number) => {
    if (isRunning || pausedTimeRef.current > 0) {
      enqueueSnackbar("当前存在计时任务，请结束后再操作", {
        variant: "error",
        autoHideDuration: 2000,
      });
    } else {
      setDeleteConfirm(id);
    }
  };

  // 添加确认删除函数
  const confirmDelete = () => {
    if (deleteConfirm) {
      setRecords(records.filter((record) => record.id !== deleteConfirm));
      setDeleteConfirm(null);
      enqueueSnackbar("记录已删除", {
        variant: "success",
        autoHideDuration: 2000,
      });
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: "1200px",
        margin: "0 auto",
        color: "text.primary",
      }}
    >
      {/* 计时器控制部分 */}
      <Box
        sx={{
          mb: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            fontSize: "5em",
            fontWeight: 300,
            letterSpacing: "0.02em",
            mb: 3,
            fontFamily: "Roboto Mono, monospace", // 使用等宽字体
            color: "primary.main",
            width: "600px", // 固定宽度
            textAlign: "center",
            "& > span": {
              display: "inline-block",
              width: "0.6em", // 固定每个数字的宽度
              textAlign: "center",
            },
          }}
        >
          {formatTime(
            timerType === TimerType.COUNTDOWN ? remainingTime : remainingTime
          )
            .split("")
            .map((char, index) => (
              <span key={index}>{char}</span>
            ))}
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Select
            value={timerType}
            onChange={(e) => {
              if (isRunning) {
                enqueueSnackbar("请先结束当前计时", {
                  variant: "warning",
                  autoHideDuration: 2000,
                });
                return;
              }
              setTimerType(e.target.value as TimerType);
              resetTimer();
            }}
            size="small"
            disabled={isRunning}
            sx={{
              height: "36px",
              minWidth: "120px",
              backgroundColor: "background.paper",
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
            }}
          >
            <MenuItem value={TimerType.COUNTDOWN}>倒计时模式</MenuItem>
            <MenuItem value={TimerType.NORMAL}>计时器模式</MenuItem>
          </Select>

          {timerType === TimerType.COUNTDOWN && (
            <TextField
              type="number"
              size="small"
              label="倒计时时间(分钟)"
              value={countdownDuration / 60000}
              onChange={(e) =>
                setCountdownDuration(Number(e.target.value) * 60000)
              }
              disabled={isRunning}
              sx={{
                "& .MuiOutlinedInput-root": {
                  height: "36px",
                },
              }}
            />
          )}

          <Button
            variant="contained"
            onClick={isRunning ? pauseTimer : startTimer}
            disabled={
              timerType === TimerType.COUNTDOWN && countdownDuration <= 0
            }
            sx={{
              height: "36px",
              px: 3,
              borderRadius: "18px",
              textTransform: "none",
              fontWeight: 400,
            }}
          >
            {isRunning
              ? "暂停"
              : pausedTimeRef.current > 0
              ? "继续计时"
              : "开始"}
          </Button>

          <Button
            variant="contained"
            color="error"
            onClick={endTimer}
            disabled={!isRunning && pausedTimeRef.current === 0}
            sx={{
              height: "36px",
              px: 3,
              borderRadius: "18px",
              textTransform: "none",
              fontWeight: 400,
            }}
          >
            结束计时
          </Button>

          {timerType === TimerType.COUNTDOWN && (
            <Button
              variant="outlined"
              onClick={addCheckpoint}
              disabled={!isRunning}
              sx={{
                height: "36px",
                px: 3,
                borderRadius: "18px",
                textTransform: "none",
                fontWeight: 400,
                "&:hover": {
                  backgroundColor: "rgba(0,113,227,0.04)",
                },
              }}
            >
              记录节点
            </Button>
          )}
        </Box>
      </Box>

      {/* 搜索框组和表格的样式，使其更加统一： */}
      <Paper
        sx={{
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          height: "calc(100vh - 340px)", // 固定整体高度
          padding: "0 16px 16px 16px",
        }}
      >
        {/* 搜索框组 */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            gap: 2,
            borderBottom: "2px solid",
            borderColor: "primary.main",
          }}
        >
          <TextField
            size="small"
            label="搜索记录名称"
            value={nameSearch}
            onChange={(e) => setNameSearch(e.target.value)}
            sx={{
              flex: 2,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />

          <FormControl sx={{ flex: 1 }}>
            <InputLabel size="small">计时类型</InputLabel>
            <Select
              size="small"
              label="计时类型"
              value={typeSearch}
              onChange={(e) => setTypeSearch(e.target.value as TimerType | "")}
              sx={{
                borderRadius: "8px",
              }}
            >
              <MenuItem value="">所有类型</MenuItem>
              <MenuItem value={TimerType.COUNTDOWN}>倒计时</MenuItem>
              <MenuItem value={TimerType.NORMAL}>计时器</MenuItem>
            </Select>
          </FormControl>

          <TextField
            size="small"
            label="搜索标签/节点"
            value={tagSearch}
            onChange={(e) => setTagSearch(e.target.value)}
            sx={{
              flex: 1.5,
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
            }}
          />
        </Box>

        {/* 表格容器 */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* 表头 */}
          <Table sx={{ tableLayout: "fixed" }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 500, width: "20%" }}>
                  记录名称
                </TableCell>
                <TableCell sx={{ fontWeight: 500, width: "10%" }}>
                  成绩
                </TableCell>
                <TableCell sx={{ fontWeight: 500, width: "10%" }}>
                  类型
                </TableCell>
                <TableCell sx={{ fontWeight: 500, width: "15%" }}>
                  时长
                </TableCell>
                <TableCell sx={{ fontWeight: 500, width: "20%" }}>
                  节点信息/内容标签
                </TableCell>
                <TableCell sx={{ fontWeight: 500, width: "15%" }}>
                  创建时间
                </TableCell>
                <TableCell sx={{ fontWeight: 500, width: "10%" }}>
                  操作
                </TableCell>
              </TableRow>
            </TableHead>
          </Table>

          {/* 表格体 - 可滚动区域 */}
          <TableContainer
            sx={{
              maxHeight: "calc(100vh - 502.5px)",
              overflowY: "scroll",
            }}
          >
            <Table sx={{ tableLayout: "fixed" }}>
              <TableBody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell sx={{ width: "20%" }}>
                        <TextField
                          size="small"
                          value={record.name}
                          onChange={(e) =>
                            updateRecordName(record.id, e.target.value)
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "transparent",
                              "&:hover fieldset": {
                                border: "1px solid primary.main",
                              },
                              "&.Mui-focused fieldset": {
                                border: "1px solid primary.main",
                              },
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        <TextField
                          size="small"
                          value={record.score || ""}
                          onChange={(e) =>
                            updateRecordScore(record.id, e.target.value)
                          }
                          sx={{
                            "& .MuiOutlinedInput-root": {
                              backgroundColor: "transparent",
                              "&:hover fieldset": {
                                border: "1px solid primary.main",
                              },
                              "&.Mui-focused fieldset": {
                                border: "1px solid primary.main",
                              },
                            },
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ color: "#86868b", width: "10%" }}>
                        {record.type === TimerType.COUNTDOWN
                          ? "倒计时"
                          : "计时器"}
                      </TableCell>
                      <TableCell sx={{ width: "15%" }}>
                        {formatTime(record.duration, false)}
                      </TableCell>
                      <TableCell sx={{ width: "20%" }}>
                        {record.type === TimerType.COUNTDOWN ? (
                          <Box
                            sx={{
                              cursor: record.checkpoints?.length
                                ? "pointer"
                                : "default",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                              color: record.checkpoints?.length
                                ? "primary.main"
                                : "text.disabled",
                              fontSize: "14px",
                              fontWeight: 500,
                              transition: "opacity 0.2s ease",
                              "&:hover": {
                                opacity: record.checkpoints?.length ? 0.7 : 1,
                              },
                            }}
                            onClick={() => {
                              if (record.checkpoints?.length) {
                                setEditingCheckpoints({
                                  recordId: record.id,
                                  checkpoints: record.checkpoints || [],
                                });
                              }
                            }}
                          >
                            <span>
                              {record.checkpoints?.length || 0} 个节点
                            </span>
                          </Box>
                        ) : (
                          <Select
                            size="small"
                            value={record.contentTag || ""}
                            onChange={(e) =>
                              updateContentTag(
                                record.id,
                                e.target.value as ContentTag
                              )
                            }
                            sx={{
                              height: "32px",
                              minWidth: "120px",
                            }}
                          >
                            <MenuItem value="">选择标签</MenuItem>
                            {Object.entries(ContentTagConfig).map(
                              ([key, config]) => (
                                <MenuItem key={key} value={key}>
                                  {config.label}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        )}
                      </TableCell>
                      <TableCell sx={{ color: "#86868b", width: "15%" }}>
                        {dayjs(record.createdAt).format("YYYY-MM-DD HH:mm:ss")}
                      </TableCell>
                      <TableCell sx={{ width: "10%" }}>
                        <IconButton
                          size="small"
                          sx={{
                            color: "#86868b",
                            "&:hover": {
                              color: "#e51d1d",
                              backgroundColor: "rgba(229,29,29,0.04)",
                            },
                          }}
                          onClick={() => deleteRecord(record.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow sx={{ height: "calc(100vh - 502.5px)" }}>
                    <TableCell
                      colSpan={6}
                      sx={{ textAlign: "center", py: 8, border: "none" }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 2,
                          color: "text.secondary",
                        }}
                      >
                        <Box sx={{ fontSize: "0.875rem" }}>暂无记录</Box>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>
      {!!editingCheckpoints?.checkpoints.length && (
        <CheckpointsDialog
          open={!!editingCheckpoints}
          onClose={() => setEditingCheckpoints(null)}
          checkpoints={editingCheckpoints.checkpoints}
          onUpdateCheckpoint={updateCheckpointName}
          formatTime={formatTime}
        />
      )}
      <Dialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            width: "400px",
          },
        }}
      >
        <DialogTitle>确认删除</DialogTitle>
        <DialogContent>{`确定要删除${
          records.find((i) => i.id === deleteConfirm)?.name
            ? records.find((i) => i.id === deleteConfirm)!.name
            : ""
        }吗？此操作无法撤销。`}</DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            onClick={() => setDeleteConfirm(null)}
            sx={{
              color: "text.secondary",
              "&:hover": {
                backgroundColor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            取消
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            color="error"
            sx={{
              px: 3,
              borderRadius: "18px",
              textTransform: "none",
              fontWeight: 400,
            }}
          >
            删除
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Clock;
