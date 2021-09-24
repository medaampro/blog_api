import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const LiteQuill = ({body, setBody}) => {


    const modules = { toolbar: { container } };

    return (
        <div>
            <ReactQuill theme="snow" modules={ modules } placeholder="Write somethings ..." value={ body } onChange={ e => setBody(e) } />
        </div>
    )

}

let container = [
    [{ 'font': [] }],
    ['bold', 'italic', 'underline', 'strike'],        
    ['blockquote', 'code-block', 'link'],
    [{ 'color': [] }, { 'background': [] }],          
    [{ 'script': 'sub'}, { 'script': 'super' }]
];

export default LiteQuill;