import { useState, useEffect } from "react";
import { Link, useLocation } from 'react-router-dom';
import { API_URL } from '../helpers/config';

const Search = () => {

    const [search, setSearch] = useState("");
    const [blogs, setBlogs] = useState([]);

    const { pathname } = useLocation();

    useEffect(() => {

        const delayDebounce = setTimeout(() => {

            if(search.length < 2) return setBlogs([]);
            fetch(`${API_URL}/blog/search/blogs?title=${search}`, {
                method: "GET",
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(result => result.json())
                .then(result => {
                    if(result.errors) {
                        console.log(result.errors);
                        setBlogs([]);
                    }else{
                        setBlogs(result.data);
                    }
                })
                .catch(err => console.log(err) )

        }, 5000)

        return () => clearTimeout(delayDebounce);

    }, [search])

    useEffect(() => {
        setSearch('')
        setBlogs([])
      },[pathname])

    return(

        <div className="search position-relative me-4" style={{width: "60%"}} >

            <div>
                <form className="d-flex">
                    <input className="form-control me-2 mx-auto" type="search" placeholder="Search" aria-label="Search" value={ search } onChange={ e => setSearch(e.target.value) } />
                </form>
            </div>

            {
                search.length >= 2 &&
                <div className="position-absolute pt-2 px-1 w-100 rounded"
                    style={{ background: '#eee', zIndex: 10, maxHeight: 'calc(100vh - 100px)', overflow: 'auto' }}>
                {
                    blogs.length > 0 ?
                    blogs.map(blog => (
                        <div key={blog._id} className="card home_blogs" >
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
                                { blog.description.slice(0,100) + '...' }
                            </p>

                            <p className="card-text d-flex justify-content-between">
                            {/* <small className="text-muted text-capitalize">
                                {
                                typeof(blog.user) !== 'string' &&
                                <Link to={`/profile/${blog.user._id}`}>
                                    By: { blog.user.role === "admin" ? "Admin" : blog.user.name }
                                </Link>
                                }
                            </small> */}

                            <small className="text-muted">
                                { new Date(blog.createdAt).toLocaleString() }
                            </small>
                            </p>
                        </div>
                    </div>

                    ))
                    : <h3 className="text-center">No Blogs</h3>
                }
                </div>
            }

        </div>

    )
}

export default Search;
