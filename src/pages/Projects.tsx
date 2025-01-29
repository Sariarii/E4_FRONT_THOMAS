import { useForm, Resolver } from "react-hook-form";
import { useEffect, useState } from "react";

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
                console.log(data);
                
                setProjects(data)
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

    return (
        <>
            <h1>Projects:</h1>
            <ul>
                {projects.map((project: any) => (
                    <li key={project._id}>
                        <b>name :</b> {project.name} / <b>description :</b> {project.description}
                        <button onClick={() => deleteProject(project._id,handleDelete)}>Supprimer</button>
                    </li>
                ))}
            </ul>
        </>
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
