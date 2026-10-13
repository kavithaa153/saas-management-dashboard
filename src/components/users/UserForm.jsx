
import { useEffect, useState } from "react";
import { Building2, Mail, UserRound, ShieldCheck } from "lucide-react";
import Modal from "../common/Modal";
import { validateUser } from "../../utils/validators";
import "./UserForm.css";

const emptyForm = {
  name: "",
  email: "",
  role: "Member",
  status: "Active",
  company: ""
};

function UserForm({ open, user, onClose, onSubmit }) {
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "Member",
        status: user.status || "Active",
        company: user.company || ""
      });
    } else {
      setFormData({ ...emptyForm });
    }

    setErrors({});
  }, [user, open]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));

    setErrors((current) => ({
      ...current,
      [name]: ""
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateUser(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(formData);
    setFormData({ ...emptyForm });
    setErrors({});
  }

  return (
    <Modal
      open={open}
      title={user ? "Edit User" : "Add User"}
      description={
        user
          ? "Update user information and access status."
          : "Create a new user for your organization."
      }
      onClose={onClose}
      size="medium"
    >
      <form className="user-form" onSubmit={handleSubmit}>
        <div className="user-form-grid">
          <div className="user-form-field">
            <label htmlFor="user-name">
              Full name <span>*</span>
            </label>
            <div className="user-input-wrap">
              <UserRound size={17} />
              <input
                id="user-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
                autoComplete="name"
              />
            </div>
            {errors.name && (
              <small className="user-form-error">{errors.name}</small>
            )}
          </div>

          <div className="user-form-field">
            <label htmlFor="user-email">
              Email address <span>*</span>
            </label>
            <div className="user-input-wrap">
              <Mail size={17} />
              <input
                id="user-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@company.com"
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <small className="user-form-error">{errors.email}</small>
            )}
          </div>

          <div className="user-form-field">
            <label htmlFor="user-company">
              Company <span>*</span>
            </label>
            <div className="user-input-wrap">
              <Building2 size={17} />
              <input
                id="user-company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Company name"
                autoComplete="organization"
              />
            </div>
            {errors.company && (
              <small className="user-form-error">{errors.company}</small>
            )}
          </div>

          <div className="user-form-field">
            <label htmlFor="user-role">
              Role <span>*</span>
            </label>
            <div className="user-input-wrap">
              <ShieldCheck size={17} />
              <select
                id="user-role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Member">Member</option>
              </select>
            </div>
            {errors.role && (
              <small className="user-form-error">{errors.role}</small>
            )}
          </div>

          <div className="user-form-field">
            <label htmlFor="user-status">
              Account status <span>*</span>
            </label>
            <div className="user-input-wrap">
              <span className={`user-status-dot ${formData.status.toLowerCase()}`} />
              <select
                id="user-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            {errors.status && (
              <small className="user-form-error">{errors.status}</small>
            )}
          </div>
        </div>

        <div className="user-form-actions">
          <button
            type="button"
            className="user-cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="user-submit-button">
            {user ? "Save Changes" : "Create User"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default UserForm;
