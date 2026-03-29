import Cookies from "js-cookie"; //Librería para el manejo de cookies
import { useState, useEffect } from "react"; //react, y sus componentes
import { RouterProvider } from "react-router-dom"; //Componentes de rutas de react de single page

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";

import "./App.css";

//import Login from "./components/LoginComponents/Login"; //Componente del Login
import {
  handleLogin,
  handleLoggedTime,
} from "./components/LoginComponents/handleLogin"; // Importa la función handleLogin, todo lo referente al tokenizado

import "@fortawesome/fontawesome-free/css/all.min.css"; //FontAwesome!!

//Componente de consultas
//import { PiecesQueries } from "./components/PiecesQueries/PiecesQueries";
//import { PieceDetail } from "./components/PiecesQueries/PieceDetail";


import { delCache } from "./components/Datatables/dataHandler";

import { appRouter } from "./routes/AppRouter";
import { RouteContextProvider } from "./routes/RouteContext";

function App() {
  //Variables para manejar el inicio de sesion tokenizado
  //Este consta de dos variables que nos brinda la librería JWTtoken
  //El funcionamiento esta definido para que con el refresh token
  //se genere automaticamente el access token una vez que esté caduco
  //hasta el vencimiento de refreshToken.
  //Esto nos brinda una fuerte seguridad de tokenizado que se esta renovando.
  //La recomendacion de configuración es:
  //"Solo son recomendaciones se puede ajustar de acuerdo a tus conveniencias"
  //Tiempo caducidad accessToken = entre 1 y 8 horas
  //Tiempo de caducidad de refreshToken = entre 1 y 30 días
  //
  //Nota: la caducidad del access token se ajusta en el archivo settings.py de la app principal del lado server
  //
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [user, setUser] = useState("");
  const [permissions, setPermissions] = useState([]);
  // const [forceUpdate, setForceUpdate] = useState(false); // Estado para forzar la actualización
  //const [loginError, setLoginError] = useState(null);

  useEffect(() => {
    //Intentamos tomar a las cookies de acceso pero no sabemos si existen
    var storedToken = Cookies.get("accessToken");
    var storedReToken = Cookies.get("refreshToken");
    var storedUser = Cookies.get("User");
    var vpermissions = Cookies.get("permissions");
    try {
      //Revisamos si existe token de ingreso
      //Al intentar parsear a json es cuando ocurre el error ya que no se puede hacer parse sobre undefined
      const parsedToken = JSON.parse(storedToken);
      const parsedReToken = JSON.parse(storedReToken);
      const parsedUser = JSON.parse(storedUser);
      //Se almacenan en el estado de react los tokens para procesarlos en las API's de acceso
      setAccessToken(parsedToken);
      setRefreshToken(parsedReToken);
      setUser(parsedUser);
      setPermissions(JSON.parse(vpermissions));
      //console.log("stored ", parsedToken);
      //console.log("stored Refresh ", parsedReToken);
    } catch (error) {
      //Da un error de que no se puede parsear sobre undefined pero
      //en este caso es normal ya que si no existe creamos uno nuevo
      //no hay necesidad de mandar ningun tipo de mensaje
      //console.log("Error", error);
    }
  }, []);
  //setForceUpdate(prevState => !prevState);

  const helperLoginCallBack = (response) => {
    //console.log('respbef', response);
    //filtramos la respuesta, si viene access o time_left esta authenticado
    if (response === "not network2") {
      //si no hay internet o no responde el servidor igual quitamos las cookies de ingreso por seguridad
      //console.log('not network2');
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("User");
      Cookies.remove("permissions");
      setAccessToken(null);
      setRefreshToken(null);
      setPermissions(null);
      return false;
    } else if (response === "login_redirect" || response === "not network1") {
      // Si llega login_redirect es porque ya no esta activo el usuario
      //borramos cookies
      //console.log('response', response);
      setAccessToken(null);
      setRefreshToken(null);
      setPermissions(null);
      Cookies.remove("accessToken");
      Cookies.remove("refreshToken");
      Cookies.remove("User");
      return false;
    } else if ("access" in response) {
      //Solo cambiamos la cookie access, que fue la que se renovo, las otras cookies siguen igual
      console.log("se esta cambiando ", response.access);
      Cookies.set("accessToken", JSON.stringify(response.access));
      setAccessToken(response.access);
      return true;
    } else if ("time_left" in response) {
      //Aqui no hay nada que hacer mas que regreasar true, si hay time_left es porque a la cookie le queda tiempo
      //console.log('time_left respo');
      return true;
    } else {
      //console.log('default', response);
      return false;
    }
  };

  /* Una vez ingresado en el sistema cada vista llama a esta funcion para identificarse
     con el servidor.                                                     
  ***********************************************************************************/
  const handleCheckLoginCallback = async () => {
    var response;
    if (accessToken) {
      //si ya existe un token en el sistema solamente lo enviamos para validarlo
      //console.log('accessYavenido', accessToken);
      //checa la respuesta y devuelve un booleando.
      response = await handleLoggedTime(accessToken, refreshToken);
      //console.log('aquires', response);

      if (
        typeof response === "object" &&
        response !== null &&
        "user" in response &&
        response.user !== ""
      ) {
        setUser(response["user"]);
      }
      const toOut = helperLoginCallBack(response);
      // console.log('toout', toOut);
      return toOut;
    } else {
      //Consultamos la Cookie si esta accessToken
      const rAccess = Cookies.get("accessToken");
      var tparsed = false;
      if (rAccess !== undefined) {
        tparsed = JSON.parse(rAccess);
      }
      //console.log('tparsed', tparsed);
      if (tparsed) {
        //consultamos refresh Token
        let refresh = Cookies.get("refreshToken");
        let Muser = Cookies.get("User");
        const permissions = Cookies.get("permissions");
        Muser = JSON.parse(Muser);
        refresh = JSON.parse(refresh);
        const parsed_permissions = JSON.parse(permissions);

        //como no existian los ponemos en el sistema
        setUser(Muser);
        setPermissions(parsed_permissions);
        setAccessToken(tparsed);
        setRefreshToken(refresh);
        if (refresh !== undefined) {
          //comprobamos si no viene vacío refresh
          const acesstoSend = tparsed;
          //console.log('acesstoSend', acesstoSend);
          //mandamos a la comprobacion de servidor los tokens existentes en la cookie.
          response = await handleLoggedTime(acesstoSend, refresh);
          //console.log('Logged', refresh);
          //regresamos un booleano que viene de la comprobacion de response
          return helperLoginCallBack(response);
          //si refresh es undefined quiere decir q  ue no existe la cookie regresamos false para la comprobacion de registro
        } else {
          return false;
        }
      } else {
        return false;
      }
    }
  };

  //Esta funcion se ejecuta al precionar el boton para ingresar al sistema
  //esta intenta comunicarse con el servidor para obtener los tokens de login

  const handleLoginCallback = async ({ email, password }) => {
    // Si ya hay un token almacenado en la cookie, no es necesario obtener uno nuevo
    if (accessToken) {
      var response = await handleLoggedTime(accessToken, refreshToken);
      //si viene time_left, regresamos el tiempo de sobra del token
      //si viene esta respuesta quiere decir que no se pudo conectar con el refreshToken entonces hay que redirigir a la url de login para
      //renovar tokens
      if (response === "login_redirect" || response === "not network") {
        //console.log('navigate');
        //console.log("cookiesRem");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        Cookies.remove("User");
        // Forzar una actualización de la interfaz de usuario
        //setForceUpdate(prevState => !prevState);
        setAccessToken(null);
        setRefreshToken(null);
        setPermissions(null);
        setUser(null);

        return;
      } else {
        //si viene una de estas dos etiquetas el token access esta funcionando, ya sea porque se actualizo o aun tenia vigencia el actual
        if ("access" in response || "time_left" in response) {
          return response;
        }
      }
    } else {
      // Si no hay un token almacenado, obtener uno nuevo
      const response = await handleLogin({ email, password });
      if (response !== "not authenticated" && response !== "not network") {
        setAccessToken(response.access);
        setRefreshToken(response.refresh);
        setUser(response.user);
        setPermissions(response.permissions);
      } else {
        if (response === "not network") {
          alert("No hay internet, o el servidor no responde");
          console.error("No hay internet, o el servidor no responde");

        }
      }
      return response;
    }
  };

  //const navigate = useNavigate();
  const handleLogout = async ({ navigate }) => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("User");
    Cookies.remove("SYNCCODEDB");
    // Forzar una actualización de la interfaz de usuario
    //setForceUpdate(prevState => !prevState);
    setAccessToken(null);
    setRefreshToken(null);
    setPermissions(null);
    setUser(null);

    await handleDeleteCache();
    navigate("/login");
  };

  const handleDeleteCache = async () => {
    try {
      const result = await delCache();
      if (result !== "error") {
        //console.log(result);
        console.log("Cache eliminado con éxito.");
      } else {
        console.log("No se encontró el objeto en la base de datos.");
      }
    } catch (error) {
      console.error("Ocurrió un error al eliminar la caché:", error);
    }
  };

  const routeContextValue = {
    handleLoginCallback,
    accessToken,
    setAccessToken,
    refreshToken,
    permissions,
    user,
    handleLogout,
    handleCheckLoginCallback,
  };

  return (
    <div className="App">
      <RouteContextProvider value={routeContextValue}>
        <RouterProvider router={appRouter} />
      </RouteContextProvider>
    </div>
  );
}
/*
{ redirectDetail && <Navigate to={`/piece_queries/detail/${encodeURIComponent(Row)}`} /> }*/
export default App;
