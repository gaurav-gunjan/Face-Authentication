import React, { useState, useEffect } from 'react';
import faceIO from '@faceio/fiojs';
import { GenerateRandomId } from '../utils/common-function';
import { toaster } from '../services/toast-service';

const FaceComponent = () => {
    const [fioInstance, setFioInstance] = useState(null);
    const faceioRef = useRef(null);

    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Todo : Initialize Face IO
    // const initialiseFaceio = async () => {
    //     try {
    //         const faceio = new faceIO('fioa52f3');
    //         setFioInstance(faceio);
    //         console.log('FaceIO initialized successfully ::: ', faceio);
    //     } catch (error) {
    //         console.log('FaceIO initialization failed ::: ', error);
    //         handleError(error);
    //         fioInstance.restartSession();
    //     }
    // };
    const initialiseFaceio = async () => {
        try {
            faceioRef.current = new faceIO(publicKey);
            console.log("FaceIO initialized successfully");
        } catch (error) {
            console.log(error);
            handleError(error);
        }
    };

    //! Handle Register : Enroll (Register) New User
    const handleRegister = async () => {
        try {
            const response = await fioInstance?.enroll({
                locale: 'auto',
                payload: { user_id: GenerateRandomId(), full_name: fullName, email: email },
            });
            console.log('User enrolled successfully:', response);
            toaster.success({ text: 'User enrolled successfully!' });
        } catch (error) {
            console.log('User enrolled failed ::: ', error);
            handleError(error);
            fioInstance.restartSession();
        }
    };

    //! Handle Login : Authenticate User
    const handleLogin = async () => {
        try {
            const response = await fioInstance?.authenticate();
            console.log('User authenticated successfully ::: ', response);
            setIsLoggedIn(true);
            toaster.success({ text: `Hii, ${response?.payload?.full_name}! You are Successfully logged in!` });
        } catch (error) {
            console.log('User authenticated failed ::: ', error);
            handleError(error);
        }
    };

    // Todo : Handle Errors
    const handleError = (errCode) => {
        const fioErrs = fioInstance?.fetchAllErrorCodes();
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
        <div className='App'>
            <h1>FaceIO Authentication</h1>

            {!isLoggedIn ? (
                <>
                    <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
                        <div>
                            <label>Email:</label>
                            <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>

                        <div>
                            <label>Full Name:</label>
                            <input type='text' value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                        </div>

                        <button type='submit'>Enroll New User</button>
                    </form>

                    <button onClick={handleLogin}>Authenticate User</button>
                </>
            ) : (
                <p>Welcome, you are authenticated!</p>
            )}
        </div>
    );
};

export default FaceComponent;