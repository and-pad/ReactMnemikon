
//import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import SETTINGS from '../Config/settings';

export var handleLogin = async ({ email, password }) => {
    // var data_response;
    try {
        const url = SETTINGS.URL_ADDRESS.server_api_commands + 'auth/signin/';
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (response.ok) {
            //refresh, access y Nombre de usuario
            return data;
        } else {
            // Manejar errores de autenticación
            return 'not authenticated';
        }
    } catch (error) {
        console.error('elerror', error);
        return 'not network';
        // Manejar errores de red
    }

};

export var handleLoggedTime = async (accessToken, refreshToken) => {
    //Esta función maneja el accessToken y el refreshToken en funcion de mantener 
    //actualizado y protegido el sistema siempre con un nuevo token, y un sistema de
    //doble tokenizado.
    //console.log('accessT', accessToken);
    //console.log('refresh', refreshToken);
    try {//intentamos hacer una llamada API al servidor para checar el token actual
        // console.log('acces que llega a handle', accessToken);
        //Si funciona este nos responde un json de nombre {'time_left':200.185} en segundos y fracciones,
        //la cantidad restante de tiempo de vida del token.
        const url = SETTINGS.URL_ADDRESS.server_api_commands + 'auth/check/';
        var response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //aqui es donde enviamos el token mismo que es tomado al hacer la peticion
                //por eso en este caso el body va vacío.
                'Authorization': `Bearer ${accessToken}`,
            },
            //body: JSON.stringify(accessToken),
        });


        if (response.ok) {//si la respuesta del servidor es en rango de 200 al 299 es considerado ok
            const data = await response.json();//esperamos la respuesta del fetch
            if ('time_left' in data) {//revisamos si viene time_left quiere decir que el token aun tiene vida!!!!
                //    console.log(data['time_left']);
                //y regresamos como respuesta el data que en este caso solo contiene el time_left
                //el cual se filtra con el mismo nombre de la etiqueta al recibirse
                //console.log(data);
                return data;
            }

        } else {
            const errorData = await response.json();
            //Si la respuesta no es ok, entonces verificamos si es por token invalido
            if (errorData.code === "token_not_valid") {
               
                //Intentamos hacer un fetch de refrescado de toquen
                try {
                    //En esta url de api es para refrescar la el accessToken con el refreshToken
                    const url = SETTINGS.URL_ADDRESS.server_api_commands + 'auth/signin/';
                    response = await fetch(url, {
                        method: 'PUT',//En el metodo PUT es donde renovamos el accessToken
                        headers: {
                            'Content-Type': 'application/json',
                            /* 'Authorization': `Bearer ${accessToken}`,*/

                        },
                        body: JSON.stringify({ 'refresh': refreshToken }),//ponemos el RefreshToken en el body para que intente hacer la renovacion                        
                    });

                    //console.log({ refresh: refreshToken });
                    if (response.ok) {
                        //Esperamos a que nos de respuesta y lo convertimos en un objeto json.
                        //viene un json con un elemento llamado "access" que es el nuevo accessToken con tiempo renovado
                        const data = await response.json();
                        //console.log('rastreo access data', data);
                        return data;
                    } else {
                        //console.log('cookiesRem');
                        Cookies.remove('refreshToken');
                        Cookies.remove('accessToken');
                        /*Cookies.get('refreshToken');
                        Cookies.get('accessToken');*/
                        return 'login_redirect';//<Navigate to="/" replace />;
                    }
                } catch (e) {
                    console.log(e);
                    //En caso que no se pueda renovar el refreshToken, redirigimos al login
                    return 'not network1';
                }

                /*
                {
                    "error": "Token is invalid or expired"
                }*/


                // Aquí puedes manejar el caso de token no válido como desees,
                // por ejemplo, redirigir al usuario a la página de inicio de sesión.
            } else {
                console.error("Error en la solicitud:", response.status);
                // Aquí puedes manejar otros casos de error de respuesta
            }


        }

    } catch (error) {
        console.error(error);

        return 'not network2'
        // Manejar errores de red
    }


};