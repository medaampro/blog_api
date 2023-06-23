import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Loading from './Loading';

const Home = () => {

    const { Blogs } = useSelector(state => state.homeBlogs);


    if(Blogs.length == 0) return <Loading />

    return(

        <div className="home_page" >

            {
                Blogs && 
                Blogs.map( cat => (
                    <div key={cat._id} >
                        {
                            cat.count > 0 && 
                            <div>
                                <h3>
                                    <Link to={ `/blogs/${(cat.name).toLowerCase()}` }>
                                        { cat.name } <small>({ cat.count })</small>
                                    </Link>
                                </h3>
                                <hr className="mt-1" />
                                <div>
                                {
                                    cat.blogs.map(blog => (

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
                            </div>
                        }
                        {
                            cat.count > 1 &&
                            <Link className="text-end d-block mt-2 mb-3" to={`/blogs/${cat.name}`}> Read more &gt;&gt; </Link>
                        }
                    </div>
                ) )
            }
            
        </div>

    )


}

export default Home;