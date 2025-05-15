import axios from "axios";

export const API = axios.create({ baseURL: "http://localhost:8080" });

export const API_NOTIFICATION = axios.create({ baseURL: 'http://localhost:8081' });

