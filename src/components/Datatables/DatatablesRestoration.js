import { BaseDatatable } from "./datatableStructurer";


export function DatatableUserRestoration({ accessToken, refreshToken, permissions, module, title }) {


    return BaseDatatable({ accessToken, refreshToken, module, title, permissions });
    
};