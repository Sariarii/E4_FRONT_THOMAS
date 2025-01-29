import { useForm, Resolver } from "react-hook-form";
import { useEffect, useState } from "react";
import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

async function deleteProject(id: string, updateProjects: (id: string) => void) {
    try {
        const response = await fetch(`http://localhost:3000/projects/${id}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Erreur lors de la suppression du projet:");
        }

        console.log(`Le projet ${id} a bien été supprimé.`);
        updateProjects(id);
    } catch (error) {
        console.error("Erreur lors de la suppression du projet:", error);
    }
}

export function GetProjects() {
  const [projects, setProjects] = useState([])

    useEffect(() => {
        async function fetchProjects() {
            const data = await fetch("http://localhost:3000/projects")
                .then(res => res.json())
                const formattedData = data.map((project: any) => ({
                  id: project._id,
                  name: project.name,
                  description: project.description,
                  leader: project.leader?.name || "Non défini",
                  scrumMaster: project.scrumMaster?.name || "Non défini",
                  productOwner: project.productOwner?.name || "Non défini",
                  participants: project.participants?.length || 0,
                  sprints: project.sprints?.length || 0,
                  stories: project.stories?.length || 0,
                }));
                setProjects(formattedData)
            
        }
        fetchProjects();
        const interval = setInterval(fetchProjects,1000);
        return () => clearInterval(interval);
    }, [])

    const handleDelete = (id: string) => {
        setProjects((prevProjects) =>
            prevProjects.filter((project: any) => project._id !== id)
        );
    };
  const columns: GridColDef<(typeof projects)[number]>[] = [
  { field: "id", headerName: "ID", width: 200,}, 
  { field: "name", headerName: "Nom du Projet", width: 200 },
  { field: "description", headerName: "Description", width: 250 },
  { field: "leader", headerName: "Leader", width: 150 },
  { field: "scrumMaster", headerName: "Scrum Master", width: 150 },
  { field: "productOwner", headerName: "Product Owner", width: 150 },
  { field: "participants", headerName: "Participants", width: 150 },
  { field: "sprints", headerName: "Nombre de Sprints", width: 150 },
  { field: "stories", headerName: "Nombre de Stories", width: 150 },
  {field: "delete", headerName: "Supprimer", width: 150,    renderCell: (params) => (
    <Button
      variant="contained"
      color="error"
      onClick={() => deleteProject((params.row as any).id,handleDelete)}
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
        rows={projects}
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
  description: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.name && values.description ? values : {},
    errors: !values.name || !values.description
      ? {
          name: {
            type: "required",
            message: "name is required.",
          },
          description: {
            type: "required",
            message: "description is required.",
          },
        }
      : {},
  };
};

export function CreateProject() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver });


  const onSubmit = async (data: FormValues) => {
    try {
      const response = await fetch("http://localhost:3000/projects/createProject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("erreur lors de l'envoi");
      }
      const navigate = useNavigate();
      navigate('/getProjects');
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
        <input {...register("description")} placeholder="desc" />
        {errors?.description && <p>{errors.description.message}</p>}
      </div>

      <input type="submit" />
    </form>
  );
}
