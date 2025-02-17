import { useForm, Resolver } from "react-hook-form";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

async function deleteSprint (id: string, updateSprints: (id: string) => void) {
    try {
        const response = await fetch(`http://localhost:3000/sprints/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la suppression du sprint:");
        }

        console.log(`Le projet ${id} a bien été supprimé.`);
        updateSprints(id);
    } catch (error) {
        console.error("Erreur lors de la suppression du sprint:", error);
    }
}
export function GetSprints() {

    const [sprints, setSprints] = useState([])

    useEffect(() => {
        async function fetchSprints() {
            const data = await fetch("http://localhost:3000/sprints")
                .then(res => res.json())
                const formattedData = data.map((sprint: any) => ({
                  id: sprint._id,
                  startDate: sprint.startDate,
                  endDate: sprint.endDate,
                }));
                
                setSprints(formattedData)
        }
        fetchSprints();
        const interval = setInterval(fetchSprints,1000);
        return () => clearInterval(interval);
    }, [])

    const handleDelete = (id: string) => {
        setSprints((prevSprints) =>
            prevSprints.filter((project: any) => project._id !== id)
        );
    };

    const columns: GridColDef<(typeof sprints)[number]>[] = [
      { field: "id", headerName: "ID", width: 200,}, 
      { field: "startDate", headerName: "Debut du sprint", width: 200 },
      { field: "endDate", headerName: "Fin du sprint", width: 250 },
      {field: "delete", headerName: "Supprimer", width: 150,    renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          onClick={() => deleteSprint((params.row as any).id,handleDelete)}
        >
          Supprimer
        </Button>)}
    ];
      
      return (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            columnVisibilityModel={{
              id: false,
            }}
            rows={sprints}
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
  startDate: string;
  endDate: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.startDate && values.endDate ? values : {},
    errors: !values.startDate || !values.endDate
      ? {
        startDate: {
            type: "required",
            message: "startDate is required.",
          },
          endDate: {
            type: "required",
            message: "endDate is required.",
          },
        }
      : {},
  };
};

export function CreateSprint() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver });


  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch("http://localhost:3000/sprints/sprint", {
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
        <input {...register("startDate")} placeholder="AAAA-MM-JJ (start)" type="date" />
        {errors?.startDate && <p>{errors.startDate.message}</p>}
      </div>
      <div>
        <input {...register("endDate")} placeholder="AAAA-MM-JJ (end)" type="date" />
        {errors?.endDate && <p>{errors.endDate.message}</p>}
      </div>

      <input type="submit" />
    </form>
  );
}
