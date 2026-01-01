/*import styles from "./profile.module.css";
import { FiSettings, FiHelpCircle, FiCalendar, FiClock } from "react-icons/fi";
import BottomNavbar from "../../components/BottomNavbar";

const Profile = (props) => {
  const { user, logout } = props;

  return (
    <>
      <BottomNavbar />
      <div className={styles.main}>
        <h1>Profile</h1>
        <div className={styles.upper}>
          <div className={styles.addImage}>
            <img src={user.profilePic} alt="" />
          </div>
          <div className={styles.title}>
            <h2>Hello {user.name}!</h2>
            <p className={styles.edit}>Edit</p>
          </div>
        </div>

        <div className={styles.lower}>
          <div className={styles.tabs}>
            <FiClock className={styles.icon} />
            <p>Donation History</p>
          </div>

          <div className={styles.tabs}>
            <FiCalendar className={styles.icon} />
            <p>Schedule Donation</p>
          </div>

          <div className={styles.tabs}>
            <FiHelpCircle className={styles.icon} />
            <p>Help and FAQs</p>
          </div>

          <div className={styles.tabs}>
            <FiSettings className={styles.icon} />
            <p>Settings</p>
          </div>
        </div>

        <div>
          <button onClick={logout} className={styles.signup_btn}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
*/


import { useEffect, useState } from "react";
import styles from "./profile.module.css";
import { FiSettings, FiHelpCircle, FiCalendar, FiClock, FiEdit2, FiSave } from "react-icons/fi";
import BottomNavbar from "../../components/BottomNavbar";
import axios from "axios";

const Profile = (props) => {
  const [user, setUser] = useState(props.user || null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: "", profilePic: "" });

  const logout = props.logout || (() => {
    window.location.href = "/logout";
  });

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        try {
          const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/test`, {
            withCredentials: true,
          });
          setUser(res.data.user);
          setFormData({ name: res.data.user.name, profilePic: res.data.user.profilePic });
        } catch (err) {
          console.log("Error fetching user:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setFormData({ name: user.name, profilePic: user.profilePic });
        setLoading(false);
      }
    };

    fetchUser();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_BACKEND_URL}/user/${user._id}`,
        formData,
        { withCredentials: true }
      );
      setUser(res.data.user); // update local state
      setEditMode(false);
    } catch (err) {
      console.log("Error updating user:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not logged in</p>;

  return (
    <>
      <BottomNavbar />
      <div className={styles.main}>
        <h1>Profile</h1>
        <div className={styles.upper}>
          <div className={styles.addImage}>
            {editMode ? (
              <input
                type="text"
                name="profilePic"
                value={formData.profilePic}
                onChange={handleChange}
                placeholder="Profile Image URL"
              />
            ) : (
              <img src={user.profilePic || "https://via.placeholder.com/150"} alt="Profile" />
            )}
          </div>
          <div className={styles.title}>
            {editMode ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={styles.editInput}
              />
            ) : (
              <h2>Hello {user.name || "User"}!</h2>
            )}
            <p className={styles.edit} onClick={() => (editMode ? handleSave() : setEditMode(true))}>
              {editMode ? <FiSave /> : <FiEdit2 />} {editMode ? "Save" : "Edit"}
            </p>
          </div>
        </div>

        <div className={styles.lower}>
          <div className={styles.tabs}>
            <FiClock className={styles.icon} />
            <p>Donation History</p>
          </div>

          <div className={styles.tabs}>
            <FiCalendar className={styles.icon} />
            <p>Schedule Donation</p>
          </div>

          <div className={styles.tabs}>
            <FiHelpCircle className={styles.icon} />
            <p>Help and FAQs</p>
          </div>

          <div className={styles.tabs}>
            <FiSettings className={styles.icon} />
            <p>Settings</p>
          </div>
        </div>

        <div>
          <button onClick={logout} className={styles.signup_btn}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Profile;
