import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { AuthInfo } from "../types/auth";

const handleAuthForm = (schema: any) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  const onSubmit = (data: AuthInfo) => {
    console.log(data);
    alert("here");
    reset();
  };
  return { register, handleSubmit, reset, errors, onSubmit };
};

export default handleAuthForm;
