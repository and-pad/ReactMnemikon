import { lazy } from "react";
import { Navigate } from "react-router";
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

const RolesAdminPage = lazy(() =>
  import("../components/UserManage/Roles/RolesAdmin").then((module) => ({
    default: module.RolesAdminPage,
  })),
);

const UsersRoleAccessListPage = lazy(() =>
  import("../components/UserManage/Roles/RolesAdmin").then((module) => ({
    default: module.UsersRoleAccessListPage,
  })),
);

const UserRoleAccessEditPage = lazy(() =>
  import("../components/UserManage/Roles/RolesAdmin").then((module) => ({
    default: module.UserRoleAccessEditPage,
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
  {
    path: "administration/user_manage/roles",
    element: <ProtectedRouteElement component={RolesAdminPage} />,
  },
  {
    path: "administration/user_manage/roles/users",
    element: <ProtectedRouteElement component={UsersRoleAccessListPage} />,
  },
  {
    path: "administration/user_manage/roles/users/:id",
    element: <ProtectedRouteElement component={UserRoleAccessEditPage} />,
  },
];
