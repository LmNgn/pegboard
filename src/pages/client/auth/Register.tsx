import { Link } from "react-router-dom";
import { RegisterSchema } from "../../../schema/authSchema";
import handleAuthForm from "../../../utils/handleAuthForm";
import renderError from "../../../utils/renderError";

const Register = () => {
  const { register, handleSubmit, errors, onSubmit } = handleAuthForm(
    RegisterSchema,
    "Đăng ký"
  );
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label>Username:</label>
          <input type="string" {...register("username")} />
          {renderError(errors, "username")}
        </div>
        <div>
          <label>Email:</label>
          <input type="email" {...register("email")} />
          {renderError(errors, "email")}
        </div>
        <div>
          <label>Password:</label>
          <input type="password" {...register("password")} />
          {renderError(errors, "password")}
        </div>
        <div>
          <label>Confirm password:</label>
          <input type="password" {...register("confirmPassword")} />
          {renderError(errors, "confirmPassword")}
        </div>
        <div>
          <input type="checkbox" />
          <label>
            Tôi đồng ý với <Link to="/policy">Điều khoản và dịch vụ</Link>
          </label>
        </div>

        <div>
          <button type="submit">Đăng ký</button>
        </div>
      </form>
      {/* Phương thức đằng nhập khác */}
      <span>Hoặc</span>
      <div>
        <span>Facebook</span>
        <span>Google</span>
      </div>
      {/* Chuyển sang trang đăng nhập */}
      <div>
        <span>
          Bạn đã có tài khoản. Chuyển sang <Link to="/login">đăng nhập</Link>
        </span>
      </div>
    </div>
  );
};

export default Register;
