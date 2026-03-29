import { TopNavBar } from "../components/Home/HomeComponents/MenuTemplates";
import { useRouteContext } from "./RouteContext";

export function MainLayoutRoute() {
  const { user, permissions, handleLogout } = useRouteContext();

  return (
    <TopNavBar
      user={user}
      permissions={permissions}
      handleLogout={handleLogout}
    />
  );
}
