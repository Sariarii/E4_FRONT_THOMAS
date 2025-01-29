import { Box, Button } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useForm, Resolver } from "react-hook-form";


export function BackUsers() {

    const [users, setUsers] = useState([])

    useEffect(() => {
        async function fetchUsers() {
            const data = await fetch("http://localhost:3000/users")
                .then(res => res.json())
            const formattedData = data.map((user: any) => ({
              id: user._id,
              name: user.name,
              email: user.email,
              password: "******", 
              accessTokens: user.accessTokens,
              refreshTokens: user.refreshTokens,
              roles: user.roles, 
      }));
                
            setUsers(formattedData)
        }
        fetchUsers();
        const interval = setInterval(fetchUsers,1000);
        return () => clearInterval(interval);
    }, [])

    const columns: GridColDef<(typeof users)[number]>[] = [
      { field: "id", headerName: "ID", width: 200,}, 
      { field: "name", headerName: "Nom", width: 200 },
      { field: "email", headerName: "Email", width: 250 },
      { field: "password", headerName: "MDP", width: 250 },
      { field: "accessToken", headerName: "Token d'acces", width: 250 },
      { field: "refreshToken", headerName: "Token de rafraichissement", width: 250 },
      { field: "roles", headerName: "Roles", width: 250 },
    ];
      
      return (
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            columnVisibilityModel={{
              id: false,
              password:false,
              accessToken:false,
              refreshToken:false,
              roles:false,
            }}
            rows={users}
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
  email: string;
  password: string;
  confirmPassword: string;
};

const resolver: Resolver<FormValues> = async (values) => {
  return {
    values: values.email && values.password && values.confirmPassword ? values : {},
    errors: !values.email || !values.password || !values.confirmPassword
      ? {
        email: {
            type: "required",
            message: "email is required.",
          },
          password: {
            type: "required",
            message: "password is required.",
          },
          confirmPassword: {
            type: "required",
            message: "confirmPassword is required.",
          },
        }
      : {},
  };
};

export function CreateUser() {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<FormValues>({ resolver });
    
    
      const onSubmit = async (data: FormValues) => {
        try {
          const response = await fetch("http://localhost:3000/users/signup", {
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
            <input {...register("email")} placeholder="email" />
            {errors?.email && <p>{errors.email.message}</p>}
          </div>
          <div>
            <input {...register("password")} placeholder="password" />
            {errors?.password && <p>{errors.password.message}</p>}
          </div>
          <div>
            <input {...register("confirmPassword")} placeholder="confirmPassword" />
            {errors?.confirmPassword && <p>{errors.confirmPassword.message}</p>}
          </div>
    
          <input type="submit" />
        </form>
      );
}