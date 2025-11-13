"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormControl, Button } from "react-bootstrap";
import * as client from "../client";

interface Credentials {
  username?: string;
  password?: string;
}

export default function Signin() {
  const [credentials, setCredentials] = useState<Credentials>({});
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  
  const signin = async () => {
    try {
      const user = await client.signin(credentials);
      if (!user) return;
      dispatch(setCurrentUser(user));
      router.push("/Dashboard");
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { data?: { message?: string } } };
        setError(error.response?.data?.message || "An error occurred");
      } else {
        setError("An error occurred");
      }
    }
  };

  return (
    <div id="wd-signin-screen">
      <h1>Sign in</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <FormControl 
        value={credentials.username || ''}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        className="mb-2" 
        placeholder="username" 
        id="wd-username" 
      />
      <FormControl 
        value={credentials.password || ''}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        className="mb-2" 
        placeholder="password" 
        type="password" 
        id="wd-password" 
      />
      <Button onClick={signin} id="wd-signin-btn" className="w-100 mb-2">
        Sign in
      </Button>
      <Link id="wd-signup-link" href="/Account/Signup">Sign up</Link>
    </div>
  );
}
