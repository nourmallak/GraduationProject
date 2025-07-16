import axios from "axios";
import { createContext, useEffect, useState } from "react";
import Loader from "../Loader/Loader";
export const HomePageContext = createContext();

const HomePageContextProvider = ({children})=>{
    const [isLoading, setIsLoading] = useState(true);
    const [data , setData] = useState(0);
    const getUser = async () => {
        const token = localStorage.getItem('user token');
        try{
            const response = await axios.get(`http://pcpc.runasp.net/MainPage/get`, {
                headers: {Authorization: `Bearer ${token}`,},
            });
            console.log(response.data);
            setData(response.data)
                  
        }catch(err){
            console.error(err);
            return;
        }finally{
       setIsLoading(false);
    }
    }
    useEffect(()=>{
        getUser();
    },[])
    if (isLoading) return <Loader />;
    return (
        <HomePageContext.Provider value={{ data, setData, getUser }}>

            {children}
        </HomePageContext.Provider>
    )
}
export default HomePageContextProvider;