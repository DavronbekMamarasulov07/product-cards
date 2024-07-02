import axios from "axios";

const instance = axios.create({ 
    baseURL: "https://dummyjson.com",
    headers:{
        "Content-Type" : "application/json"
    },
    timeout: 10000, //malumot 10 sekund ichida kelmasa back and dan "error" beradi 
})
export default instance