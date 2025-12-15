import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { AuthInfo } from "../types/auth";
import toast from "react-hot-toast";

const handleAuthForm = (schema: any, type: string) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const onSubmit = (data: AuthInfo) => {
    console.log(data);
    toast.success(type + ` thành công`);
    reset();
  };
  return { register, handleSubmit, errors, onSubmit };
};

export default handleAuthForm;
