import React, { useState, useEffect } from "react";
import axios from "axios";
import Nav from "../MainComponents/Nav";
import HarvestTimeline from "./HarvestTimeline"; // Import the timeline component
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import GardenLogsAnalysis from "./GardenLogsAnalysis";
import { useNavigate } from "react-router-dom"; // Add this import\

const GardenCalendar = () => {
  const [calendarData, setCalendarData] = useState([]);
  const [notifications, setNotifications] = useState([]); // State for notifications
  const [toBeHarvested, setToBeHarvested] = useState([]); // State for to-be-harvested records
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
  const [categories, setCategories] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  const [motivationalMessage, setMotivationalMessage] = useState(""); // State for motivational message
  const targetQuantity = 100; // Fixed target value

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
        await fetchCalendarData(token, userIdFromToken);
        // Fetch notifications
        await fetchNotifications(token);
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

      // Filter to-be-harvested records
      const currentDate = new Date();
      const filteredData = response.data.filter(
        (entry) => new Date(entry.startDate) > currentDate
      );
      setToBeHarvested(filteredData);
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

      // Filter entries for notifications 24 hours before Harvest Start Date or End Date
      const nextDayNotifications = response.data.filter((entry) => {
        const harvestStartDate = new Date(entry.startDate);
        const harvestEndDate = new Date(entry.endDate);

        return (
          (harvestStartDate.getFullYear() === nextDay.getFullYear() &&
            harvestStartDate.getMonth() === nextDay.getMonth() &&
            harvestStartDate.getDate() === nextDay.getDate()) ||
          (harvestEndDate.getFullYear() === nextDay.getFullYear() &&
            harvestEndDate.getMonth() === nextDay.getMonth() &&
            harvestEndDate.getDate() === nextDay.getDate())
        );
      });

      // Format notifications for both Start Date and End Date
      const formattedNotifications = nextDayNotifications.map((entry) => {
        const notifications = [];
        const harvestStartDate = new Date(entry.startDate);
        const harvestEndDate = new Date(entry.endDate);

        if (
          harvestStartDate.getFullYear() === nextDay.getFullYear() &&
          harvestStartDate.getMonth() === nextDay.getMonth() &&
          harvestStartDate.getDate() === nextDay.getDate()
        ) {
          notifications.push({
            id: `${entry.id}-start`,
            message: `Reminder: Harvest ${
              entry.vegetable
            } starts tomorrow (${harvestStartDate.toLocaleDateString()})`,
          });
        }

        if (
          harvestEndDate.getFullYear() === nextDay.getFullYear() &&
          harvestEndDate.getMonth() === nextDay.getMonth() &&
          harvestEndDate.getDate() === nextDay.getDate()
        ) {
          notifications.push({
            id: `${entry.id}-end`,
            message: `Reminder: Harvest ${
              entry.vegetable
            } ends tomorrow (${harvestEndDate.toLocaleDateString()})`,
          });
        }

        return notifications;
      });

      // Flatten the array of notifications
      const allNotifications = formattedNotifications.flat();

      setNotifications(allNotifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const onNotificationClick = () => {
    setShowNotifications(!showNotifications); // Toggle notification section
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Prevent negative values for quantity
    if (name === "quantity" && value < 0) {
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        quantity: "Quantity cannot be negative.",
      }));
      return;
    }

    setNewEntry({ ...newEntry, [name]: value });

    // Clear quantity error if valid
    if (name === "quantity" && value >= 0) {
      setFormErrors((prevErrors) => {
        const { quantity, ...rest } = prevErrors;
        return rest;
      });
    }
  };

  const getHarvestingStatus = (startDate, endDate, quantity) => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    // If quantity is added, mark as "Done"
    if (quantity > 0) {
      return "Done";
    }

    // If both Harvest Start Date and End Date are overdue
    if (currentDate > end && currentDate > start) {
      return "Overdue";
    }

    // If Harvesting is ongoing
    if (currentDate >= start && currentDate <= end) {
      return "In Progress";
    }

    // If Harvesting has not started yet
    if (currentDate < start) {
      return "to be harvested";
    }

    return "Unknown"; // Default fallback status
  };

  const validateForm = () => {
    const errors = {};

    // Check required fields
    if (!newEntry.vegetable.trim()) errors.vegetable = "Item is required.";
    if (!newEntry.sowDate) errors.sowDate = "Sow Date is required.";
    if (!newEntry.plantDate) errors.plantDate = "Plant Date is required.";
    if (!newEntry.startDate)
      errors.startDate = "Harvest Start Date is required.";
    if (!newEntry.endDate) errors.endDate = "Harvest End Date is required.";

    // Validate date order
    const sowDate = new Date(newEntry.sowDate);
    const plantDate = new Date(newEntry.plantDate);
    const startDate = new Date(newEntry.startDate);
    const endDate = new Date(newEntry.endDate);
    const currentDate = new Date();

    if (plantDate < sowDate)
      errors.plantDate = "Plant Date must be after Sow Date.";
    if (startDate < plantDate)
      errors.startDate = "Harvest Start Date must be after Plant Date.";
    if (endDate < startDate)
      errors.endDate = "Harvest End Date must be after Harvest Start Date.";

    // Validate quantity
    if (newEntry.quantity && newEntry.quantity < 0) {
      errors.quantity = "Quantity cannot be negative.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddEntry = async () => {
    if (!validateForm()) return; // Stop submission if form is invalid

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

      // Fetch updated calendar data
      await fetchCalendarData(token, userId);

      // Calculate total quantity
      const totalQuantity = calendarData.reduce(
        (sum, entry) => sum + (entry.quantity || 0),
        0
      );

      // Check if the target is exceeded
      if (totalQuantity > targetQuantity) {
        setMotivationalMessage(
          `Congratulations! You've exceeded your target of ${targetQuantity} units! Keep up the great work! 🎉`
        );
      } else {
        setMotivationalMessage(""); // Clear the message if the target is not exceeded
      }

      // Reset the form
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
      setIsModalOpen(false);
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

  const [isOverlayOpen, setIsOverlayOpen] = useState(false); // State to toggle overlay

  const toggleOverlay = () => {
    setIsOverlayOpen(!isOverlayOpen);
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

        {/* Header with Graphic Image */}
        <div className="relative bg-green-50 min-h-screen p-6">
          <motion.div
            className="flex items-center justify-between bg-green-50 p-6 rounded-lg shadow-lg mb-8"
            initial={{ opacity: 0, y: 50 }} // Initial animation state
            animate={{ opacity: 1, y: 0 }} // Final animation state
            transition={{ duration: 0.8, ease: "easeOut" }} // Animation duration and easing
          >
            {/* Gardener Text */}
            <motion.div
              className="text-left"
              initial={{ opacity: 0, x: -50 }} // Text slides in from the left
              animate={{ opacity: 1, x: 0 }} // Final position
              transition={{ duration: 0.8, delay: 0.2 }} // Delay for staggered effect
            >
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Track Your Garden
              </h2>
              <p className="text-gray-600">
                Keep your garden thriving with our easy-to-use calendar!
              </p>
              <motion.button
                onClick={() => navigate("/contact")}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }} 
              >
                Contact Us for More Assistance
              </motion.button>
            </motion.div>

            {/* Gardener Icon */}
            <motion.div
              className="flex items-center justify-center w-24 h-24 bg-green-200 rounded-full shadow-lg"
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ duration: 0.8, delay: 0.4 }} 
            >
              <span className="text-green-800 text-4xl">🌱</span>{" "}
              {/* Gardener Icon */}
            </motion.div>
          </motion.div>

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

          <button
            onClick={toggleOverlay}
            className="ml-5 mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            View Graphs
          </button>

          {motivationalMessage && (
            <div className="mb-6 bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg shadow">
              <p className="font-bold">{motivationalMessage}</p>
            </div>
          )}

          <table className="min-w-full bg-white border border-green-200 rounded-lg mb-6">
            <thead>
              <tr className="bg-green-100 text-green-800">
                <th className="p-4">Item</th>
                <th className="p-4">Category</th>
                <th className="p-4">Harvest Start Date</th>
                <th className="p-4">Harvest End Date</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Description</th>
              </tr>
            </thead>
            <tbody>
              {toBeHarvested.map((entry) => (
                <tr key={entry.id} className="border-b">
                  <td className="p-4">{entry.vegetable}</td>
                  <td className="p-4">{entry.category}</td>
                  <td className="p-4">
                    {new Date(entry.startDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {new Date(entry.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {entry.quantity} {entry.quantityScale || "kg"}
                  </td>
                  <td className="p-4">{entry.description}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <table className="min-w-full bg-white border border-green-200 rounded-lg">
            <thead>
              <tr className="bg-green-100 text-green-800">
                <th className="p-4">Item</th>
                <th className="p-4">Catagory</th>
                <th className="p-4">Sow Date</th>
                <th className="p-4">Plant Date</th>
                <th className="p-4">Harvest Date</th>
                <th className="p-4">Quantity</th>
                <th className="p-4">Description</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {calendarData.map((entry) => (
                <tr key={entry.id} className="border-b">
                  <td className="p-4">{entry.vegetable}</td>
                  <td className="p-4">{entry.category}</td>
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
                    <span
                      className={`px-2 py-1 rounded ${
                        getHarvestingStatus(
                          entry.startDate,
                          entry.endDate,
                          entry.quantity
                        ) === "Done"
                          ? "bg-green-100 text-green-800"
                          : getHarvestingStatus(
                              entry.startDate,
                              entry.endDate,
                              entry.quantity
                            ) === "In Progress"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {getHarvestingStatus(
                        entry.startDate,
                        entry.endDate,
                        entry.quantity
                      )}
                    </span>
                  </td>
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
          {/* Overlay for Graphs */}
          {isOverlayOpen && (
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-7/8 h-7/8">
                <button
                  onClick={toggleOverlay}
                  className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                >
                  ✖
                </button>
                <GardenLogsAnalysis calendarData={calendarData} />
              </div>
            </div>
          )}

          {/* Modal for Adding/Editing Entry */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded shadow-lg w-1/2">
                <h2 className="text-xl font-bold text-green-800 mb-4">
                  {editingEntry ? "Edit Entry" : "Add New Entry"}
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <label className="text-green-800">Item</label>
                  <div>
                    <input
                      type="text"
                      name="vegetable"
                      placeholder="Vegetable"
                      value={newEntry.vegetable}
                      onChange={handleInputChange}
                      className="border border-green-300 p-2 rounded"
                    />
                    {formErrors.vegetable && (
                      <p className="text-red-600 text-sm">
                        {formErrors.vegetable}
                      </p>
                    )}
                  </div>

                  <label className="text-green-800">Category</label>
                  <select
                    name="category"
                    value={newEntry.category || ""}
                    onChange={handleInputChange}
                    className="border border-green-300 p-2 rounded"
                  >
                    <option value="" disabled>
                      Select Category
                    </option>
                    <option value="Vegetable">Vegetable</option>
                    <option value="Fruit">Fruit</option>
                    <option value="Grains">Grains</option>
                    <option value="Greens">Greens</option>
                  </select>

                  <label className="text-green-800">Sow Date</label>
                  <div>
                    <input
                      type="date"
                      name="sowDate"
                      placeholder="Sow Date"
                      value={newEntry.sowDate}
                      onChange={handleInputChange}
                      className="border border-green-300 p-2 rounded"
                    />
                    {formErrors.sowDate && (
                      <p className="text-red-600 text-sm">
                        {formErrors.sowDate}
                      </p>
                    )}
                  </div>

                  <label className="text-green-800">Plant</label>
                  <div>
                    <input
                      type="date"
                      name="plantDate"
                      placeholder="Plant Date"
                      value={newEntry.plantDate}
                      onChange={handleInputChange}
                      className="border border-green-300 p-2 rounded"
                    />
                    {formErrors.plantDate && (
                      <p className="text-red-600 text-sm">
                        {formErrors.plantDate}
                      </p>
                    )}
                  </div>

                  <label className="text-green-800">Harvest(Start Date)</label>
                  <div>
                    <input
                      type="date"
                      name="startDate"
                      placeholder="Start Date"
                      value={newEntry.startDate}
                      onChange={handleInputChange}
                      className="border border-green-300 p-2 rounded"
                    />
                    {formErrors.startDate && (
                      <p className="text-red-600 text-sm">
                        {formErrors.startDate}
                      </p>
                    )}
                  </div>

                  <label className="text-green-800">Harvest(End Date)</label>
                  <div>
                    <input
                      type="date"
                      name="endDate"
                      placeholder="End Date"
                      value={newEntry.endDate}
                      onChange={handleInputChange}
                      className="border border-green-300 p-2 rounded"
                    />
                    {formErrors.endDate && (
                      <p className="text-red-600 text-sm">
                        {formErrors.endDate}
                      </p>
                    )}
                  </div>

                  <label className="text-green-800">Quantity</label>
                  <div>
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
                    {formErrors.quantity && (
                      <p className="text-red-600 text-sm">
                        {formErrors.quantity}
                      </p>
                    )}
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
    </div>
  );
};

export default GardenCalendar;
