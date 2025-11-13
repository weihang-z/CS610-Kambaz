import * as client from "./client";
import { useEffect, useState, useCallback } from "react";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";

export default function Session({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState(true);
  const dispatch = useDispatch();
  
  const fetchProfile = useCallback(async () => {
    try {
      const currentUser = await client.profile();
      dispatch(setCurrentUser(currentUser));
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const error = err as { response?: { status?: number } };
        if (error.response?.status !== 401) {
          console.error(err);
        }
      }
    }
    setPending(false);
  }, [dispatch]);
  
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);
  
  if (!pending) {
    return children;
  }
}

