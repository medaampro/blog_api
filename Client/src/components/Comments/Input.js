import { useState, useRef } from "react";
import LiteQuill from "../Edit/LiteQuill";

const Input = ({ callback }) => {

    let [body, setBody] = useState('');
    let divRef = useRef(null);

    const handleSubmit = () => {
        const div = divRef.current;
        const text = div?.innerText;
        if(!text.trim()) return;
        
        callback(body);
        setBody('');
    }

    return (
        <>

            <LiteQuill body= { body } setBody={ setBody } />

            <div dangerouslySetInnerHTML={{
                __html: body
            }} 
                ref= { divRef } style={{display: "none"}}
            />

            <button className="btn btn-dark ms-auto d-block px-4 mt-2" onClick={ handleSubmit }>
                Send
            </button>

        </>
    )
}

export default Input;
