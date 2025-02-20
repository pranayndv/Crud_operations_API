'use client'
import Input from "@/app/components/input"
import {  FieldError, useFormContext } from "react-hook-form"


const Details = () => {

    const {register, formState:{errors, isSubmitting}} = useFormContext()
  return (
    <div>
         <div  className="flex flex-col justify-center items-center  space-y-7 ">
            <Input type="text"  label='First Name' placeholder="First Name" error={errors.firstName as FieldError | undefined} {...register('firstName')}/>
            <Input type="text"  label='Last Name' placeholder="Last Name" error={errors.lastName  as FieldError | undefined} {...register('lastName')} />
            <Input type="text"  label='Email' placeholder="Email" error={errors.email  as FieldError | undefined} {...register('email')} />
            <Input type="number"  label='Phone Number' placeholder="Phone Number" error={errors.phone  as FieldError | undefined} {...register('phone',{valueAsNumber:true})} />
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-white text-black rounded-lg font-bold hover:scale-105 duration-300 cursor-pointer">{isSubmitting? 'Loading' : "Submit"}</button>
        </div>
    </div>
  )
}

export default Details