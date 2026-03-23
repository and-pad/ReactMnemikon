
//import { Navigate } from 'react-router-dom';

const hasPermission = (requiredPermission, permissions) => {
    return permissions.includes(requiredPermission);
  };
 

export const PermissionRoute = ({ requiredPermission, permissions, element }) => {
  if (hasPermission(requiredPermission, permissions)) {
    return element;
  } else {
    // Redirigir a otra ruta o mostrar un mensaje de error
    //console.log(permissions)
    return null;
  }
};