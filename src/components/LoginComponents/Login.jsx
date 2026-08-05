import Cookies from 'js-cookie';
import { useNavigate } from "react-router";
import React, { useState, useEffect } from 'react';
import './Login.css';
import background1 from '../../LoginImages/background-1.jpg';
import background1Ascii from '../../LoginImages/background-1-ascii.jpg';
import background2 from '../../LoginImages/background-2.jpg';
import background2Ascii from '../../LoginImages/background-2-ascii.jpg';
import background3 from '../../LoginImages/background-3.jpg';
import background3Ascii from '../../LoginImages/background-3-ascii.jpg';
import background4 from '../../LoginImages/background-4.jpg';
import background4Ascii from '../../LoginImages/background-4-ascii.jpg';
import background5 from '../../LoginImages/background-5.jpg';
import background5Ascii from '../../LoginImages/background-5-ascii.jpg';
//import { Navigate } from 'react-router';
//onLogin y setAccess ambas son funciones

const archiveSlides = [
    { image: background1, label: 'background-1', type: 'photo' },
    { image: background1Ascii, label: 'background-1-ascii', type: 'ascii' },
    { image: background2, label: 'background-2', type: 'photo' },
    { image: background2Ascii, label: 'background-2-ascii', type: 'ascii' },
    { image: background3, label: 'background-3', type: 'photo' },
    { image: background3Ascii, label: 'background-3-ascii', type: 'ascii' },
    { image: background4, label: 'background-4', type: 'photo' },
    { image: background4Ascii, label: 'background-4-ascii', type: 'ascii' },
    { image: background5, label: 'background-5', type: 'photo' },
    { image: background5Ascii, label: 'background-5-ascii', type: 'ascii' },
];

const getRandomSlide = (currentSlideIndex) => {
    let nextSlideIndex = currentSlideIndex;

    while (nextSlideIndex === currentSlideIndex) {
        nextSlideIndex = Math.floor(Math.random() * archiveSlides.length);
    }

    return nextSlideIndex;
};

function Login({ onLogin, setAccessToken, accessToken }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');    
    const [redirect, setRedirect] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(() => getRandomSlide(-1));

    const navigate = useNavigate();

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
                    } else {
                        setAccessToken(response.access);
                        setRedirect(true);
                    }

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

    // Slider visual aleatorio del archivo digital; no interviene en la autenticacion.
    useEffect(() => {
        const sliderTimer = setInterval(() => {
            setCurrentSlide((slideIndex) => getRandomSlide(slideIndex));
        }, 6800);

        return () => clearInterval(sliderTimer);
    }, []);

    return (
        <div className="museum-login">
            <div className="museum-login__slider" aria-hidden="true">
                {archiveSlides.map((slide, index) => (
                    <div
                        className={`museum-login__slide museum-login__slide--${slide.type} ${index === currentSlide ? 'museum-login__slide--active' : ''}`}
                        key={slide.label}
                    >
                        <div
                            className="museum-login__slide-image"
                            style={{ backgroundImage: `url(${slide.image})` }}
                        />
                    </div>
                ))}
                <div className="museum-login__shade" />
            </div>

            <section className="museum-login__content">
                <div className="museum-login__panel">
                    <div className="museum-login__panel-header">
                        <span>ACCESS CONSOLE</span>
                        <div className="museum-login__status">
                            {archiveSlides.map((slide, index) => (
                                <span
                                    className={`museum-login__dot ${index === currentSlide ? 'museum-login__dot--active' : ''}`}
                                    key={slide.label}
                                />
                            ))}
                        </div>
                    </div>
                    <h2>Ingreso</h2>
                    {/* Mostrar el mensaje de error si existe */}
                    {error && <div className="museum-login__error">{error}</div>}
                    <form className="museum-login__form" onSubmit={handleSubmit}>
                        <div className="museum-login__field">
                            <label>Email:</label>
                            <input type="text" value={email} onChange={handleEmailChange} />
                        </div>
                        <div className="museum-login__field">
                            <label>Password:</label>
                            <input type="password" value={password} onChange={handlePasswordChange} />
                        </div>
                        <button className="museum-login__button" type="submit">Login</button>
                    </form>
                </div>
            </section>
            <div>{}</div>
        </div>
    );
}

export default Login;
