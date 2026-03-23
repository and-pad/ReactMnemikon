import SETTINGS from '../Config/settings.js';


export const API_RequestUsers = async ({ accessToken, refreshToken }) => {
    const url = SETTINGS.URL_ADDRESS.server_api_commands + 'auth/user_manage/';
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        if (response.ok) {
            const data = await response.json();

            return data;
        } else {

            return true;
        }
    } catch (e) {
        console.error(e);
        return false;
    }
}

export const API_InactiveUser = async ({ accessToken, refreshToken, user_id }) => {
    const url = SETTINGS.URL_ADDRESS.server_api_commands + 'auth/user_manage/inactive/';
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ user_id }), // Serializa el body correctamente
        });

        if (response.ok) {
            return await response.json(); // Retorna la data si está bien
        } else {
            console.log("response",await response.json());
            return null; // O maneja el error de otra manera
        }
    } catch (error) {
        console.error('Error en la API:', error);
        return false; // Indica un fallo en la operación
    }
};

export const API_NewUser = async ({ accessToken, refreshToken, formData }) => {
    const url = SETTINGS.URL_ADDRESS.server_api_commands + 'auth/user_manage/new_user/';
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ formData }), // Serializa el body correctamente
        });

        if (response.ok) {
            return await response.json(); // Retorna la data si está bien
        } else {
            console.error('Error al crear el usuario:', response.statusText);
            return {message: await response.json()}; // O maneja el error de otra manera
        }

    }
    catch(error){
        return {message:"network_error"};

    }

}

export const API_ActiveUser = async ({ accessToken, refreshToken, user_id }) => {
    const url = SETTINGS.URL_ADDRESS.server_api_commands + 'auth/user_manage/activate/';
    console.log('URL:', url);
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ user_id }), // Serializa el body correctamente
            
        });
    
        if (response.ok) {
            return await response.json(); // Retorna la data si está bien
        } else {
            console.error('Error al activar el usuario:', response.statusText);
            return null; // O maneja el error de otra manera
        }
    }
    catch(error){
        console.error('Error en la API:', error);
        return false; // Indica un fallo en la operación
    }
}

export const API_EditUser = async ({ accessToken, refreshToken, formDataChange }) => {
    const url = SETTINGS.URL_ADDRESS.server_api_commands + 'auth/user_manage/edit/';
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ formDataChange }), // Serializa el body correctamente
        });

        if (response.ok) {
            return await response.json(); // Retorna la data si está bien
        } else {
            console.error('Error al editar el usuario:', response.statusText);
            return null; // O maneja el error de otra manera
        }
    } catch (error) {
        console.error('Error en la API:', error);
        return false; // Indica un fallo en la operación
    }
}

export const API_DeleteUser = async ({ accessToken, refreshToken, user_id }) => {
    const url = SETTINGS.URL_ADDRESS.server_api_commands + 'auth/user_manage/delete/';
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,   
            },
            body: JSON.stringify({ user_id }), // Serializa el body correctamente
        });

        if (response.ok) {
            return await response.json(); // Retorna la data si está bien
        } else {
            console.error('Error al eliminar el usuario:', response.statusText);
            return null; // O maneja el error de otra manera
        }
    } catch (error) {
        console.error('Error en la API:', error);
        return false; // Indica un fallo en la operación
    }

        



}
