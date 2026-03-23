import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
//import { Navigate } from 'react-router-dom';
//onLogin y setAccess ambas son funciones
function Login({ onLogin, setAccessToken, accessToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');    
    const [redirect, setRedirect] = useState(false);

    const navigate = useNavigate();


    useEffect(() => {
        if (accessToken) {
            navigate('/mnemosine/start');
        }
    }, [accessToken, navigate]);

    //Esta funcion se ejecuta cada que el campo email cambia (es precionada una tecla sobre el campo)
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    //Esta funcion se ejecuta cada que el campo password cambia (es precionada una tecla sobre el campo)
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    //
    const handleSubmit = async (e) => {

        e.preventDefault();

        var response = await onLogin({ email, password });
        if (response === 'not authenticated') {
            setError('Usuario o contraseña incorrectos');
            setAccessToken(false);
            setRedirect(false);
        } else {
            // Guardar el token en una cookie
            if (response !== undefined && response !== 'not network') {

                if ('refresh' in response) {
                    //respuesta de que viene un nuevo token refresh y access
                    Cookies.set('accessToken', JSON.stringify(response.access));
                    Cookies.set('refreshToken', JSON.stringify(response.refresh));
                    Cookies.set('User', JSON.stringify(response.user));
                    Cookies.set('permissions',JSON.stringify(response.permissions));



                    //setRedirectHome(true);
                    //return true;
                }

            }
            else {
                setAccessToken(false);
            }
            // Si el token es diferente a 'not authenticated', limpiamos el error
            setError('');

            //console.log('antes de si pasa por set redirectHome');
            //console.log(token);
            if (response !== undefined && response !== 'not network') {

                if ('access' in response) {
                    //respuesta de que se renovo token
                    if (!('refresh' in response)) {
                        
                        setAccessToken(response.access);
                        Cookies.set('accessToken', JSON.stringify(response.access));
                        Cookies.set('User', JSON.stringify(response.user));
                       
                        setRedirect(true);
                    } /*else {                       
                        setAccessToken(response.access);
                        setRedirect(true);
                    }*/

                }
                else if ('time_left' in response) {
                    //respuesta de que aun tiene vigencia el response
                    setRedirect(true);
                    setAccessToken(response.access);


                } else if (response === 'login_redirect') {

                    setAccessToken(false);

                }

            }

        }

    };

    useEffect(() => {
        if (redirect) {
            navigate('/mnemosine/start');
        }
    }, [redirect, navigate]);
    return (
        <div>
            <h2>Ingreso</h2>
            {/* Mostrar el mensaje de error si existe */}
            {error && <div style={{ color: 'red' }}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Email:</label>
                    <input type="text" value={email} onChange={handleEmailChange} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={handlePasswordChange} />
                </div>
                <button type="submit">Login</button>
            </form>
            <div>{}</div>
        </div>
    );
}

export default Login;
