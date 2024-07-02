import { Navigate, Outlet } from "react-router-dom";
import useUserStore from "./store/userStore";

const PrivateRoutes = () => {
  const userId = useUserStore((state) => state.user.id);

  return userId ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
