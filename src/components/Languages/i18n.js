import Spanish from './sp/Lang';//Archivo con la traduccion en español
import English from './en/Lang';//Archivo con la traduccion en ingles
import French from './fr/Lang';//Archivo con la traduccion en frances
//Objeto que contiene las traducciones existentes
const languages = {
    en: English,
    sp: Spanish,
    fr: French,     
}

//Tomamos de los archivos temporales del navegador, la preferencia de lenguaje establecida
// O tomamos por default español
const savedLanguage = localStorage.getItem('language') || 'sp';
let currentLanguage = savedLanguage;//variable pára manejar la cadena de lenguaje actual
//Funcion para cambiar de lenguaje
const setLanguage = (lang) => {
    //Si la variable que entra es diferente a la existente 
    //quiere decir que hay un cambio de lengua
    //Tambien revisa si la variable que viene esta incluida en el objeto de lenguajes
    if(currentLanguage !== lang && languages[lang]){
        currentLanguage = lang;
        //guardamos en variable local del navegador, solo es local al cambiar de equipo esto se pierde
        localStorage.setItem('language', lang);
        return true;//regresamos true para refrescar el navegador y aplicar los cambios
    }else{ return false; }//de caso contrario false para no refrescar ya que no hay cambios o no corresponde el lenguaje
}
//Esta funcion toma el archivo de lenguaje correspondiente y lo devuelve para su uso en el sistema
const getTranslations = () => languages[currentLanguage];
//Esta funcion toma la cadena de lenguaje actual por ejemplo "en"
const getActualLang = () => currentLanguage;

export {setLanguage, getTranslations, getActualLang};