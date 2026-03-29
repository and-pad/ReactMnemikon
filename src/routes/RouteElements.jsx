import Login from "../components/LoginComponents/Login";
import PrivateRoute from "../components/PrivateRouteComponent";
import { useRouteContext } from "./RouteContext";

export function LoginRouteElement() {
  const { handleLoginCallback, accessToken, setAccessToken } = useRouteContext();

  return (
    <Login
      onLogin={handleLoginCallback}
      setAccessToken={setAccessToken}
      accessToken={accessToken}
    />
  );
}

export function ProtectedRouteElement({ component: Component, componentProps = {} }) {
  const {
    accessToken,
    refreshToken,
    permissions,
    handleCheckLoginCallback,
  } = useRouteContext();

  return (
    <PrivateRoute
      checkLogin={handleCheckLoginCallback}
      element={
        <Component
          {...componentProps}
          accessToken={accessToken}
          refreshToken={refreshToken}
          permissions={permissions}
          handleCheckLoginCallback={handleCheckLoginCallback}
        />
      }
    />
  );
}
