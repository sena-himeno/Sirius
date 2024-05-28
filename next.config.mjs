/** @type {import('next').NextConfig} */
const nextConfig = {
    distDir:'out',
    publicRuntimeConfig:{
        diary:false,
        todoList:false
    },
    "eslint": {
        "ignoreDuringBuilds": true,
    }
};

export default nextConfig;

