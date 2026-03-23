// LocalTools/moment.js
import moment from "moment";

// hacemos moment global para que el plugin lo encuentre
window.moment = moment;

// cargamos el plugin usando require
// ⚠️ esto no rompe en Vite porque require se ejecuta en runtime
// y el plugin modifica window.moment
// @ts-ignore
//require("moment-precise-range-plugin");

export default moment;
