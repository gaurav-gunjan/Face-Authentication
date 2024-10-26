import faceIO from '@faceio/fiojs';
import React, { useState, useEffect, useRef } from 'react';
import { toaster } from '../../services/toast-service';
import { face_io_public_id } from '../../utils/constant';
import { GenerateRandomId } from '../../utils/common-function';
import { instructionData } from '../../utils/static-data';

const LandingPage = () => {
    const faceioRef = useRef(null);
    const [inputFieldDetail, setInputFieldDetail] = useState({ fullName: '', email: '' });
    const handleInputFieldDetail = (event) => setInputFieldDetail({ ...inputFieldDetail, [event.target.name]: event.target.value });

    // Todo : Initialize Face IO
    const initialiseFaceio = async () => {
        try {
            faceioRef.current = new faceIO(face_io_public_id);
            console.log('FaceIO initialized successfully ::: ', faceioRef.current);
        } catch (error) {
            console.log('FaceIO initialization failed ::: ', error);
            handleError(error);
        }
    };

    //! Handle Register : Enroll (Register) New User
    const handleRegister = async () => {
        const { fullName, email } = inputFieldDetail;
        console.log({ fullName, email });
        try {
            if (fullName !== '' && email !== '') {
                const response = await faceioRef.current?.enroll({
                    userConsent: false,
                    locale: 'auto',
                    payload: { user_id: GenerateRandomId(), full_name: fullName, email: email },
                });
                if (response) {
                    console.log('User enrolled successfully:', response);
                    toaster.success({ text: 'User enrolled successfully!' });

                }
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
            if (response?.facialId) {
                toaster.success({ text: `Hii, ${response?.payload?.full_name}! You are Successfully logged in!` });
                // window.open("https://eye2i.ai/congratulations5");
                window.location.href = "https://eye2i.ai/congratulations5";
            }
            else {
                toaster.success({ text: `Unable to logged in!` });
            }
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
                toaster.info({ text: 'Presentation (Spoof) Attack (PAD) detected during the scan process' });
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
            <section className='min-h-screen flex items-center justify-center bg-[#08162E]'>
                <article>
                    <main className='flex max-md:flex-col max-md:w-[95vw] max-lg:w-[800px] w-[1000px] min-h-80'>
                        <div className='basis-[50%] max-md:basis-[100%] bg-white flex items-center justify-center'>
                            <div className="max-w-[350px] w-full p-8 rounded-md shadow-md">
                                <div className="flex flex-col gap-[15px]">
                                    <input name="fullName" value={inputFieldDetail?.fullName} onChange={(e) => handleInputFieldDetail(e)} required type='email' className="p-[15px] border-[2px] border-[#CCC] rounded-md outline-none focus:border-sky-200" placeholder="Full Name" />
                                    <input name="email" value={inputFieldDetail?.email} onChange={(e) => handleInputFieldDetail(e)} required type='text' className="p-[15px] border-[2px] border-[#CCC] rounded-md outline-none focus:border-sky-200" placeholder="Email" />
                                    <div onClick={() => handleRegister()} className="p-[15px] bg-[#007BFF] rounded-md text-center text-white">Enroll</div>
                                </div>
                                <div className="flex gap-2 justify-center mt-4">
                                    <p>Already have a account? <span onClick={() => handleLogin()} className="cursor-pointer text-[#007BFF]">Login</span></p>
                                </div>
                            </div>
                        </div>
                        <div className='basis-[50%] max-md:basis-[100%] bg-sky-200 px-10 py-5 flex flex-col gap-2'>
                            <div className='text-[#08162E] text-5xl text-center mb-5'>Instruction</div>
                            {instructionData?.map((value, index) => (
                                <div key={index} className='flex gap-1'>
                                    <div>{index + 1}. </div>
                                    <div>{value}</div>
                                </div>
                            ))}
                        </div>
                    </main>
                </article>
            </section>
        </>
    );
};

export default LandingPage;