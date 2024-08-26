import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import Notification from "./Notification";
import axios from "axios";

const NotificationsList = () => {
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const userToken = localStorage.getItem("userToken1");
  const socket = useRef(null);

  useEffect(() => {
    if (!socket.current) {
      socket.current = io("http://142.93.208.153:4008");
    }

    socket.current.on("connected", () =>
      console.log("Socket connected successfully.")
    );

    socket.current.on("notification", (notification) => {
      setNotifications((prevNotifications) => [
        notification,
        ...prevNotifications,
      ]);
      setNotificationCount((prevCount) => prevCount + 1); // Increment count for new notification
    });

    socket.current.on("notificationCount", (count) => {
      setNotificationCount(count);
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  useEffect(() => {
    if (Object.keys(user).length !== 0) {
      socket.current.emit("setup", user);
    }
  }, [user]);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://142.93.208.153:4008/api/user/getProfile",
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setUser(response.data.data.user);
        console.log(response.data.data.user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [userToken]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://142.93.208.153:4008/api/user/notification",
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setNotifications(response.data.data.notifications);

        // Calculate unread notification count
        const unreadCount = response.data.data.notifications.filter(
          (notification) => !notification.readBy.includes(user._id)
        ).length;
        setNotificationCount(unreadCount);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [userToken, user._id]);

  const handleReadNotification = async (notificationId) => {
    try {
      await axios.patch(
        `http://142.93.208.153:4008/api/user/notification/read/${notificationId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === notificationId
            ? { ...notification, readBy: [...notification.readBy, user._id] }
            : notification
        )
      );
      setNotificationCount((prevCount) => prevCount - 1); // Decrement count when a notification is read
    } catch (error) {
      console.error("Error reading notification:", error);
    }
  };

  if (loading) return <div>Loading....</div>;

  return (
    <div className="notifications-list">
      <h2>Notifications</h2>
      <p>Unread Notifications: {notificationCount}</p>
      {notifications.length === 0 ? (
        <p>No notifications</p>
      ) : (
        notifications.map((notification, index) => (
          <Notification
            key={index}
            {...notification}
            onRead={() => handleReadNotification(notification._id)}
          />
        ))
      )}
    </div>
  );
};

export default NotificationsList;