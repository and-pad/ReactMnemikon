import { Navigate } from "react-router-dom";
import { UserManageDataTable } from "../components/UserManage/Users";
import {
  InactiveUsersDatatable,
  ActiveUsersDatatable,
  CreateUserForm,
  UserEditForm,
} from "../components/UserManage/usersContext";
import { ProtectedRouteElement } from "./RouteElements";

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
