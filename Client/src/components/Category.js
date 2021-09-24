import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { createCategory } from "../Actions/category";
import NotFounded from "./NotFounded";

const Category = () => {

    const { push } = useHistory();

    const [cat, setCat] = useState('');
    const auth = useSelector(state => state.auth);
    const dispatch = useDispatch();

    const submitData = e => {
        e.preventDefault();
        dispatch(createCategory(cat, auth.Token, push));
    }

    if(auth.User?.role !== "admin") return <NotFounded />

    return(
        <>
            <form onSubmit = { e => submitData(e) } >

                <div className="mb-3 row">
                    <label htmlFor="inputCat" className="col-sm-2 col-form-label">Category</label>
                    <div className="col-sm-10">
                        <input type="text" value = { cat } className="form-control" id="inputCat" onChange= { e => setCat(e.target.value) } />
                    </div>
                </div>

                <div className="col-12 text-center">
                    <button className="btn btn-primary" type="submit" disabled= { cat ? false : true} >Create Category</button>
                </div>

                <div className="text-center" >
                    <small>
                        do a ul list for categories and add icons for edit / all in one component that change with state
                    </small>
                </div>

            </form>  

        </>
    )

    // do a ul list for categories and add icons for edit && delete in one component change with state

}

export default Category;