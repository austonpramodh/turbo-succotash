import { Button, TextField, Typography } from "@mui/material";
import React, { Fragment } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import useSetState from "../../utils/useSetState";

type IForm = {
  name: string;
};

type Props = {
  onSubmitTodo: (data: IForm) => Promise<void>;
};

const schema = z.object({
  name: z.string().min(1, { message: "Required" }),
});

const AddTodoForm: React.FunctionComponent<Props> = ({ onSubmitTodo }) => {
  const [state, setState] = useSetState<{
    isLoading: boolean;
  }>({
    isLoading: false,
  });

  const {
    handleSubmit,
    control,
    setError,
    reset,
    formState: { errors },
  } = useForm<IForm>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: IForm): Promise<void> => {
    setState({
      isLoading: true,
    });

    try {
      await onSubmitTodo(data);
      reset();
    } catch (error) {
      const typedError = error as Error;

      setError("name", {
        message: typedError.message,
      });
    } finally {
      setState({
        isLoading: false,
      });
    }
  };

  return (
    <Fragment>
      <Typography
        variant="h5"
        sx={{
          mb: 2,
        }}
      >
        Add new Todo
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex" }}>
        <Controller
          name="name"
          control={control}
          defaultValue=""
          rules={{ required: "Todo name is required!" }}
          render={({ field: { onChange, value } }): JSX.Element => (
            <TextField
              fullWidth
              label="Todo"
              variant="filled"
              disabled={state.isLoading}
              value={value}
              onChange={onChange}
              error={!!errors.name}
              helperText={errors.name?.message || " "}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ width: "10%", margin: "auto", marginLeft: "8px" }}
          disabled={state.isLoading}
        >
          Add
        </Button>
      </form>
    </Fragment>
  );
};

export default AddTodoForm;
