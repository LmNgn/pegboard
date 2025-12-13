import { Link } from "react-router-dom";
import { LoginSchema } from "../../../schema/authSchema";
import renderError from "../../../utils/renderError";
import handleAuthForm from "../../../utils/handleAuthForm";

const Login = () => {
  const { register, handleSubmit, errors, onSubmit } =
    handleAuthForm(LoginSchema);
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
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
          <input type="checkbox" name="remember-account" />
          <label>Remember me</label>
        </div>
        {/* Chuyển sang trang quên mật khẩu */}
        <div>
          <Link to="/forgot-password">Quên mật khẩu</Link>
        </div>
        <div>
          <button type="submit">Đăng nhập</button>
        </div>
      </form>
      <span>Hoặc</span>
      <div>
        <span>Facebook</span>
        <span>Google</span>
      </div>
      <span>
        Bạn chưa có tài khoản. <Link to="/register">Đăng ký</Link> ngay
      </span>
    </div>
  );
};

export default Login;
