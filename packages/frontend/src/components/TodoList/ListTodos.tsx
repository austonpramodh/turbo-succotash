import { Check, DeleteForever, Edit } from '@mui/icons-material';
import {
  Box,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  IconButton,
  TextField,
  Typography,
} from '@mui/material';
import React, { Fragment } from 'react';

import { ExtendedTodo } from '.';

interface Props {
  todos: ExtendedTodo[];
  onUpdate: (id: ExtendedTodo['id'], updatedTodo: ExtendedTodo) => void;
  onDelete: (id: ExtendedTodo['id']) => void;
  onEditTodo: (id: ExtendedTodo['id'], editMode: boolean) => void;
  isLoading: boolean;
}

const TodoView: React.FunctionComponent<{
  todo: ExtendedTodo;
  onUpdate: (id: ExtendedTodo['id'], updatedTodo: ExtendedTodo) => void;
  onDelete: (id: ExtendedTodo['id']) => void;
  onEditTodo: (id: ExtendedTodo['id'], editMode: boolean) => void;
}> = ({ todo, onUpdate, onDelete, onEditTodo }) => {
  const [state, setState] = React.useState(todo.name);

  return (
    <Box
      sx={{
        p: 2,
        // background: "yellow",
        textAlign: 'left',
        border: '1px solid black',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      {todo.isEditMode ? (
        <Fragment>
          <TextField
            id="outlined-basic"
            label="Name"
            variant="outlined"
            defaultValue={todo.name}
            disabled={todo.isLoading}
            value={state}
            onChange={(e): void => {
              setState(e.target.value);
            }}
            sx={{
              flexGrow: 1,
            }}
          />
          <IconButton
            disabled={todo.isLoading || state.length < 2}
            onClick={(): void =>
              onUpdate(todo.id, {
                ...todo,
                name: state,
              })
            }
          >
            <Check />
          </IconButton>
        </Fragment>
      ) : (
        <Fragment>
          <FormControlLabel
            sx={{
              flexGrow: 1,
              textDecoration: todo.isDone ? 'line-through' : 'none',
            }}
            disabled={todo.isLoading}
            control={
              <Checkbox
                checked={todo.isDone}
                onChange={(): void =>
                  onUpdate(todo.id, {
                    ...todo,
                    isDone: !todo.isDone,
                  })
                }
              />
            }
            label={todo.name}
          />
          <IconButton
            disabled={todo.isLoading}
            onClick={(): void => onEditTodo(todo.id, true)}
          >
            <Edit />
          </IconButton>
          <IconButton
            disabled={todo.isLoading}
            onClick={(): void => onDelete(todo.id)}
          >
            <DeleteForever />
          </IconButton>
        </Fragment>
      )}
    </Box>
  );
};

const ListTodos: React.FunctionComponent<Props> = ({
  todos,
  onDelete,
  onUpdate,
  onEditTodo,
  isLoading,
}) => {
  return (
    <Box>
      <Typography
        variant="h6"
        sx={{
          mb: 2,
        }}
      >
        Your todos
      </Typography>

      {isLoading && <CircularProgress />}
      <FormGroup>
        {todos.length === 0 && (
          <Typography variant="overline">---No Todos Yet!!---</Typography>
        )}
        {todos.map((todo) => {
          return (
            <TodoView
              key={todo.id}
              todo={todo}
              onDelete={onDelete}
              onUpdate={onUpdate}
              onEditTodo={onEditTodo}
            />
          );
        })}
      </FormGroup>
    </Box>
  );
};

export default ListTodos;
