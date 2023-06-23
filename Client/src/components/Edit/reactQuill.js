import { useEffect, useRef, useCallback } from 'react';
import { imageValidator } from '../../helpers/imageValidator';
import { imageUpload } from '../../helpers/imageUpload';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Quill = ({setBody}) => {

    const quillRef = useRef(null);

    const handleChangeImage = useCallback(() => {

        const input = document.createElement('input');
        input.type = "file";
        input.click();
        input.onchange = async () => {
            if(!input.files) return console.log('Any Image !!');
            const file = input.files[0];

            let check = imageValidator(file);
            if(check) return console.log('Size Of Image is More than 1Mb !!');

            const photo = await imageUpload(file);
            
            const quill = quillRef.current;
            const range = quill?.getEditor().getSelection()?.index;
            if(range !== undefined) quill?.getEditor().insertEmbed(range, 'image', photo.url);
            
        }

    }, []) 

    useEffect(() => {

        const quill = quillRef.current;
        if(!quill) return;
        let toolbar = quill.getEditor().getModule('toolbar');
        toolbar.addHandler('image', handleChangeImage );
        quillRef.current.getEditor().getModule('toolbar').addHandler('image', handleChangeImage );

    }, [handleChangeImage])

    const modules = { toolbar: { container } };

    return (
        <div>
            <ReactQuill theme="snow" modules={ modules } placeholder="Write somethings ..." ref={ quillRef } onChange={ e => setBody(e) } />
            <small>More Than 2000 Words</small>
        </div>
    )
    
}

let container = [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{ 'header': 1 }, { 'header': 2 }],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],
    [{ 'indent': '-1'}, { 'indent': '+1' }],
    [{ 'direction': 'rtl' }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'font': [] }],
    [{ 'align': [] }],
    ['clean', 'link', 'image','video']
];

export default Quill;
