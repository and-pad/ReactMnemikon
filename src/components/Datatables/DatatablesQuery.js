import { BaseDatatable } from './datatableStructurer';


/********************************************************************************************************************/
export function DatatableUserQuery({
  accessToken,
  refreshToken,
  permissions,
  module,
  title,

  
}) {
return BaseDatatable({ accessToken, refreshToken, module, title, permissions});
}
/**************************************************************************************************************/