import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { profileSchema } from "../../../schema/settingSchema";
const Profile = () => {
  const {
    register,
    handleSubmit,
  } = useForm({ resolver: zodResolver(profileSchema) });
  const onSubmit = async () => {};
  return (
    <>
      <div>
        <div></div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Username:</label>
            <input type="text" {...register("username")} />
          </div>
          <div>
            <label>Bio:</label>
            <textarea {...register("bio")} />
          </div>
        </form>
      </div>
    </>
  );
};

export default Profile;
