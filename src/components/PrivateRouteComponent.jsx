import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, checkLogin, ...rest }) => {
    //estado para saber si esta ya loggeado en el sistema
    const [authenticated, setAuthenticated] = useState(false);
    //estado de carga para los elementos, ya que vienen de sync await,
    // hay que esperar a que se resuelvan las promesas
    const [loading, setLoading] = useState(true);
    /* En este effect hacemos el checkLogin, para verificar si nuestro usuario ya ingreso */
    useEffect(() => {
        const checkAuth = async () => {
            try {
                //hacemos la consulta, la respuesta es booleana
                const response = await checkLogin();
                //ponemos el valor del authenticated, para responder, o el elemento, o la redireccion
                //console.log('respos', response);
                setAuthenticated(response);
            } catch (error) {//en caso de error
                console.error('Error occurred while checking authentication:', error);
            } finally {
                //cuando se recuelve el await, ponemos loading en false para que se resuelva la authenticación
                setLoading(false);
            }
        };
        //Es necesario llamar a la funcion, y es necesario hacer una funcion para usar el metodo async await
        checkAuth();
        //esto es para monitorear la actividad de la función   
    });

    if (loading) {
        return (<h6>Cargando...</h6>);
    } else { /*console.log(authenticated);*/ }
    // Muestra un componente de carga mientras se verifica la autenticación
    return authenticated ? (
        <>{element}</>
    ) : (
        <Navigate to="/login" />
    );
};

export default PrivateRoute;
