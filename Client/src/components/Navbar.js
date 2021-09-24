import { Link, useLocation } from 'react-router-dom';
import Search from './Search';
import { useDispatch, useSelector } from 'react-redux';
import { signOut } from '../Actions/auth';


const Navbar = () => {

    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const { pathname } = useLocation();
    const isActive = pn => pn === pathname ? "Active_Link" : "";



    return(

        <>
        
                <nav className="navbar navbar-expand-lg navbar-light bg-light">
                    <div className="container-fluid">

                        <Link className="navbar-brand" to="/">Blog App</Link>

                        <Search />

                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon" />
                        </button>


                        <div className="collapse navbar-collapse" id="navbarSupportedContent">

                            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                <li className="nav-item" >
                                    <Link className={`nav-link active ${ isActive("/") }`} aria-current="page" to="/">Home</Link>
                                </li>

                                { auth.Token && 
                                    <>
                                        <li className="nav-item" >
                                            <Link className={`nav-link active ${ isActive("/createBlog") }`} aria-current="page" to="/createBlog">Create Blog</Link>
                                        </li>
                                    </>
                                }

                                { auth.User?.role === "admin" && 
                                    <>
                                        <li className="nav-item" >
                                            <Link className={`nav-link active ${ isActive("/category") }`} aria-current="page" to="/category">Category</Link>
                                        </li>
                                    </>
                                }

                                { !auth.Token && 
                                    <>
                                        <li className="nav-item" >
                                            <Link className={`nav-link active ${ isActive("/signin") }`} aria-current="page" to="/signin">Sign In</Link>
                                        </li>
                                        <li className="nav-item" >
                                            <Link className={`nav-link active ${ isActive("/signup") }`} aria-current="page" to="/signup">Sign Up</Link>
                                        </li>
                                    </>
                                }
                                <li className="nav-item dropdown">


                                    { auth.Token && 
                                        <>
                                            <span className="nav-link dropdown-toggle" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false"> { auth.User.name } </span>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <li><Link className={`dropdown-item ${ isActive(`/profile/${auth.User._id}`) }`} to={`/profile/${auth.User._id}`}>Profile</Link></li>
                                                <li><hr className="dropdown-divider" /></li>
                                                <li><Link className={`dropdown-item ${ isActive("/signout") }`} onClick={ () => dispatch(signOut(auth.Token))   } to="/signout">Sign Out</Link></li>
                                            </ul>
                                        </>
                                    }



                                </li>
                            </ul>

                        </div>

                    </div>
                </nav>

        </>

    )
}

export default Navbar;