import { useForm, Resolver } from "react-hook-form";
import { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

async function deleteTask (id: string, updateTasks: (id: string) => void) {
    try {
        const response = await fetch(`http://localhost:3000/tasks/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la suppression du sprint:");
        }

        console.log(`Le projet ${id} a bien été supprimé.`);
        updateTasks(id);
    } catch (error) {
        console.error("Erreur lors de la suppression du sprint:", error);
    }
}
export function GetTasks() {

    const [tasks, setTasks] = useState([])

    useEffect(() => {
        async function fetchTasks() {
            const data = await fetch("http://localhost:3000/tasks")
                .then(res => res.json())
                const formattedData = data.map((task: any) => ({
                  id: task._id,
                  name: task.name,
                  done: task.done ? "Fait" : "A Faire",
                  tasks: task.tasks.length,
                }));
                
                setTasks(formattedData)
        }
        fetchTasks();
        const interval = setInterval(fetchTasks,1000);
        return () => clearInterval(interval);
    }, [])
    const handleDelete = (id: string) => {
        setTasks((prevTasks) =>
            prevTasks.filter((project: any) => project._id !== id)
        );
    };

    const columns: GridColDef<(typeof tasks)[number]>[] = [
      { field: "id", headerName: "ID", width: 200,}, 
      { field: "name", headerName: "Nom", width: 200 },
      { field: "done", headerName: "Statut", width: 250 },
      { field: "tasks", headerName: "Taches", width: 250 },
      {field: "delete", headerName: "Supprimer", width: 150,    renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => deleteTask((params.row as any).id,handleDelete)}
        >
          Supprimer
        </Button>)}
    ];
      
      return (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            columnVisibilityModel={{
              id: false,
              tasks:false,
            }}
            rows={tasks}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
          />
        </Box>
      );
}
type FormValues = {
  name: string;
  done: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.name ? values : {},
    errors: !values.name
      ? {
          name: {
            type: "required",
            message: "name is required.",
          },
        }
      : {},
  };
};

export function CreateTask() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver });


  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch("http://localhost:3000/tasks/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("erreur lors de l'envoi");
      }
      const result = await response.json();
      console.log("Données envoyé:", result);
    } catch (error) {
      console.error("erreur lors de l'envoi:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register("name")} placeholder="name" />
        {errors?.name && <p>{errors.name.message}</p>}
      </div>
      <div>
        <input {...register("done")} placeholder="desc" type="checkbox" />
      </div>

      <input type="submit" />
    </form>
  );
}
