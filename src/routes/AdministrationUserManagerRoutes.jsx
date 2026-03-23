import { Route } from "react-router-dom";
import PrivateRoute from "../components/PrivateRouteComponent";
import  { Navigate } from "react-router-dom";
//import { EditRestoration } from "../components/PiecesRestorations/edit";


import {
  UserManageDataTable,
 // UsersNavBar,
} from "../components/UserManage/Users";

//import { PermissionRoute } from './components/Permissions/permissions';
import {
  InactiveUsersDatatable,
  ActiveUsersDatatable,
  CreateUserForm,
  UserEditForm,
} from "../components/UserManage/usersContext";


export function AdmUserManage({
  handleCheckLoginCallback,
  accessToken,
  refreshToken,
 // permissions,
}) {
  return [
    <>
      <Route
        path="administration/user_manage/user/"
        element={
          <PrivateRoute
            element={
              <UserManageDataTable
                accessToken={accessToken}
                refreshToken={refreshToken}
              />
            }
            checkLogin={handleCheckLoginCallback}
          />
        }
      >
        <Route index element={<Navigate to="users_active" />} />

        <Route
          path="users_active"
          element={
            <PrivateRoute
              element={<ActiveUsersDatatable />}
              checkLogin={handleCheckLoginCallback}
            />
          }
        />

        <Route
          path="users_inactive"
          element={
            <PrivateRoute
              element={<InactiveUsersDatatable />}
              checkLogin={handleCheckLoginCallback}
            />
          }
        />

        <Route
          path="new_user"
          element={
            <PrivateRoute
              element={
                <CreateUserForm
                  accessToken={accessToken}
                  refreshToken={refreshToken}
                />
              }
              checkLogin={handleCheckLoginCallback}
            />
          }
        />

        <Route
          path=":id/user_edit"
          element={
            <PrivateRoute
              element={
                <UserEditForm
                  accessToken={accessToken}
                  refreshToken={refreshToken}
                />
              }
              checkLogin={handleCheckLoginCallback}
            />
          }
        />
      </Route>
    </>
  ];
}
