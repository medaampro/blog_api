import { Link, useHistory } from 'react-router-dom';
import { useEffect, useState, useRef } from "react";
import { useDispatch , useSelector } from "react-redux";
import { blogValidator } from "../helpers/blogValidator";
import { createBlog } from '../Actions/blog';
import NotFounded from "./NotFounded";
import ReactQuill from "./Edit/reactQuill";
import toastr from 'toastr';
import 'toastr/build/toastr.css';

const CreateBlog = () => {

    const { push } = useHistory();

    const initState = {
        user: '',
        title: '',
        content: '',
        description: '',
        thumbnail: '',
        category: '',
        createdAt: new Date().toISOString()
    };
    let [blog, setBlog] = useState(initState);
    let [body, setBody] = useState('');

    const { auth, cat } = useSelector(state => state);
    const dispatch = useDispatch();

    const divRef = useRef(null);
    const [text, setText] = useState('');

    useEffect(() => {
        const div = divRef.current;
        if(!div) return;
        setText(div.innerText);
        setBlog({...blog, content: body});
    }, [body]);

    const submitBlog = () => {
        const check = blogValidator({...blog, content: text});
        if(check.length > 0) {
            for(let i=0; i<check.length; i++) {
                toastr.warning(check[i], 'Please Check form !!!', {"positionClass": "toast-bottom-left", timeOut: 10000});
            }
            return;
        }

        dispatch(createBlog(blog, auth.Token, push));
    }

    if(!auth.Token) return <NotFounded />;

    return (
        <>

            <div className="row mt-4">
                <div className="col-md-6">
                    <h5>Create</h5>
                    <form>
                        <div className="mb-3 row">
                            <label htmlFor="inputTitle" className="col-sm-2 col-form-label">Blog Name</label>
                            <div className="col-sm-10">
                                <input type="text" value = { blog.title } className="form-control" id="inputTitle" onChange = { e => setBlog({...blog, title: e.target.value}) } />
                                <small style={{ color: blog.title.length <= 50 ? "black" : "red" }} >{blog.title.length}/50</small>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="inputFile" className="col-sm-2 col-form-label">Thumbnail</label>
                            <div className="col-sm-10">
                                <input type="file" className="form-control" id="inputFile" onChange = { e => { e.target.files ? setBlog({...blog, thumbnail: e.target.files[0]}) : setBlog({...blog, thumbnail: ""}); } } />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label htmlFor="inputDescription" className="col-sm-2 col-form-label">Description</label>
                            <div className="col-sm-10">
                                <textarea value = { blog.description } className="form-control" id="inputDescription" onChange = { e => { setBlog({...blog, description: e.target.value}) } } />
                                <small style={{ color: blog.description.length <= 200 ? "black" : "red" }} >{blog.description.length}/200</small>
                            </div>
                        </div>
                        <div className="mb-3 row">
                        <label htmlFor="inputDescription" className="col-sm-2 col-form-label">Category</label>
                            <div className="col-sm-10">
                                <select className="form-control text-capitalize" value={ blog.category } name="category" onChange = { e => { setBlog({...blog, category: e.target.value}) } } >
                                    <option value="" disabled={ true } > Choose a category </option>
                                    {
                                        cat.Cats && cat.Cats.map(x => <option key={x._id} value={x._id}>{x.name}</option> )
                                    }
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="col-md-6" style={{textAlign: "center"}} >
                    <h5>Preview</h5>
                    <div className="card" style={{"width":"18rem"}}>
                        {
                            blog.thumbnail && 
                            <>
                                {
                                    typeof(blog.thumbnail) === 'string'
                                    ? <Link to={`/blog/${blog._id}`}> <img src={blog.thumbnail} alt="thumbnail" /></Link> : 
                                    <img src={URL.createObjectURL(blog.thumbnail)} alt="thumbnail" />
                                }
                            </>
                        }
                        <div className="card-body">
                            <h5 className="card-title"> { blog.title } </h5>
                            <p className="card-text"> { blog.description } </p>
                            <p className="card-text"> <small className="text-muted" >{ new Date(blog.createdAt).toLocaleString() }</small> </p>
                        </div>
                    </div>
                </div>
                <ReactQuill setBody={ setBody } />
                <div ref={ divRef } dangerouslySetInnerHTML={{__html: body}} style={{display: 'none'}} />
                <div>
                    <button className="btn btn-dark mt-3 d-block mx-auto" style={{width: "120px", cursor: "pointer"}} onClick={ () => submitBlog() } >Create Post</button>
                </div>
            </div>

        </>
    )
}

export default CreateBlog;
