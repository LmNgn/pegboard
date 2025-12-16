import { RegisterSchema } from "../../../schema/authSchema";
import renderError from "../../../utils/renderError";
import handleAuthForm from "../../../utils/handleAuthForm";

const ResetPassword = () => {
  const { register, handleSubmit, errors, onSubmit } = handleAuthForm(
    RegisterSchema,
    "Reset"
  );

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="">Mật khẩu mới</label>
          <input type="password" {...register("password")} />
          {renderError(errors, "password")}
        </div>
        <div>
          <label htmlFor="">Xác nhận mật khẩu</label>
          <input type="password" {...register("confirmPassword")} />
          {renderError(errors, "confirmPassword")}
        </div>
        <button type="submit">Xác nhận</button>
      </form>
    </div>
  );
};

export default ResetPassword;
