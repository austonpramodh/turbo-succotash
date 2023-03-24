/* eslint-disable1 */
import { Button, Grid, Paper } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { Fragment } from 'react';
import ReactJson from 'react-json-view';

import { apiHost } from '../../utils/constants';
import useSetState from '../../utils/useSetState';

import AddTodoForm from './AddTodoForm';
import ListTodos from './ListTodos';

const styles: Record<string, React.CSSProperties> = {
  Paper: {
    padding: 20,
    margin: 'auto',
    textAlign: 'center',
    width: 500,
    marginTop: 16,
  },
};

interface Todo {
  id: string;
  name: string;
  isDone: boolean;
}

export interface ExtendedTodo extends Todo {
  isLoading?: boolean;
  isEditMode?: boolean;
}

const TodoList: React.FunctionComponent = () => {
  const [state, setState] = useSetState<{
    todos: ExtendedTodo[];
    isLoading: boolean;
  }>({
    todos: [],
    isLoading: false,
  });

  const { enqueueSnackbar } = useSnackbar();

  const fetchTodos = async (): Promise<void> => {
    setState({
      isLoading: true,
    });

    axios
      .get<{
        data: Todo[];
        success: boolean;
        message: string;
      }>(`${apiHost}/v1/todos`)
      .then((response) => {
        setState({
          isLoading: false,
          todos: response.data.data,
        });
      })
      .catch(() => {
        setState({
          isLoading: false,
        });
      });
  };

  React.useEffect(() => {
    fetchTodos();
  }, []);

  const onSubmitTodo = async (data: { name: string }): Promise<void> => {
    // Call the api and
    // push to todo list
    try {
      const response = await axios.post<{
        data: Todo;
        success: boolean;
        message: string;
      }>(`${apiHost}/v1/todos`, data);

      setState((state) => ({
        ...state,
        todos: [...state.todos, response.data.data],
      }));

      enqueueSnackbar(`Todo "${data?.name}" created successfully!`, {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(`Todo "${data?.name}" creation unsuccessful!`, {
        variant: 'error',
      });
      throw error;
    }
  };

  const onUpdateTodo = async (
    id: Todo['id'],
    updatedTodo: Todo,
  ): Promise<void> => {
    const oldTodo = state.todos.find((todo) => todo.id === id);

    try {
      setState((state) => ({
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id === updatedTodo.id) todo.isLoading = true;

          return todo;
        }),
      }));

      const response = await axios.patch<{
        data: Todo;
        success: boolean;
        message: string;
      }>(`${apiHost}/v1/todos/${updatedTodo.id}`, updatedTodo);

      const {
        data: { data: newTodo },
      } = response;

      setState((state) => ({
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === newTodo.id ? newTodo : todo,
        ),
      }));
      enqueueSnackbar(`Todo "${oldTodo?.name}" updated successfully!`, {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar(`Todo "${oldTodo?.name}" updation unsuccessful!`, {
        variant: 'error',
      });

      setState((state) => ({
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id === updatedTodo.id) todo.isLoading = false;

          return todo;
        }),
      }));
    }
  };

  const onEditTodo = (id: Todo['id'], editMode: boolean): void => {
    setState((state) => ({
      ...state,
      todos: state.todos.map((todo) => {
        // Remove all other from edit mode
        todo.isEditMode = false;

        if (todo.id === id) todo.isEditMode = editMode;

        return todo;
      }),
    }));
  };

  const onDeleteTodo = async (id: Todo['id']): Promise<void> => {
    const todoToBeDeleted = state.todos.find((todo) => todo.id === id);

    try {
      setState((state) => ({
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id === id) {
            todo.isLoading = true;
          }

          return todo;
        }),
      }));

      await axios.delete<{
        success: boolean;
        message: string;
      }>(`${apiHost}/v1/todos/${id}`);

      setState((state) => ({
        ...state,
        todos: state.todos.filter((todo) => todo.id !== id),
      }));

      enqueueSnackbar(`Todo "${todoToBeDeleted?.name}" deleted successfully!`, {
        variant: 'success',
      });
    } catch (error) {
      // Toastify error
      enqueueSnackbar(
        `Todo "${todoToBeDeleted?.name}" deletion unsuccessful!`,
        {
          variant: 'error',
        },
      );
    } finally {
      setState((state) => ({
        ...state,
        todos: state.todos.map((todo) => {
          if (todo.id === id) todo.isLoading = false;

          return todo;
        }),
      }));
    }
  };

  return (
    <Fragment>
      <Grid container spacing={0}>
        <Grid item xs={12}>
          <Paper style={styles.Paper}>
            <AddTodoForm onSubmitTodo={onSubmitTodo} />
            <Button
              variant="contained"
              disabled={state.isLoading}
              onClick={fetchTodos}
            >
              Refresh State
            </Button>
          </Paper>
          <Paper style={styles.Paper}>
            <ListTodos
              todos={state.todos}
              onUpdate={onUpdateTodo}
              onDelete={onDeleteTodo}
              onEditTodo={onEditTodo}
              isLoading={state.isLoading}
            />
          </Paper>
          <Paper style={styles.Paper}>
            <ReactJson src={state} />
          </Paper>
        </Grid>
      </Grid>
    </Fragment>
  );
};

export default TodoList;
