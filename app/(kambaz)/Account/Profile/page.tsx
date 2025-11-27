"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser, User } from "../reducer";
import { Button, FormControl } from "react-bootstrap";
import { RootState } from "../../store";
import * as client from "../client";
export default function Profile() {
 const [profile, setProfile] = useState<User | null>(null);
 const dispatch = useDispatch();
 const router = useRouter();
 const { currentUser } = useSelector((state: RootState) => state.accountReducer);
 const fetchProfile = useCallback(() => {
   if (!currentUser) {
     router.push("/Account/Signin");
     return;
   }
   setProfile(currentUser);
 }, [currentUser, router]);
 const updateProfile = async () => {
   const updatedProfile = await client.updateUser(profile!);
   dispatch(setCurrentUser(updatedProfile));
 };
 const signout = async () => {
   await client.signout();
   dispatch(setCurrentUser(null));
   router.push("/Account/Signin");
 };
 useEffect(() => {
   fetchProfile();
 }, [fetchProfile]);
 return (
   <div className="wd-profile-screen">
     <h3>Profile</h3>
     {profile && (
       <div>
         <FormControl id="wd-username" className="mb-2"
           value={profile.username || ''}
           onChange={(e) => setProfile({ ...profile, username: e.target.value }) }
         />
        <FormControl id="wd-password" className="mb-2" type="text"
          value={profile.password || ''}
          onChange={(e) => setProfile({ ...profile, password: e.target.value }) }
        />
         <FormControl id="wd-firstname" className="mb-2"
           value={profile.firstName || ''}
           onChange={(e) => setProfile({ ...profile, firstName: e.target.value }) }
         />
         <FormControl id="wd-lastname" className="mb-2"
           value={profile.lastName || ''}
           onChange={(e) => setProfile({ ...profile, lastName: e.target.value }) } />
         <FormControl id="wd-dob" className="mb-2" type="date"
           value={profile.dob || ''}
           onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
         <FormControl id="wd-email" className="mb-2"
           value={profile.email || ''}
           onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
        <select className="form-control mb-2" id="wd-role" 
          value={profile.role || 'USER'}
          onChange={(e) => setProfile({ ...profile, role: e.target.value })} >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="FACULTY">Faculty</option>{" "}
          <option value="STUDENT">Student</option>
        </select>
        <Button onClick={updateProfile} className="btn btn-primary w-100 mb-2" id="wd-update-btn">
          Update
        </Button>
        <Button onClick={signout} className="wd-signout-btn btn btn-danger w-100" id="wd-signout-btn">
          Sign out
        </Button>
       </div>
     )}
   </div>
);}
