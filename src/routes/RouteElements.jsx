import { Suspense } from "react";
import Login from "../components/LoginComponents/Login";
import PrivateRoute from "../components/PrivateRouteComponent";
import { useRouteContext } from "./RouteContext";

function RouteLoadingFallback() {
  return <h6>Cargando...</h6>;
}

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

  const requiredPermissions = componentProps.requiredPermissions || [];
  const permissionMode = componentProps.permissionMode || "some";
  const fallbackElement = componentProps.fallbackElement || null;

  const hasRequiredPermissions =
    requiredPermissions.length === 0
      ? true
      : permissionMode === "every"
        ? requiredPermissions.every((permission) =>
            permissions?.includes(permission),
          )
        : requiredPermissions.some((permission) =>
            permissions?.includes(permission),
          );

  const resolvedComponentProps = { ...componentProps };
  delete resolvedComponentProps.requiredPermissions;
  delete resolvedComponentProps.permissionMode;
  delete resolvedComponentProps.fallbackElement;

  return (
    <PrivateRoute
      checkLogin={handleCheckLoginCallback}
      element={
        <Suspense fallback={<RouteLoadingFallback />}>
          {hasRequiredPermissions ? (
            <Component
              {...resolvedComponentProps}
              accessToken={accessToken}
              refreshToken={refreshToken}
              permissions={permissions}
              handleCheckLoginCallback={handleCheckLoginCallback}
            />
          ) : (
            fallbackElement
          )}
        </Suspense>
      }
    />
  );
}
