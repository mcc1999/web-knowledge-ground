import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Button,
  DialogActions,
  Box,
} from "@mui/material";
import { Checkpoint } from "../index";

interface CheckpointsDialogProps {
  open: boolean;
  onClose: () => void;
  checkpoints: Checkpoint[];
  onUpdateCheckpoint: (checkpoint: Checkpoint) => void;
  formatTime: (ms: number, showMilliseconds?: boolean) => string;
}

const CheckpointsDialog: React.FC<CheckpointsDialogProps> = ({
  open,
  onClose,
  checkpoints,
  onUpdateCheckpoint,
  formatTime,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
        },
      }}
    >
      <DialogTitle sx={{ borderBottom: "1px solid rgba(0,0,0,0.12)" }}>
        节点详情
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Paper
          sx={{
            bgcolor: "transparent",
            margin: "16px",
            // border: "1px solid #eee",
            borderRadius: "12px",
          }}
        >
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      width: "30%",
                      bgcolor: "transparent",
                    }}
                  >
                    节点名称
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      width: "25%",
                      bgcolor: "transparent",
                    }}
                  >
                    开始时间
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      width: "25%",
                      bgcolor: "transparent",
                    }}
                  >
                    结束时间
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: 500,
                      width: "20%",
                      bgcolor: "transparent",
                    }}
                  >
                    用时
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </Box>
          <TableContainer
            component={Paper}
            elevation={0}
            sx={{ maxHeight: "360px", bgcolor: "transparent" }}
          >
            <Table>
              <TableBody>
                {checkpoints.map((checkpoint, index) => (
                  <TableRow key={checkpoint.id}>
                    <TableCell sx={{ width: "30%" }}>
                      <TextField
                        size="small"
                        fullWidth
                        value={checkpoint.name}
                        onChange={(e) =>
                          onUpdateCheckpoint({
                            ...checkpoint,
                            name: e.target.value,
                          })
                        }
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            backgroundColor: "transparent",
                          },
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ width: "25%" }}>
                      {index === 0
                        ? "00:00:00"
                        : formatTime(checkpoints[index - 1].time, false)}
                    </TableCell>
                    <TableCell sx={{ width: "25%" }}>
                      {formatTime(checkpoint.time, false)}
                    </TableCell>
                    <TableCell sx={{ width: "20%" }}>
                      {formatTime(checkpoint.interval, false)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>关闭</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckpointsDialog;
