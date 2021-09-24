import { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBlogsByUserId } from "../Actions/blog";
import Loading from "./Loading";
import Pagination from "./Pagination";

const UserBlogs = ({userId}) => {

    const history = useHistory();
    const { search } = history.location;

    const dispatch = useDispatch();

    const [myBlogs, setMyBlogs] = useState([]);
    const [total, setTotal] = useState(0);

    const { Blogs, Total, Id, Search } = useSelector(state => state.userBlogs);

    useEffect(() => {
        if(!userId) return;

        if(Blogs.every(item => item.user._id !== userId)) {
            dispatch(getBlogsByUserId(userId, search));
        }else {
            let T = [];
            Blogs.map( item => {
                if(item.user._id === userId) T.push(item);
            })
            if(!T) return;
            setMyBlogs(T);
            setTotal(Total);
            if(Search) history.push(Search);
        }

    }, [userId, Blogs, dispatch]);

    const handlePagination = num => {
        const search = `?page=${num}`;
        dispatch(getBlogsByUserId(userId, search));
    }

    if(myBlogs.length == 0) return <Loading />

    return (
        <div className="col-8 col-md-8 col-lg-4" style={{ textAlign: "center" }}>

            <div className="home_page" >
                {
                    myBlogs.map(blog => (

                        <div key={blog._id} className="card home_blogs">

                            {
                                typeof(blog.thumbnail) === 'string' &&
                                <img src={blog.thumbnail} className="card-img-top" alt="..." style={{height: '180px', objectFit: 'cover'}} />
                            }
                            <div className="card-body">
                                <h5 className="card-title">
                                <Link to={`/blog/${blog._id}`}>
                                    { blog.title.slice(0,50) + '...' }
                                </Link>
                                </h5>
                                <p className="card-text">
                                    { blog.description.slice(0,20) + '...' }
                                </p>

                                <p className="card-text d-flex justify-content-between">
                                    <small className="text-muted text-capitalize">
                                        {
                                        typeof(blog.user) !== 'string' &&
                                        <Link to={`/profile/${blog.user._id}`}>
                                            By: { blog.user.role === "admin" ? "Admin" : blog.user.name }
                                        </Link>
                                        }
                                    </small>

                                    {/* Update Blog Icon , use A validator for check the equality , user connected is mol lblog */}

                                    <small className="text-muted">
                                        { new Date(blog.createdAt).toLocaleString() }
                                    </small>
                                </p>
                            </div>
                        
                                        

                        </div>
                        
                    ))
                }
            </div>
            {
                Total > 1 &&
                <Pagination 
                    total={ total }
                    callback={ handlePagination }
                />
            }
        </div>
    )
}

export default UserBlogs;
