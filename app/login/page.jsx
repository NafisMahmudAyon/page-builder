'use client'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const Page = () => {
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const router = useRouter();

const fetchUser = async () => {
  try {
    if(name === "" || email === "") {
      alert("Please fill all fields");
      return;
    }
    const response = await fetch("http://localhost:5000/api/auth/login",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email }),
    });
    const data = await response.json();
    //sava on localstorage
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token);
    //redirect to home
    router.push("/");
    console.log(data);
  }catch (error) {
    console.log(error);
  }
}

const handleSubmit = (e) => {
  e.preventDefault();
  fetchUser()
};
  return (  
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Name" onChange={(e)=>{setName(e.target.value)}} />
        <input type="email" placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}} />
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default Page