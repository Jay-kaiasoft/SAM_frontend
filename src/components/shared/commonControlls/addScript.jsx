import {useEffect} from "react";

const AddScript = (url) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = url;
        script.async = false;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, [url]);
}

export default AddScript;