"use client";
import Input from "../components/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider } from "react-hook-form";
import Details from "./details/page";
import { useEffect, useState } from "react";

const Page = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("https://67b31fffbc0165def8cfff1b.mockapi.io/api/users")
      .then((res) => res.json())
      .then((data) => setData(data))
      .catch((err) => console.log(err));
  }, [data]);



  const handleDelete =async (e:React.MouseEvent<HTMLButtonElement>,id :number | undefined)=>{
    e.preventDefault()
    await fetch("https://67b31fffbc0165def8cfff1b.mockapi.io/api/users/"+id,{
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            },
        })
  }

  const handleUpdate =async (e:React.MouseEvent<HTMLButtonElement>,id : number | undefined)=>{
    e.preventDefault();
    const data = await fetch('https://67b31fffbc0165def8cfff1b.mockapi.io/api/users/'+id);
    const userData = await data.json();
    reset(userData);
  }


  const Schema = z
    .object({
      id: z.number().optional(),
      username: z
        .string()
        .min(5, { message: "username should be length of 5 mendatory" }),
      password: z
        .string()
        .min(8, { message: "password should be minimum length of 8." })
        .max(14, { message: "password should be maximum length of 8." }),
      confirmedPassword: z
        .string()
        .min(8, { message: "password should be minimum length of 8." })
        .max(14, { message: "password should be maximum length of 8." }),
      firstName: z
        .string()
        .min(2, { message: "first name conatain at least two charaters" }),
      lastName: z
        .string()
        .min(2, { message: "last name conatain at least two charaters" }),
      email: z.string().email(),
      phone: z.number(),

    })
    .refine((val) => val.password === val.confirmedPassword, {
      message: "Passwords do not match",
      path: ["confirmedPassword"],
    });

  type User = z.infer<typeof Schema>;
  const methods = useForm<User>({
    mode: "onChange",
    resolver: zodResolver(Schema),
  });

  const {register,reset,formState: { errors }} = methods;

  const onSubmit = async (content: User) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(content)


        await fetch("https://67b31fffbc0165def8cfff1b.mockapi.io/api/users", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(content),
          });
    reset();
  };

  const handleSave =async (e:React.MouseEvent<HTMLButtonElement>, id:number | undefined) =>{
        e.preventDefault();

        await fetch('https://67b31fffbc0165def8cfff1b.mockapi.io/api/users/'+id,{
            method:'PUT',
            headers:{
                "Content-Type" :"application/json"
            },
            body:JSON.stringify(content)
            }).then((res)=>res.json())
            reset(); 
  }

  return (
    <div className="flex flex-col justify-center items-center space-y-10 mb-10">
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col justify-center items-center max-w-64 space-y-7 p-7 outline outline-white rounded-md mx-auto mt-10"
        >
          <Input
            type="text"
            label="Username"
            placeholder="Username"
            error={errors.username}
            {...register("username")}
          />
          <Input
            type="password"
            label="Password"
            placeholder="Password"
            error={errors.password}
            {...register("password")}
          />
          <Input
            type="text"
            label="Confirmed Password"
            placeholder="Confirmed Password"
            error={errors.confirmedPassword}
            {...register("confirmedPassword")}
          />
          <Details />
          <button onClick={(e)=>handleSave(e, id)}>Update</button>
        </form>
      </FormProvider>

      <div className="">
        <table className="border">
          <thead className="border">
            <tr >
              <th className="px-10">First Name</th>
              <th className="px-10">Last Name</th>
              <th className="px-10">Email</th>
              <th className="px-10">Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user: User) => {
              return (
                <tr key={user.id}>
                  <td className="px-10">{user.firstName}</td>
                  <td className="px-10">{user.lastName}</td>
                  <td className="px-10">{user.email}</td>
                  <td className="px-10">{user.phone}</td>
                  <td>
                        <button onClick={(e)=>handleDelete(e,user.id)} className="px-3 py-2 bg-red-500 rounded-md m-2">Delete</button>
                        <button onClick={(e)=>handleUpdate(e,user.id)} className="px-3 py-2 bg-blue-500 rounded-md m-2">Update</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;

// https://67b31fffbc0165def8cfff1b.mockapi.io/api/users api end point for crud
