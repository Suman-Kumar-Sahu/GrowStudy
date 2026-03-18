import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileCard from "../componets/ProfileCard";
import api from "../api/Axios";

export default function ProfileVisit() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/users/profile/${id}`);
        setUser(res.data);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 text-lg font-medium">Loading profile...</p>
      </div>
    );

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500 font-semibold text-6xl">User not found.</p>
      </div>
    );

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Gradient Cover Section */}
      <div className="w-full h-56 bg-gradient-to-r from-blue-600 to-blue-400 relative pt-15">
        {/* <h2 className="flex flex-col items-center justify-center text-center capitalize text-5xl">{user.name}</h2> */}

      {/* Profile Content */}
      <div className="max-w-6xl mx-auto mt-17 flex flex-col lg:flex-row gap-6 px-4">
        {/* Left Section */}
        <div className="lg:w-2/3 ">
          <ProfileCard
            avatar={user.avatar}
            name={user.name}
            about={user.about}
            role={user.role}
            skills={user.skills || []}
            education={user.education || []}
            experience={user.experience || []}
            publicView={true}
          />
        </div>

        {/* Right Section */}
        <div className="lg:w-1/3 bg-white rounded-2xl shadow-md p-6 space-y-6 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              Contact
            </h3>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Email:</span> {user.email || "N/A"}
            </p>
            <p className="text-gray-600 text-sm">
              <span className="font-medium">Phone:</span>{" "}
              {user.phone || "Not shared"}
            </p>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Actions</h3>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-xl transition-all mb-2">
              Connect
            </button>
            <button className="w-full border border-blue-600 text-blue-600 font-medium py-2 px-4 rounded-xl hover:bg-blue-50 transition-all">
              Message
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
