// Notification.js

const Notification = ({ title, message, thumbImage }) => (
  <div className="notification">
    {thumbImage && (
      <img src={thumbImage} alt="Thumbnail" className="thumbImage" />
    )}
    <div className="notification-content">
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  </div>
);

export default Notification;
