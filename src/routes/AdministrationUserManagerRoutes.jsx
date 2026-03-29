import { lazy } from "react";
import { Navigate } from "react-router-dom";
import { ProtectedRouteElement } from "./RouteElements";

const UserManageDataTable = lazy(() =>
  import("../components/UserManage/Users").then((module) => ({
    default: module.UserManageDataTable,
  })),
);

const ActiveUsersDatatable = lazy(() =>
  import("../components/UserManage/usersContext").then((module) => ({
    default: module.ActiveUsersDatatable,
  })),
);

const InactiveUsersDatatable = lazy(() =>
  import("../components/UserManage/usersContext").then((module) => ({
    default: module.InactiveUsersDatatable,
  })),
);

const CreateUserForm = lazy(() =>
  import("../components/UserManage/usersContext").then((module) => ({
    default: module.CreateUserForm,
  })),
);

const UserEditForm = lazy(() =>
  import("../components/UserManage/usersContext").then((module) => ({
    default: module.UserEditForm,
  })),
);

export const administrationUserManagerRoutes = [
  {
    path: "administration/user_manage/user/",
    element: <ProtectedRouteElement component={UserManageDataTable} />,
    children: [
      {
        index: true,
        element: <Navigate to="users_active" />,
      },
      {
        path: "users_active",
        element: <ProtectedRouteElement component={ActiveUsersDatatable} />,
      },
      {
        path: "users_inactive",
        element: <ProtectedRouteElement component={InactiveUsersDatatable} />,
      },
      {
        path: "new_user",
        element: <ProtectedRouteElement component={CreateUserForm} />,
      },
      {
        path: ":id/user_edit",
        element: <ProtectedRouteElement component={UserEditForm} />,
      },
    ],
  },
];
