import React from 'react';
import { useParams } from 'react-router-dom';
import NotFounded from '../components/NotFounded';

const capitalizeFirstLetter = string => string.charAt(0).toUpperCase() + string.slice(1);
  
const generatePage = name => {
        try {
            return React.createElement( require(`../components/${ capitalizeFirstLetter(name) }`).default );
        } catch (error) {
            return <NotFounded />;
        }
}

const RendredPage = () => {

    let { first, second } = useParams();
    let name = first ? `${first}` : 'home';


    if(first) {
        name = second ? `${first}/[second]` : `${first}`;
    }else{
        name = 'home';
    }

    return generatePage(name);
    
}

export default RendredPage;