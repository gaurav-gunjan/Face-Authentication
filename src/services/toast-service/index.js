import { toast } from "react-toastify";

export const Msg = ({ text }) => {
    console.log("Taoster Msg", text);

    return (
        <p className='text-grey'>{text}</p>
    );
};

export const toaster = (myProps, toastProps) => toast(<Msg {...myProps} />, { ...toastProps });

toaster.success = (myProps, toastProps) => toast.success(<Msg {...myProps} />, { ...toastProps });
toaster.error = (myProps, toastProps) => toast.error(<Msg {...myProps} />, { ...toastProps });
toaster.warning = (myProps, toastProps) => toast.warning(<Msg {...myProps} />, { ...toastProps });
toaster.info = (myProps, toastProps) => toast.info(<Msg {...myProps} />, { ...toastProps });