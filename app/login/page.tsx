'use client'

import React, { FormEvent, useState } from 'react';
import axios from 'axios';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function LoginPage() {
    const [error, setError]=useState("");
    const router = useRouter()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget)

        try {
            const res= await signIn("credentials",{
                email: formData.get("email"),
                password: formData.get("password"),
                redirect: false
            })
            console.log(res)
            if(res?.error) return setError(res.error)
            if(res?.ok) return router.push("/dashboard")
        } catch (error) {
            console.log(formData);
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <input
                    className="border border-sky-500"
                    type="email"
                    placeholder="email"
                    name="email"
                    required
                /><br />
                <input
                    className="border border-sky-500"
                    type="password"
                    placeholder="password"
                    name="password"
                    required
                /><br />
                <button type="submit" className="border border-sky-500">Login</button>
                <div id="alert"></div>
            </form>
        </div>
        
    );
}

export default LoginPage;
