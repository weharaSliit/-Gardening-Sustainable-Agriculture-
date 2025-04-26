import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../MainComponents/Nav";
import HarvestTimeline from "./HarvestTimeline"; // Import the timeline component
import { jwtDecode } from "jwt-decode";

const GardenCalendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [notifications, setNotifications] = useState([]); // State for notifications
  const [showNotifications, setShowNotifications] = useState(false); // State to toggle notification section
  const [newEntry, setNewEntry] = useState({
    vegetable: "",
    sowDate: "",
    plantDate: "",
    startDate: "",
    endDate: "",
    quantity: "",
    quantityScale: "kg", // Default to "kg"
    description: "",
  });
  const [editingEntry, setEditingEntry] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [profile, setProfile] = useState(null); // State for profile data
  const [profilePicture, setProfilePicture] = useState(null); // State for profile picture
  const [userId, setUserId] = useState("");
  const [error, setError] = useState("");

  const markAsRead = (id) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `http://localhost:8080/api/v1/profile/upload-picture/${userId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfilePicture(response.data.profilePictureUrl);
      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      setError("Failed to upload profile picture.");
    }
  };

  useEffect(() => {
    const fetchProfileAndCalendar = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("You must be logged in to access this page.");
        return;
      }

      const decoded = jwtDecode(token);
      const userIdFromToken = decoded.userId;
      setUserId(userIdFromToken);

      try {
        // Fetch profile data
        const profileResponse = await axios.get(
          `http://localhost:8080/api/v1/profile/${userIdFromToken}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setProfile(profileResponse.data);

        // Fetch calendar data
        fetchCalendarData(token, userIdFromToken);

        fetchNotifications(token);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to fetch data");
      }
    };

    fetchProfileAndCalendar();
  }, []);

  const fetchCalendarData = async (token, userId) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/garden-calendar",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCalendarData(response.data);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  };

  const getDateClass = (startDate, endDate) => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (currentDate > end) {
      return "bg-red-100 text-red-800"; // Overdue
    } else if (currentDate < start) {
      return "bg-yellow-100 text-yellow-800"; // Upcoming
    } else {
      return "bg-green-100 text-green-800"; // Current
    }
  };

  const fetchNotifications = async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/v1/garden-calendar",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const currentDate = new Date();
      const nextDay = new Date(currentDate);
      nextDay.setDate(currentDate.getDate() + 1);

      const nextDayNotifications = response.data.filter((entry) => {
        const harvestStartDate = new Date(entry.startDate);
        return (
          harvestStartDate.getFullYear() === nextDay.getFullYear() &&
          harvestStartDate.getMonth() === nextDay.getMonth() &&
          harvestStartDate.getDate() === nextDay.getDate()
        );
      });

      const formattedNotifications = nextDayNotifications.map((entry) => ({
        id: entry.id,
        message: `Reminder: Harvest ${
          entry.vegetable
        } starts tomorrow (${new Date(entry.startDate).toLocaleDateString()})`,
      }));

      setNotifications(formattedNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const onNotificationClick = () => {
    setShowNotifications(!showNotifications); // Toggle notification section
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEntry({ ...newEntry, [name]: value });
  };

  const handleAddEntry = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to perform this action.");
      return;
    }

    const decoded = jwtDecode(token);
    const userId = decoded.userId;

    try {
      const entryWithUserId = { ...newEntry, userId }; // Include userId in the entry
      if (editingEntry) {
        await axios.put(
          `http://localhost:8080/api/v1/garden-calendar/${editingEntry.id}`,
          entryWithUserId,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setEditingEntry(null);
      } else {
        await axios.post(
          "http://localhost:8080/api/v1/garden-calendar",
          entryWithUserId,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      }
      fetchCalendarData(token, userId); // Fetch updated calendar data
      setNewEntry({
        vegetable: "",
        sowDate: "",
        plantDate: "",
        startDate: "",
        endDate: "",
        quantity: "",
        quantityScale: "kg",
        description: "",
      });
      setIsModalOpen(false); // Close the modal after saving
    } catch (error) {
      console.error("Error saving entry:", error);
    }
  };

  const handleEditEntry = (entry) => {
    setEditingEntry(entry);
    setNewEntry({
      vegetable: entry.vegetable,
      sowDate: entry.sowDate
        ? new Date(entry.sowDate).toISOString().split("T")[0]
        : "",
      plantDate: entry.plantDate
        ? new Date(entry.plantDate).toISOString().split("T")[0]
        : "",
      startDate: entry.startDate
        ? new Date(entry.startDate).toISOString().split("T")[0]
        : "",
      endDate: entry.endDate
        ? new Date(entry.endDate).toISOString().split("T")[0]
        : "",
      quantity: entry.quantity,
      quantityScale: entry.quantityScale || "kg",
      description: entry.description || "",
    });
    setIsModalOpen(true);
  };

  const handleDeleteEntry = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to perform this action.");
      return;
    }

    try {
      await axios.delete(`http://localhost:8080/api/v1/garden-calendar/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCalendarData(token, userId); // Fetch updated calendar data
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  return (
    <div className="relative">
      {/* Navigation Bar as an Overlay */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Nav
          notifications={notifications}
          onNotificationClick={onNotificationClick} // Pass the function as a prop
        />
      </div>

      {/* Main Content */}
      <div className="pt-20 p-6 bg-green-50 min-h-screen">
        {/* Notifications Section */}
        {showNotifications && notifications.length > 0 && (
          <div className="mb-6 bg-white border border-gray-300 shadow-lg rounded-lg p-4">
            <h2 className="font-bold text-lg text-gray-800 mb-4">
              Notifications
            </h2>
            <ul className="space-y-2">
              {notifications.map((notification) => (
                <li
                  key={notification.id}
                  className="flex justify-between items-center bg-yellow-50 p-3 rounded-lg shadow-sm"
                >
                  <span className="text-gray-700">{notification.message}</span>
                  <button
                    onClick={() => markAsRead(notification.id)} // Mark as read
                    className="text-blue-600 hover:underline ml-4"
                  >
                    Mark as Read
                  </button>
                </li>
              ))}
            </ul>
            <div className="text-center mt-4">
              <button
                onClick={() => setShowNotifications(false)} // Hide notification section
                className="text-green-600 font-semibold hover:underline"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Profile Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-green-800 mb-4">Profile</h1>
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}
          {profile ? (
            <div className="flex flex-col sm:flex-row items-center">
              {/* Profile Picture and Name */}
              <div className="flex flex-col items-center sm:items-start sm:w-1/3">
                <div className="w-32 h-32 rounded-full bg-gray-300 mb-4 overflow-hidden shadow-md">
                  <img
                    src={profilePicture || "/profile-placeholder.png"} // Display the uploaded image or a placeholder
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-green-800">
                  {profile.name}
                </h2>
                <p className="text-gray-600 text-sm">
                  {profile.role || "User Role"}
                </p>
                {/* File Input for Profile Picture */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="mt-4"
                />
              </div>

              {/* Profile Details */}
              <div className="sm:w-2/3 mt-6 sm:mt-0 sm:ml-10">
                <h3 className="text-lg font-semibold text-green-800 mb-4">
                  User Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700">
                      <strong>User ID:</strong> {profile.id}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      <strong>Email:</strong> {profile.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600">Loading profile...</p>
          )}
        </div>

        {/* Garden Calendar Section */}
        <h1 className="text-2xl font-bold text-green-800 mb-4">
          Garden Calendar
        </h1>
        <button
          onClick={() => {
            setEditingEntry(null);
            setNewEntry({
              vegetable: "",
              sowDate: "",
              plantDate: "",
              startDate: "",
              endDate: "",
              quantity: "",
              quantityScale: "kg",
              description: "",
            });
            setIsModalOpen(true); // Open the modal for adding a new entry
          }}
          className="mb-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add New Record
        </button>
        <table className="min-w-full bg-white border border-green-200 rounded-lg">
          <thead>
            <tr className="bg-green-100 text-green-800">
              <th className="p-4">Item</th>
              <th className="p-4">Sow Date</th>
              <th className="p-4">Plant Date</th>
              <th className="p-4">Harvest Date</th>
              <th className="p-4">Quantity</th>
              <th className="p-4">Description</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {calendarData.map((entry) => (
              <tr key={entry.id} className="border-b">
                <td className="p-4">{entry.vegetable}</td>
                <td className="p-4">
                  {new Date(entry.sowDate).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {new Date(entry.plantDate).toLocaleDateString()}
                </td>
                <td
                  className={`p-4 ${getDateClass(
                    entry.startDate,
                    entry.endDate
                  )}`}
                >
                  {new Date(entry.startDate).toLocaleDateString()} -{" "}
                  {new Date(entry.endDate).toLocaleDateString()}
                </td>
                <td className="p-4">
                  {entry.quantity} {entry.quantityScale || "kg"}
                </td>
                <td className="p-4">{entry.description}</td>
                <td className="p-4">
                  <button
                    onClick={() => handleEditEntry(entry)}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Render the Harvest Timeline */}
        <HarvestTimeline calendarData={calendarData} />

        {/* Modal for Adding/Editing Entry */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/2">
              <h2 className="text-xl font-bold text-green-800 mb-4">
                {editingEntry ? "Edit Entry" : "Add New Entry"}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <label className="text-green-800">Item</label>
                <input
                  type="text"
                  name="vegetable"
                  placeholder="Vegetable"
                  value={newEntry.vegetable}
                  onChange={handleInputChange}
                  className="border border-green-300 p-2 rounded"
                />
                <label className="text-green-800">Sow Date</label>
                <input
                  type="date"
                  name="sowDate"
                  placeholder="Sow Date"
                  value={newEntry.sowDate}
                  onChange={handleInputChange}
                  className="border border-green-300 p-2 rounded"
                />
                <label className="text-green-800">Plant</label>
                <input
                  type="date"
                  name="plantDate"
                  placeholder="Plant Date"
                  value={newEntry.plantDate}
                  onChange={handleInputChange}
                  className="border border-green-300 p-2 rounded"
                />
                <label className="text-green-800">Harvest(Start Date)</label>
                <input
                  type="date"
                  name="startDate"
                  placeholder="Start Date"
                  value={newEntry.startDate}
                  onChange={handleInputChange}
                  className="border border-green-300 p-2 rounded"
                />
                <label className="text-green-800">Harvest(End Date)</label>
                <input
                  type="date"
                  name="endDate"
                  placeholder="End Date"
                  value={newEntry.endDate}
                  onChange={handleInputChange}
                  className="border border-green-300 p-2 rounded"
                />
                <label className="text-green-800">Quantity</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    name="quantity"
                    placeholder="Quantity"
                    value={newEntry.quantity}
                    onChange={handleInputChange}
                    className="border border-green-300 p-2 rounded"
                  />
                  <select
                    name="quantityScale"
                    value={newEntry.quantityScale || "kg"}
                    onChange={handleInputChange}
                    className="ml-2 border border-green-300 p-2 rounded"
                  >
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="liters">liters</option>
                    <option value="pounds">pounds</option>
                  </select>
                </div>
                <label className="text-green-800">Description</label>
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                  value={newEntry.description}
                  onChange={handleInputChange}
                  className="border border-green-300 p-2 rounded"
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddEntry}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  {editingEntry ? "Update Entry" : "Add Entry"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GardenCalendar;
