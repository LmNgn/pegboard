import { Link } from "react-router-dom";

const ForgotPassword = () => {
  return (
    <div>
      <form action="">
        <div>
          <label>Email</label>
          <input type="email" name="email" />
        </div>
        <button type="submit">Xác nhận</button>
      </form>
      <Link to="/login">Quay về đăng nhập</Link>
    </div>
  );
};

export default ForgotPassword;
