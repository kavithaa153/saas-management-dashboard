import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  Eye,
  Users as UsersIcon
} from "lucide-react";

import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { useNotifications } from "../../context/NotificationContext";

import UserForm from "../../components/users/UserForm";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Modal from "../../components/common/Modal";

const PAGE_SIZE = 6;

function Users() {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const notification = useNotifications();

  const users = state.users || [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [roleFilter, setRoleFilter] =
    useState("All");
  const [sortBy, setSortBy] =
    useState("newest");

  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingUser, setEditingUser] =
    useState(null);

  const [deleteUser, setDeleteUser] =
    useState(null);

  const [viewUser, setViewUser] =
    useState(null);

  const [openMenu, setOpenMenu] =
    useState(null);

  const filteredUsers = useMemo(() => {
    let result = [...users];

    const searchValue =
      search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((user) =>
        [
          user.name,
          user.email,
          user.company,
          user.role,
          user.status
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchValue)
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (user) =>
          user.status === statusFilter
      );
    }

    if (roleFilter !== "All") {
      result = result.filter(
        (user) => user.role === roleFilter
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.joinedAt) -
          new Date(b.joinedAt)
        );
      }

      return (
        new Date(b.joinedAt) -
        new Date(a.joinedAt)
      );
    });

    return result;
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

  const currentPage = Math.min(
    page,
    totalPages
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  function handleSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function handleFilterChange(
    setter,
    value
  ) {
    setter(value);
    setPage(1);
  }

  function openCreateForm() {
    setEditingUser(null);
    setFormOpen(true);
  }

  function openEditForm(user) {
    setEditingUser(user);
    setFormOpen(true);
    setOpenMenu(null);
  }

  function handleUserSubmit(formData) {
    if (editingUser) {
      const updatedUser = {
        ...editingUser,
        ...formData
      };

      dispatch({
        type: "SET_USERS",
        payload: users.map((user) =>
          user.id === editingUser.id
            ? updatedUser
            : user
        )
      });

      toast.success(
        "User updated",
        `${updatedUser.name}'s details were updated successfully.`
      );

      notification.success(
        "User updated",
        `${updatedUser.name} was updated successfully.`,
        updatedUser.id
      );
    } else {
      const newUser = {
        id: `USR-${Date.now()}`,
        ...formData,
        joinedAt:
          new Date().toISOString()
      };

      dispatch({
        type: "SET_USERS",
        payload: [newUser, ...users]
      });

      toast.success(
        "User created",
        `${newUser.name} was added successfully.`
      );

      notification.success(
        "New user created",
        `${newUser.name} was added to the organization.`,
        newUser.id
      );
    }

    setFormOpen(false);
    setEditingUser(null);
  }

  function handleDeleteUser() {
    if (!deleteUser) {
      return;
    }

    dispatch({
      type: "SET_USERS",
      payload: users.filter(
        (user) =>
          user.id !== deleteUser.id
      )
    });

    toast.success(
      "User deleted",
      `${deleteUser.name} was removed successfully.`
    );

    notification.warning(
      "User deleted",
      `${deleteUser.name} was removed from the organization.`,
      deleteUser.id
    );

    setDeleteUser(null);
  }

  const activeUsers = users.filter(
    (user) => user.status === "Active"
  ).length;

  const pendingUsers = users.filter(
    (user) => user.status === "Pending"
  ).length;

  return (
    <div className="users-page">
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">
            USER MANAGEMENT
          </span>

          <h1>Users</h1>

          <p>
            Manage organization users, roles and
            account status.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openCreateForm}
        >
          <Plus size={16} />
          Add User
        </button>
      </div>

      <div className="users-stat-grid">
        <div className="users-stat-card">
          <div>
            <span>Total Users</span>
            <strong>{users.length}</strong>
          </div>

          <div className="users-stat-icon blue">
            <UsersIcon size={18} />
          </div>
        </div>

        <div className="users-stat-card">
          <div>
            <span>Active Users</span>
            <strong>{activeUsers}</strong>
          </div>

          <div className="users-stat-icon green">
            <UsersIcon size={18} />
          </div>
        </div>

        <div className="users-stat-card">
          <div>
            <span>Pending</span>
            <strong>{pendingUsers}</strong>
          </div>

          <div className="users-stat-icon orange">
            <UsersIcon size={18} />
          </div>
        </div>
      </div>

      <div className="users-card">
        <div className="users-toolbar">
          <div className="users-search">
            <Search size={16} />

            <input
              value={search}
              onChange={(event) =>
                handleSearch(
                  event.target.value
                )
              }
              placeholder="Search users..."
            />
          </div>

          <div className="users-filters">
            <select
              value={statusFilter}
              onChange={(event) =>
                handleFilterChange(
                  setStatusFilter,
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
                handleFilterChange(
                  setRoleFilter,
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
              onChange={(event) =>
                setSortBy(event.target.value)
              }
            >
              <option value="newest">
                Newest
              </option>

              <option value="oldest">
                Oldest
              </option>

              <option value="name">
                Name
              </option>
            </select>
          </div>
        </div>

        {paginatedUsers.length === 0 ? (
          <div className="users-empty">
            <div>
              <UsersIcon size={24} />
            </div>

            <h3>No users found</h3>

            <p>
              Try changing your search or filters,
              or create a new user.
            </p>

            <button
              className="secondary-button"
              onClick={openCreateForm}
            >
              Add User
            </button>
          </div>
        ) : (
          <>
            <div className="users-table-wrapper">
              <table className="users-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Company</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedUsers.map(
                    (user) => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar">
                              {user.name
                                .split(" ")
                                .map(
                                  (part) =>
                                    part[0]
                                )
                                .slice(0, 2)
                                .join("")
                                .toUpperCase()}
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

                        <td>{user.company}</td>

                        <td>
                          <span className="role-badge">
                            {user.role}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`status-badge status-${user.status.toLowerCase()}`}
                          >
                            <span />
                            {user.status}
                          </span>
                        </td>

                        <td>
                          {new Date(
                            user.joinedAt
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric"
                            }
                          )}
                        </td>

                        <td>
                          <div className="user-actions">
                            <button
                              onClick={() =>
                                setOpenMenu(
                                  openMenu ===
                                    user.id
                                    ? null
                                    : user.id
                                )
                              }
                              className="more-button"
                            >
                              <MoreHorizontal
                                size={17}
                              />
                            </button>

                            {openMenu ===
                              user.id && (
                              <div className="user-action-menu">
                                <button
                                  onClick={() => {
                                    setViewUser(
                                      user
                                    );
                                    setOpenMenu(
                                      null
                                    );
                                  }}
                                >
                                  <Eye size={14} />
                                  View
                                </button>

                                <button
                                  onClick={() =>
                                    openEditForm(
                                      user
                                    )
                                  }
                                >
                                  <Pencil
                                    size={14}
                                  />
                                  Edit
                                </button>

                                <button
                                  className="danger"
                                  onClick={() => {
                                    setDeleteUser(
                                      user
                                    );
                                    setOpenMenu(
                                      null
                                    );
                                  }}
                                >
                                  <Trash2
                                    size={14}
                                  />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            <div className="mobile-user-list">
              {paginatedUsers.map(
                (user) => (
                  <div
                    className="mobile-user-card"
                    key={user.id}
                  >
                    <div className="mobile-user-top">
                      <div className="user-cell">
                        <div className="user-avatar">
                          {user.name
                            .split(" ")
                            .map(
                              (part) =>
                                part[0]
                            )
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
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
                        className={`status-badge status-${user.status.toLowerCase()}`}
                      >
                        <span />
                        {user.status}
                      </span>
                    </div>

                    <div className="mobile-user-meta">
                      <span>
                        Company: {user.company}
                      </span>

                      <span>
                        Role: {user.role}
                      </span>
                    </div>

                    <div className="mobile-user-actions">
                      <button
                        onClick={() =>
                          setViewUser(user)
                        }
                      >
                        <Eye size={14} />
                        View
                      </button>

                      <button
                        onClick={() =>
                          openEditForm(user)
                        }
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        className="danger"
                        onClick={() =>
                          setDeleteUser(user)
                        }
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>

            <div className="pagination">
              <span>
                Showing{" "}
                {filteredUsers.length === 0
                  ? 0
                  : (currentPage - 1) *
                      PAGE_SIZE +
                    1}{" "}
                -{" "}
                {Math.min(
                  currentPage * PAGE_SIZE,
                  filteredUsers.length
                )}{" "}
                of {filteredUsers.length}
              </span>

              <div>
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.max(
                          1,
                          current - 1
                        )
                    )
                  }
                >
                  Previous
                </button>

                <span className="page-number">
                  {currentPage} / {totalPages}
                </span>

                <button
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setPage(
                      (current) =>
                        Math.min(
                          totalPages,
                          current + 1
                        )
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
        user={editingUser}
        onClose={() => {
          setFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleUserSubmit}
      />

      <ConfirmDialog
        open={Boolean(deleteUser)}
        title="Delete user?"
        message={
          deleteUser
            ? `Are you sure you want to delete ${deleteUser.name}? This action cannot be undone.`
            : ""
        }
        confirmText="Delete User"
        onCancel={() =>
          setDeleteUser(null)
        }
        onConfirm={handleDeleteUser}
      />

      <Modal
        open={Boolean(viewUser)}
        title="User Details"
        description="Complete information about this user."
        onClose={() => setViewUser(null)}
        size="small"
      >
        {viewUser && (
          <div className="user-details">
            <div className="user-details-profile">
              <div className="user-avatar large">
                {viewUser.name
                  .split(" ")
                  .map(
                    (part) => part[0]
                  )
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>

              <h3>{viewUser.name}</h3>

              <p>{viewUser.email}</p>
            </div>

            <div className="detail-list">
              <div>
                <span>Company</span>
                <strong>
                  {viewUser.company}
                </strong>
              </div>

              <div>
                <span>Role</span>
                <strong>
                  {viewUser.role}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {viewUser.status}
                </strong>
              </div>

              <div>
                <span>User ID</span>
                <strong>
                  {viewUser.id}
                </strong>
              </div>

              <div>
                <span>Joined</span>
                <strong>
                  {new Date(
                    viewUser.joinedAt
                  ).toLocaleDateString(
                    "en-IN"
                  )}
                </strong>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Users;