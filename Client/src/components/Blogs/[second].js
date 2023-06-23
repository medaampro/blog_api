import { useState, useEffect } from "react";
import { Link, useParams, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getBlogsByCategoryId } from "../../Actions/blog";
import Loading from "../Loading";
import Pagination from "../Pagination";

const BlogByCategory = () => {

    const { second } = useParams();
    const history = useHistory();
    const { search } = history.location;

    const { Cats } = useSelector(state => state.cat);
    const { Blogs, Total, Id, Search } = useSelector(state => state.catBlogs);
    const dispatch = useDispatch();

    let [categoryId, setCategoryId] = useState('');
    let [myBlogs, setMyBlogs] = useState([]);
    let [total, setTotal] = useState(0);


    useEffect(() => {
        if(second && Cats && Cats.length > 0) {
            let category = Cats.find( x => x.name === second );
            if(!category) return;
            setCategoryId(category._id);
        }
    }, [second, Cats])

    
    useEffect(() => {

        if(!categoryId) return;
        if(Blogs.every(item => item.category !== categoryId)) {
            dispatch(getBlogsByCategoryId(categoryId, search));
        }else {
            let T = [];
            Blogs.map(item => {
                if(item.category === categoryId) T.push(item);
            })
            if(!T) return;
            setMyBlogs(T);
            setTotal(Total);
            if(Search) history.push(Search);
        }        

    }, [categoryId, Blogs, dispatch])


    const handlePagination = num => {
        const search = `?page=${num}`;
        dispatch(getBlogsByCategoryId(categoryId, search));
    }

    if(myBlogs.length == 0) return <Loading />
    

    return (
        <div>
            <div className="mt-4 mb-4" >
            {
                myBlogs.map(blog => (

                    <div key={blog._id} className="card" className="col-12 col-md-6 col-lg-4">

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

export default BlogByCategory;