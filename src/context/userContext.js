import { createContext, useEffect, useState } from "react";

const UserContext = createContext();

const UserProvider = ({children}) => {
    const [user, setUser] = useState({
        token: "",
        details: ""
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const data = localStorage.getItem('jwtToken');
        if (data) {
            let userFetched = JSON.parse(data);
            setUser({
                token: userFetched.token,
                details: userFetched.details
            });
        }
        setLoading(false);
    }, []);

    if (loading) {
        return <div></div>; // Show a loading indicator while fetching the user data
    }

    return (
        <UserContext.Provider value={[user, setUser]}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };



// import { createContext, useEffect, useState } from "react";

// //const userInitial = localStorage.getItem('jwtToken') 

// const UserContext = createContext()

// const UserProvider = ({children}) => {

//     const [user,setUser] = useState({
//         token : "",
//         details  : ""
//     })

//     useEffect(()=>{

//         const data = localStorage.getItem('jwtToken')

//         if(data){
            
//             let userFetched = JSON.parse(data)

//             setUser({
//                token : userFetched.token,
//                details  : userFetched.details 
//             })

//         }

//     },[])

//     return (
//         <UserContext.Provider value={[user,setUser]}>
//             {children}
//         </UserContext.Provider>
//     )
   
// }

// export {UserContext,UserProvider}