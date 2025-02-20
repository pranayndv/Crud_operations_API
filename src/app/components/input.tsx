import { forwardRef } from "react"
import { FieldError } from "react-hook-form";
interface Customprops extends React.InputHTMLAttributes<HTMLInputElement>{
    name: string;
    type:string;
    label : string;
    error?:FieldError ;
}
const Input = forwardRef<HTMLInputElement, Customprops>(({name,label,type, error, placeholder, ...rest},ref) => {
  return (
    <div className="relative">
        <label htmlFor={name} className="absolute text-[0.7rem] bg-black  top-[-10px] left-2 px-2">{label}</label>
        <input
         type={type}
         name={name}
         placeholder={placeholder}
         ref={ref}
         {...rest}
         className="bg-black px-2 py-2 rounded-md outline outline-white"
         />
         {error && <p className="text-red-500 text-[0.8rem] italic">{error.message}</p>}
    </div>
  )
})

Input.displayName = "Input"; 
export default Input