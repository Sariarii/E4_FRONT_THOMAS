import { useEffect, useState } from "react";
import { useForm, Resolver } from "react-hook-form";


export function BackUsers() {

    const [users, setUsers] = useState([])

    useEffect(() => {
        async function fetchUsers() {
            const data = await fetch("http://localhost:3000/users")
                .then(res => res.json())
                console.log(data);
                
            setUsers(data)
        }
        fetchUsers();
        const interval = setInterval(fetchUsers,1000);
        return () => clearInterval(interval);
    }, [])

    return (
        <>
            <h1>BackUsers:</h1>
            <ul>
                {users.map((user: any) => (
                    <li key={user._id}>
                        {user.name} {user.email}
                    </li>
                ))}
            </ul>
        </>
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