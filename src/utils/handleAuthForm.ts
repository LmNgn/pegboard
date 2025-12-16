import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { AuthInfo } from "../types/auth";
import toast from "react-hot-toast";

const handleAuthForm = (schema: any, type: string) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const remember = watch("remember");
  const onSubmit = (data: AuthInfo) => {
    console.log(data);
    toast.success(type + ` thành công`);
    if (remember) {
      localStorage.setItem("auth", JSON.stringify(data));
    } else {
      sessionStorage.setItem("auth", JSON.stringify(data));
    }
    reset();
  };
  return { register, handleSubmit, errors, onSubmit, watch, reset };
};

export default handleAuthForm;
