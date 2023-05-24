import axios from "axios";

const gloabalAxiosWithInterceptor = axios.create();
const axiosWithoutInterceptor = axios.create();

export { gloabalAxiosWithInterceptor, axiosWithoutInterceptor };
