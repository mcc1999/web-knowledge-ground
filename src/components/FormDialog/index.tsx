import { Box } from "@mui/material";
import React from "react";
import {
  UseFormReturn,
  FieldValues,
  UseFormProps,
  useForm,
} from "react-hook-form";
import { ZodSchema } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import BaseDialog, { BaseDialogProps } from "../BaseDialog";

export interface FormDialogProps<T extends FieldValues, S extends ZodSchema>
  extends Omit<BaseDialogProps, "onOk" | "onSubmit" | "children"> {
  defaultValues?: UseFormProps<T>["defaultValues"];
  onSubmit: (data: T) => void | Promise<void>;
  schema: S;
  children: (methods: UseFormReturn<T>) => React.ReactNode;
}

function FormDialog<T extends FieldValues, S extends ZodSchema>({
  defaultValues,
  onSubmit,
  schema,
  children,
  ...dialogProps
}: FormDialogProps<T, S>) {
  const methods = useForm<T>({
    mode: "onChange",
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = () => {
    methods.handleSubmit(onSubmit)();
  };

  return (
    <BaseDialog {...dialogProps} onOk={handleSubmit}>
      <Box component="form">{children(methods)}</Box>
    </BaseDialog>
  );
}

export default FormDialog;
