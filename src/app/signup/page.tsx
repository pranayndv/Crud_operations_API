"use client";
import Input from "../components/input";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider } from "react-hook-form";
import Details from "./details/page";
import { useEffect, useState } from "react";

const Page = () => {
  const Schema = z
    .object({
      id: z.number().optional(),
      username: z.string().min(5, { message: "username should be at least 5 characters" }),
      password: z.string().min(8, { message: "password should be at least 8 characters." }).max(14, { message: "password should be a maximum of 14 characters." }),
      confirmedPassword: z.string().min(8, { message: "password should be at least 8 characters." }).max(14, { message: "password should be a maximum of 14 characters." }),
      firstName: z.string().min(2, { message: "first name must contain at least two characters" }),
      lastName: z.string().min(2, { message: "last name must contain at least two characters" }),
      email: z.string().email(),
      phone: z.number(),
    })
    .refine((val) => val.password === val.confirmedPassword, {
      message: "Passwords do not match",
      path: ["confirmedPassword"],
    });

  const [data, setData] = useState<User[]>([]);
  const [updateID, setUpdateId] = useState<number | undefined>(undefined);

  const fetchData = async () => {
    try {
      const res = await fetch("https://67b31fffbc0165def8cfff1b.mockapi.io/api/users");
      const result = await res.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>, id: number | undefined) => {
    e.preventDefault();
    if (!id) return;
    await fetch(`https://67b31fffbc0165def8cfff1b.mockapi.io/api/users/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    fetchData();
  };

  const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement>, id: number | undefined) => {
    e.preventDefault();
    if (!id) return;
    const res = await fetch(`https://67b31fffbc0165def8cfff1b.mockapi.io/api/users/${id}`);
    const userData: User = await res.json();
    setUpdateId(id);
    reset({
      id: Number(userData.id),
      username: userData.username || "",
      password: "", 
      confirmedPassword: "", 
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: userData.email || "",
      phone: userData.phone || 0,
    });
  };

  
  type User = z.infer<typeof Schema>;
  const methods = useForm<User>({
    mode: "onChange",
    resolver: zodResolver(Schema),
  });

  const { register, reset, formState: { errors } } = methods;

  const onSubmit = async (content: User) => {
    try {

      if (updateID) {
        await fetch(`https://67b31fffbc0165def8cfff1b.mockapi.io/api/users/${updateID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(content),
        });
      } else {
        await fetch("https://67b31fffbc0165def8cfff1b.mockapi.io/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(content),
        });
      }
      setUpdateId(undefined);
      reset();
      fetchData();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-10 mb-10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col justify-center items-center max-w-64 space-y-7 p-7 outline outline-white rounded-md mx-auto mt-10">
          <Input type="text" label="Username" placeholder="Username" error={errors.username} {...register("username")} />
          <Input type="password" label="Password" placeholder="Password" error={errors.password} {...register("password")} />
          <Input type="text" label="Confirmed Password" placeholder="Confirmed Password" error={errors.confirmedPassword} {...register("confirmedPassword")} />
          <Details />
        </form>
      </FormProvider>
      <div>
        <table className="border">
          <thead className="border">
            <tr>
              <th className="px-10">First Name</th>
              <th className="px-10">Last Name</th>
              <th className="px-10">Email</th>
              <th className="px-10">Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((user: User) => (
              <tr key={user.id}>
                <td className="px-10">{user.firstName}</td>
                <td className="px-10">{user.lastName}</td>
                <td className="px-10">{user.email}</td>
                <td className="px-10">{user.phone}</td>
                <td>
                  <button onClick={(e) => handleDelete(e, user.id)} className="px-3 py-2 bg-red-500 rounded-md m-2">Delete</button>
                  <button onClick={(e) => handleUpdate(e, user.id)} className="px-3 py-2 bg-blue-500 rounded-md m-2">Update</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Page;
