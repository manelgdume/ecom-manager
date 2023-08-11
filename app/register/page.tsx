'use client'

import React, { FormEvent, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

function SignUpForm() {
    const [error, setError] = useState("");
    const router = useRouter()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget)

        try {
            const res= await axios.post("/api/auth/signup,", {
                name: formData.get("name"),
                email: formData.get("email"),
                password: formData.get("password"),

            })
 
        } catch (error) {
 
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <input
                    className="border border-sky-500"
                    type="text"
                    placeholder="name"
                    name="name"
                    required
                /><br />
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
                <button type="submit" className="border border-sky-500">Register</button>
                <div id="alert"></div>
            </form>
        </div>

    );
}

export default SignUpForm;
