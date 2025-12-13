import { Link } from "react-router-dom";
import { RegisterSchema } from "../../../schema/authSchema";
import handleAuthForm from "../../../utils/handleAuthForm";

const Register = () => {
  const { register, handleSubmit, reset, errors, onSubmit } =
    handleAuthForm(RegisterSchema);
  return (
    <div>
      <form action="">
        <div>
          <label>Username:</label>
          <input type="string" {...register("username")} />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" />
        </div>
        <div>
          <label>Confirm password:</label>
          <input type="password" name="confirmPassword" />
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
      <span>Hoặc</span>
      <div>
        <span>Facebook</span>
        <span>Google</span>
      </div>
      <div>
        <span>
          Bạn đã có tài khoản. Chuyển sang <Link to="/login">đăng nhập</Link>
        </span>
      </div>
    </div>
  );
};

export default Register;
