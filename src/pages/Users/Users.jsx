import { useMemo, useState } from "react";
import {
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users as UsersIcon
} from "lucide-react";

import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { useNotifications } from "../../context/NotificationContext";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import UserForm from "../../components/users/UserForm";
import "./Users.css";
const PAGE_SIZE = 6;

function Users() {
  const { state, dispatch } = useApp();
  const { success, error } = useToast();
  const { success: notifySuccess, error: notifyError } =
    useNotifications();

  const users = state.users || [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);

  const [formOpen, setFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [viewUser, setViewUser] = useState(null);
  const [deleteUser, setDeleteUser] = useState(null);

  const filteredUsers = useMemo(() => {
    const normalizedSearch = search
      .trim()
      .toLowerCase();

    const result = users.filter((user) => {
      const matchesSearch =
        !normalizedSearch ||
        user.name
          .toLowerCase()
          .includes(normalizedSearch) ||
        user.email
          .toLowerCase()
          .includes(normalizedSearch) ||
        user.company
          .toLowerCase()
          .includes(normalizedSearch) ||
        user.id
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "All" ||
        user.status === statusFilter;

      const matchesRole =
        roleFilter === "All" ||
        user.role === roleFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRole
      );
    });

    return result.sort((a, b) => {
      if (sortBy === "newest") {
        return (
          new Date(b.joinedAt) -
          new Date(a.joinedAt)
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.joinedAt) -
          new Date(b.joinedAt)
        );
      }

      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      return 0;
    });
  }, [
    users,
    search,
    statusFilter,
    roleFilter,
    sortBy
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredUsers.length / PAGE_SIZE
    )
  );

  const safeCurrentPage = Math.min(
    currentPage,
    totalPages
  );

  const paginatedUsers = filteredUsers.slice(
    (safeCurrentPage - 1) * PAGE_SIZE,
    safeCurrentPage * PAGE_SIZE
  );

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const inactiveUsers = users.filter(
    (user) => user.status === "Inactive"
  ).length;

  const pendingUsers = users.filter(
    (user) => user.status === "Pending"
  ).length;

  function handleSearch(value) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleStatusChange(value) {
    setStatusFilter(value);
    setCurrentPage(1);
  }

  function handleRoleChange(value) {
    setRoleFilter(value);
    setCurrentPage(1);
  }

  function handleAddUser() {
    setSelectedUser(null);
    setFormOpen(true);
  }

  function handleEditUser(user) {
    setSelectedUser(user);
    setFormOpen(true);
  }

  function handleFormSubmit(formData) {
    if (selectedUser) {
      const updatedUser = {
        ...selectedUser,
        ...formData
      };

      const updatedUsers = users.map((user) =>
        user.id === selectedUser.id
          ? updatedUser
          : user
      );

      dispatch({
        type: "SET_USERS",
        payload: updatedUsers
      });

      success(
        "User updated",
        `${updatedUser.name} has been updated successfully.`
      );

      notifySuccess(
        "User updated",
        `${updatedUser.name} was updated.`,
        {
          type: "user",
          id: updatedUser.id
        }
      );
    } else {
      const newUser = {
        id: `USR-${Date.now()}`,
        ...formData,
        joinedAt: new Date().toISOString()
      };

      dispatch({
        type: "SET_USERS",
        payload: [newUser, ...users]
      });

      success(
        "User created",
        `${newUser.name} has been added successfully.`
      );

      notifySuccess(
        "New user created",
        `${newUser.name} was added.`,
        {
          type: "user",
          id: newUser.id
        }
      );
    }

    setFormOpen(false);
    setSelectedUser(null);
  }

  function handleDeleteUser() {
    if (!deleteUser) {
      return;
    }

    const updatedUsers = users.filter(
      (user) => user.id !== deleteUser.id
    );

    dispatch({
      type: "SET_USERS",
      payload: updatedUsers
    });

    success(
      "User deleted",
      `${deleteUser.name} has been removed.`
    );

    notifySuccess(
      "User deleted",
      `${deleteUser.name} was removed.`,
      {
        type: "user",
        id: deleteUser.id
      }
    );

    setDeleteUser(null);

    if (
      paginatedUsers.length === 1 &&
      safeCurrentPage > 1
    ) {
      setCurrentPage((page) => page - 1);
    }
  }

  function formatDate(date) {
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date(date));
  }

  function getInitials(name) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  function getStatusClass(status) {
    return status.toLowerCase();
  }

  return (
    <section className="plans-page users-page">
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">
            User Management
          </span>

          <h1>Users</h1>

          <p>
            Manage users, roles, companies and account
            status from one place.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={handleAddUser}
        >
          <Plus size={17} />
          Add User
        </button>
      </div>

      <div className="plans-stat-grid">
        <div className="plans-stat-card">
          <div className="plans-stat-icon">
            <UsersIcon size={20} />
          </div>

          <div>
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>
        </div>

        <div className="plans-stat-card">
          <div className="plans-stat-icon">
            <UsersIcon size={20} />
          </div>

          <div>
            <span>Active Users</span>
            <strong>{activeUsers}</strong>
          </div>
        </div>

        <div className="plans-stat-card">
          <div className="plans-stat-icon">
            <UsersIcon size={20} />
          </div>

          <div>
            <span>Pending Users</span>
            <strong>{pendingUsers}</strong>
          </div>
        </div>

        <div className="plans-stat-card">
          <div className="plans-stat-icon">
            <UsersIcon size={20} />
          </div>

          <div>
            <span>Inactive Users</span>
            <strong>{inactiveUsers}</strong>
          </div>
        </div>
      </div>

      <div className="plans-card">
        <div className="plans-toolbar">
          <div className="search-field">
            <Search size={17} />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                handleSearch(event.target.value)
              }
              placeholder="Search users..."
            />
          </div>

          <div className="filter-group">
            <select
              value={statusFilter}
              onChange={(event) =>
                handleStatusChange(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Status
              </option>
              <option value="Active">
                Active
              </option>
              <option value="Inactive">
                Inactive
              </option>
              <option value="Pending">
                Pending
              </option>
            </select>

            <select
              value={roleFilter}
              onChange={(event) =>
                handleRoleChange(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Roles
              </option>
              <option value="Admin">
                Admin
              </option>
              <option value="Manager">
                Manager
              </option>
              <option value="Member">
                Member
              </option>
            </select>

            <select
              value={sortBy}
              onChange={(event) => {
                setSortBy(event.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="newest">
                Newest
              </option>
              <option value="oldest">
                Oldest
              </option>
              <option value="name">
                Name A-Z
              </option>
            </select>
          </div>
        </div>

        {paginatedUsers.length === 0 ? (
          <div className="plans-empty">
            <UsersIcon size={34} />

            <h3>No users found</h3>

            <p>
              Try changing your search or filter
              options.
            </p>
          </div>
        ) : (
          <>
            <div className="plans-table-wrapper">
              <table className="plans-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedUsers.map((user) => (
                    <tr key={user.id}>
                      <td>
                        <div className="plan-cell">
                          <div className="plan-avatar">
                            {getInitials(user.name)}
                          </div>

                          <div>
                            <strong>
                              {user.name}
                            </strong>

                            <span>
                              {user.email}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="role-text">
                          {user.role}
                        </span>
                      </td>

                      <td>{user.company}</td>

                      <td>
                        <span
                          className={`status-badge ${getStatusClass(
                            user.status
                          )}`}
                        >
                          {user.status}
                        </span>
                      </td>

                      <td>
                        {formatDate(user.joinedAt)}
                      </td>

                      <td>
                        <div className="user-action-menu">
                          <button
                            onClick={() =>
                              setViewUser(user)
                            }
                            title="View user"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={() =>
                              handleEditUser(user)
                            }
                            title="Edit user"
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            className="delete-action"
                            onClick={() =>
                              setDeleteUser(user)
                            }
                            title="Delete user"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mobile-user-list">
              {paginatedUsers.map((user) => (
                <div
                  className="mobile-user-card"
                  key={user.id}
                >
                  <div className="mobile-user-header">
                    <div className="plan-cell">
                      <div className="plan-avatar">
                        {getInitials(user.name)}
                      </div>

                      <div>
                        <strong>
                          {user.name}
                        </strong>

                        <span>
                          {user.email}
                        </span>
                      </div>
                    </div>

                    <span
                      className={`status-badge ${getStatusClass(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </div>

                  <div className="mobile-user-details">
                    <div>
                      <span>Role</span>
                      <strong>{user.role}</strong>
                    </div>

                    <div>
                      <span>Company</span>
                      <strong>
                        {user.company}
                      </strong>
                    </div>

                    <div>
                      <span>Joined</span>
                      <strong>
                        {formatDate(user.joinedAt)}
                      </strong>
                    </div>
                  </div>

                  <div className="mobile-user-actions">
                    <button
                      onClick={() =>
                        setViewUser(user)
                      }
                    >
                      <Eye size={15} />
                      View
                    </button>

                    <button
                      onClick={() =>
                        handleEditUser(user)
                      }
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      className="delete-action"
                      onClick={() =>
                        setDeleteUser(user)
                      }
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pagination">
              <span>
                Showing{" "}
                {Math.min(
                  (safeCurrentPage - 1) *
                    PAGE_SIZE +
                    1,
                  filteredUsers.length
                )}{" "}
                to{" "}
                {Math.min(
                  safeCurrentPage * PAGE_SIZE,
                  filteredUsers.length
                )}{" "}
                of {filteredUsers.length}
              </span>

              <div className="pagination-buttons">
                <button
                  disabled={safeCurrentPage === 1}
                  onClick={() =>
                    setCurrentPage(
                      (page) => page - 1
                    )
                  }
                >
                  Previous
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    className={
                      page === safeCurrentPage
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setCurrentPage(page)
                    }
                  >
                    {page}
                  </button>
                ))}

                <button
                  disabled={
                    safeCurrentPage === totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (page) => page + 1
                    )
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      <UserForm
        open={formOpen}
        user={selectedUser}
        onClose={() => {
          setFormOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <Modal
        open={Boolean(viewUser)}
        title="User Details"
        description="View complete user information."
        onClose={() => setViewUser(null)}
        size="small"
      >
        {viewUser && (
          <div className="user-details-modal">
            <div className="user-detail-profile">
              <div className="large-user-avatar">
                {getInitials(viewUser.name)}
              </div>

              <div>
                <h3>{viewUser.name}</h3>
                <p>{viewUser.email}</p>
              </div>
            </div>

            <div className="user-detail-grid">
              <div>
                <span>User ID</span>
                <strong>{viewUser.id}</strong>
              </div>

              <div>
                <span>Role</span>
                <strong>{viewUser.role}</strong>
              </div>

              <div>
                <span>Company</span>
                <strong>
                  {viewUser.company}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>{viewUser.status}</strong>
              </div>

              <div>
                <span>Joined</span>
                <strong>
                  {formatDate(viewUser.joinedAt)}
                </strong>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteUser)}
        title="Delete User"
        message={
          deleteUser
            ? `Are you sure you want to delete ${deleteUser.name}? This action cannot be undone.`
            : ""
        }
        confirmText="Delete User"
        cancelText="Cancel"
        danger
        onConfirm={handleDeleteUser}
        onCancel={() => setDeleteUser(null)}
      />
    </section>
  );
}

export default Users;