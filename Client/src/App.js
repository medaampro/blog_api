import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { useEffect } from 'react';
import { Server_Url } from './helpers/config';
import RendredPage from './helpers/RendredPage';
import Navbar from './components/Navbar';
import Footer from "./components/Footer";
import { RefreshToken } from "./Actions/auth";
import { getCategories } from "./Actions/category";
import { getBlogs } from "./Actions/blog";
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import SokectClient from './components/SocketClient';

const App = () => {

    const dispatch = useDispatch();
    
    useEffect( () => {
        
        dispatch(RefreshToken());
        dispatch(getCategories());
        dispatch(getBlogs());

    }, [dispatch] )

    useEffect(() => {

        const socket = io(Server_Url);
        dispatch({ type: 'SOCKET', payload: socket });

        // {
        //     uu Can use 2 methods: 
        //     1/ define socket in reducer as null and make ur conditions around socket state 
        //        if u r connecting uu will get data in payload and ur state will not be null ...
        //     2/ define socket in reducer as {} and connect manually ur client-socket to backend 
        //        if it's conecting then dispatch the socket state and now make your condition around socket.connected
                    // socket.on("connect", () => {
                    //     dispatch({ type: 'SOCKET', payload: socket });
                    // });

                    // If it's Deconnect We Try to Connect it
                    // socket.on("disconnect", (reason) => {
                    //     if (reason === "io server disconnect") {
                    //       socket.connect();
                    //     }
                    //     if(socket.connected) {
                    //         dispatch({ type: 'SOCKET', payload: socket });
                    //     }
                    //   });
        // }

        return () => { socket.close() };

    },[dispatch])

    return (

        <div className="container" >
            <SokectClient />
            <Router>
                <Navbar />
                <Switch>
                
                    <Route path="/"               exact component={ RendredPage } />
                    <Route path="/:first"         exact component={ RendredPage } />
                    <Route path="/:first/:second" exact component={ RendredPage } />

                </Switch>
                <Footer />
            </Router>


        </div>

    )

}

export default App;