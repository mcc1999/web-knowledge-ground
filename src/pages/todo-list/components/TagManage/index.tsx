"use client";
import { Box, Button, Chip, Popover, TextField } from "@mui/material";
import React, { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import useWebPlaygroundStore from "@/store";
import FormDialog from "@/components/FormDialog";
import { object, string, TypeOf } from "zod";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";
import { CalendarTag } from "@/store/calendar";
import { useSnackbar } from "notistack";

const registerSchema = object({
  name: string().min(1, "请输入Tag名称").max(6, "Tag 名称长度不能超过6个字符"),
});

type RegisterInput = TypeOf<typeof registerSchema>;
export default function TagManage() {
  const [createTagOpen, setCreateTagOpen] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<CalendarTag | undefined>(
    undefined
  );
  const [calendarTags, addCalendarTag, deleteCalendarTag] = useWebPlaygroundStore((state) => [
    state.calendarTags,
    state.addCalendarTag,
    state.deleteCalendarTag,
  ]);
  const { enqueueSnackbar } = useSnackbar();

  function handleClose() {
    setCreateTagOpen(false);
  }

  function handleCreateTag(value: RegisterInput) {
    addCalendarTag(value.name);
    setCreateTagOpen(false);
  }

  function handleDeleteItem() {
    if (!tagToDelete) return;
    
    const success = deleteCalendarTag(tagToDelete.id);
    if (success) {
      enqueueSnackbar("标签删除成功", { variant: "success" });
    } else {
      enqueueSnackbar("标签删除失败：该标签正在被使用", { variant: "error" });
    }    
    setTagToDelete(undefined);
  }

  return (
    <>
      <Box className="tag-manage" sx={{ bgcolor: "cardBg.main" }}>
        <Box
          className="tag-manage__header"
          sx={{
            bgcolor: "itemBg.main",
          }}
        >
          <div>
            Tag Manage
            <Box
              className="tag-manage__header-count"
              sx={{ bgcolor: "primary.main" }}
            >
              {calendarTags.length}
            </Box>
          </div>
          <AddIcon
            sx={{ cursor: "pointer" }}
            onClick={() => setCreateTagOpen(true)}
          />
        </Box>
        <div className="tag-manage__content">
          {calendarTags.map((tag) => (
            <Chip
              key={tag.id}
              label={"#" + tag.value}
              deleteIcon={
                <CancelIcon
                  id={`deleteIconButton${tag.id}`}
                  sx={{
                    cursor: "pointer",
                  }}
                />
              }
              onDelete={() => {
                setTagToDelete(tag);
              }}
            />
          ))}
        </div>
      </Box>
      <Popover
        open={!!tagToDelete}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        anchorEl={document.getElementById(`deleteIconButton${tagToDelete?.id}`)}
      >
        <Box
          sx={{
            padding: "12px 24px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <InfoIcon color="warning" sx={{ marginRight: 1 }} />
          确认删除吗？
        </Box>
        <div style={{ padding: "12px 24px" }}>
          <Button
            size="small"
            variant="contained"
            sx={{ marginRight: 1 }}
            onClick={handleDeleteItem}
          >
            确认
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setTagToDelete(undefined)}
          >
            取消
          </Button>
        </div>
      </Popover>
      {createTagOpen && (
        <FormDialog
          title="Create Tag"
          open={createTagOpen}
          schema={registerSchema}
          slotProps={{ paper: { sx: { width: "350px" } } }}
          onCancel={handleClose}
          onSubmit={handleCreateTag}
        >
          {({ register, formState: { errors } }) => (
            <TextField
              label="Tag Name"
              required
              fullWidth
              size="small"
              error={!!errors["name"]}
              helperText={errors["name"] ? errors["name"].message : ""}
              {...register("name")}
            />
          )}
        </FormDialog>
      )}
    </>
  );
}
