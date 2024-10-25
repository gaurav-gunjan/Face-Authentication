import React, { useState, useEffect, useRef } from 'react';
import faceIO from '@faceio/fiojs';
import { GenerateRandomId } from '../utils/common-function';
import { toaster } from '../services/toast-service';

const FaceComponent = () => {
    const faceioRef = useRef(null);

    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Todo : Initialize Face IO
    const initialiseFaceio = async () => {
        try {
            faceioRef.current = new faceIO('fioa52f3');
            console.log('FaceIO initialized successfully ::: ', faceioRef.current);
        } catch (error) {
            console.log('FaceIO initialization failed ::: ', error);
            handleError(error);
        }
    };

    //! Handle Register : Enroll (Register) New User
    const handleRegister = async () => {
        console.log({ fullName, email });
        try {
            if (fullName !== '' && email !== '') {
                const response = await faceioRef.current?.enroll({
                    locale: 'auto',
                    payload: { user_id: GenerateRandomId(), full_name: fullName, email: email },
                });
                console.log('User enrolled successfully:', response);
                toaster.success({ text: 'User enrolled successfully!' });
            }
        } catch (error) {
            console.log('User enrolled failed ::: ', error);
            handleError(error);
            faceioRef.current?.restartSession();
        }
    };

    //! Handle Login : Authenticate User
    const handleLogin = async () => {
        try {
            const response = await faceioRef.current?.authenticate();
            console.log('User authenticated successfully ::: ', response);
            setIsLoggedIn(true);
            toaster.success({ text: `Hii, ${response?.payload?.full_name}! You are Successfully logged in!` });
        } catch (error) {
            console.log('User authenticated failed ::: ', error);
            handleError(error);
            faceioRef.current?.restartSession();
        }
    };

    // Todo : Handle Errors
    const handleError = (errCode) => {
        const fioErrs = faceioRef.current?.fetchAllErrorCodes();
        console.log('Fio Error ::: ', fioErrs);
        console.log('Error Code ::: ', errCode);

        switch (errCode) {
            case fioErrs.NO_FACES_DETECTED:
                toaster.info({ text: 'No faces were detected during the enroll or authentication process' });
                break;
            case fioErrs.UNRECOGNIZED_FACE:
                toaster.info({ text: `Unrecognized face on this application's Facial Index` });
                break;
            case fioErrs.MANY_FACES:
                toaster.info({ text: 'Two or more faces were detected during the scan process' });
                break;
            case fioErrs.FACE_DUPLICATION:
                toaster.info({ text: 'User enrolled previously (facial features already recorded). Cannot enroll again!' });
                break;
            case fioErrs.MINORS_NOT_ALLOWED:
                toaster.info({ text: 'Minors are not allowed to enroll on this application!' });
                break;
            case fioErrs.PAD_ATTACK:
                toaster.info('Presentation (Spoof) Attack (PAD) detected during the scan process');
                break;
            case fioErrs.FACE_MISMATCH:
                toaster.info({ text: 'Calculated Facial Vectors of the user being enrolled do not matches' });
                break;
            case fioErrs.WRONG_PIN_CODE:
                toaster.info({ text: 'Wrong PIN code supplied by the user being authenticated' });
                break;
            case fioErrs.PROCESSING_ERR:
                toaster.info({ text: 'Server side error' });
                break;
            case fioErrs.UNAUTHORIZED:
                toaster.info({ text: 'Your application is not allowed to perform the requested operation (eg. Invalid ID, Blocked, Paused, etc.). Refer to the FACEIO Console for additional information' });
                break;
            case fioErrs.TERMS_NOT_ACCEPTED:
                toaster.info({ text: 'Terms & Conditions set out by FACEIO/host application rejected by the end user' });
                break;
            case fioErrs.UI_NOT_READY:
                toaster.info({ text: 'The FACEIO Widget could not be (or is being) injected onto the client DOM' });
                break;
            case fioErrs.SESSION_EXPIRED:
                toaster.info({ text: 'Client session expired. The first promise was already fulfilled but the host application failed to act accordingly' });
                break;
            case fioErrs.TIMEOUT:
                toaster.info({ text: 'Ongoing operation timed out (eg, Camera access permission, ToS accept delay, Face not yet detected, Server Reply, etc.)' });
                break;
            case fioErrs.TOO_MANY_REQUESTS:
                toaster.info({ text: 'Widget instantiation requests exceeded for freemium applications. Does not apply for upgraded applications' });
                break;
            case fioErrs.EMPTY_ORIGIN:
                toaster.info({ text: 'Origin or Referer HTTP request header is empty or missing' });
                break;
            case fioErrs.FORBIDDDEN_ORIGIN:
                toaster.info({ text: 'Domain origin is forbidden from instantiating fio.js' });
                break;
            case fioErrs.FORBIDDDEN_COUNTRY:
                toaster.info({ text: 'Country ISO-3166-1 Code is forbidden from instantiating fio.js' });
                break;
            case fioErrs.SESSION_IN_PROGRESS:
                toaster.info({ text: 'Another authentication or enrollment session is in progress' });
                break;
            case fioErrs.NETWORK_IO:
            default:
                toaster.info({ text: 'Error while establishing network connection with the target FACEIO processing node' });
                break;
        }
    };

    useEffect(() => {
        initialiseFaceio();
    }, []);

    return (
        <>
            <div className="app-container">
                <div className="background-section">
                    <h1 className="headline">GET READY!</h1>
                    <h2 className="sub-headline">YOUR ADVENTURE IS HERE</h2>
                    <button className="begin-btn">BEGIN</button>
                </div>

                {!isLoggedIn && <div className="login-card">
                    <div className="logo-container">
                        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKI0UsN0rAyBgbP5pQHGb50naj97JUk6h1Xg&s" alt="Logo" className="logo" />
                    </div>
                    <form className="login-form">
                        <input type="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="input-field" placeholder="fullName" />
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field" placeholder="Email" />

                        <div onClick={() => handleRegister()} className="login-btn">Enroll</div>
                    </form>
                    <div className="create-account">
                        <p>Already have a account? <span onClick={() => handleLogin()} className="create-link">Login</span></p>
                    </div>
                </div>}

                {isLoggedIn && <div onClick={() => setIsLoggedIn(false)} style={{ position: 'fixed', top: '20px', right: '20px' }} className="login-btn">Logout</div>}
            </div>
        </>
    );
};

export default FaceComponent;