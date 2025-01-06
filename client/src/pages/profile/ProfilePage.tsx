import { useState } from "react";
import { GetProfileOkResponse, User } from "../../types/customType";

export default function ProfilePage() {
  const [userProfile, setUserProfile] = useState<User | null>(null);

  const handleGetProfile = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("you need login first");
    }
    if (token) {
      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`);

      const requestOptions = {
        method: "GET",
        headers: myHeaders,
      };

      try {
        const response = await fetch(
          "http://localhost:5000/api/user/profile",
          requestOptions
        );
        if (!response.ok) {
          console.log("login again ... redirect user to user page ");
        }
        if (response.ok) {
          const result = (await response.json()) as GetProfileOkResponse;
          setUserProfile(result.userProfile);
        }
      } catch (error) {}
    }
  };

  return (
    <div>
      <h1>ProfilePage</h1>
      <button onClick={handleGetProfile}>Get Profile</button>
      <hr />
      <div>
        {userProfile && (
          <div>
            Name : {userProfile.userName}
            Email : {userProfile.email}
            <div>
              <img src={userProfile.userImage} alt="avatar" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
