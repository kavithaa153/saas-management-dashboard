import { useMemo, useState } from "react";
import {
  Eye,
  Mail,
  Pencil,
  Search,
  Trash2,
  Users,
  Wallet
} from "lucide-react";

import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { useNotifications } from "../../context/NotificationContext";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import "./Customers.css";

function Customers() {
  const { state, dispatch } = useApp();
  const { success, error } = useToast();
  const {
    success: notifySuccess,
    error: notifyError
  } = useNotifications();

  const users = state.users || [];
  const subscriptions =
    state.subscriptions || [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [sortBy, setSortBy] =
    useState("newest");

  const [selectedCustomer, setSelectedCustomer] =
    useState(null);

  const [deleteCustomer, setDeleteCustomer] =
    useState(null);

  const [editCustomer, setEditCustomer] =
    useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    status: ""
  });

  const customerData = useMemo(() => {
    return users.map((user) => {
      const customerSubscriptions =
        subscriptions.filter(
          (subscription) =>
            subscription.userId === user.id
        );

      const paidRevenue =
        customerSubscriptions
          .filter(
            (subscription) =>
              subscription.paymentStatus ===
              "Paid"
          )
          .reduce(
            (total, subscription) =>
              total +
              Number(subscription.amount || 0),
            0
          );

      return {
        ...user,
        subscriptionCount:
          customerSubscriptions.length,
        revenue: paidRevenue
      };
    });
  }, [users, subscriptions]);

  const filteredCustomers = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    const result =
      customerData.filter((customer) => {
        const matchesSearch =
          !normalizedSearch ||
          customer.name
            .toLowerCase()
            .includes(normalizedSearch) ||
          customer.email
            .toLowerCase()
            .includes(normalizedSearch) ||
          customer.company
            .toLowerCase()
            .includes(normalizedSearch);

        const matchesStatus =
          statusFilter === "All" ||
          customer.status === statusFilter;

        return (
          matchesSearch &&
          matchesStatus
        );
      });

    return result.sort((first, second) => {
      if (sortBy === "newest") {
        return (
          new Date(second.joinedAt) -
          new Date(first.joinedAt)
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(first.joinedAt) -
          new Date(second.joinedAt)
        );
      }

      if (sortBy === "name") {
        return first.name.localeCompare(
          second.name
        );
      }

      if (sortBy === "revenue") {
        return second.revenue - first.revenue;
      }

      return 0;
    });
  }, [
    customerData,
    search,
    statusFilter,
    sortBy
  ]);

  const totalRevenue = customerData.reduce(
    (total, customer) =>
      total + customer.revenue,
    0
  );

  const activeCustomers =
    customerData.filter(
      (customer) =>
        customer.status === "Active"
    ).length;

  const pendingCustomers =
    customerData.filter(
      (customer) =>
        customer.status === "Pending"
    ).length;

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  }

  function formatDate(date) {
    if (!date) {
      return "-";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date(date));
  }

  function getInitials(name) {
    return name
      .split(" ")
      .map((part) => part.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  function openEdit(customer) {
    setEditCustomer(customer);

    setFormData({
      name: customer.name || "",
      email: customer.email || "",
      company: customer.company || "",
      role: customer.role || "",
      status: customer.status || ""
    });
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  }

  function handleUpdate(event) {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.company.trim()
    ) {
      error(
        "Validation error",
        "Please complete all required fields."
      );

      return;
    }

    const updatedUsers = users.map((user) =>
      user.id === editCustomer.id
        ? {
            ...user,
            name: formData.name.trim(),
            email: formData.email.trim(),
            company:
              formData.company.trim(),
            role: formData.role,
            status: formData.status
          }
        : user
    );

    dispatch({
      type: "SET_USERS",
      payload: updatedUsers
    });

    success(
      "Customer updated",
      `${formData.name} was updated successfully.`
    );

    notifySuccess(
      "Customer updated",
      `${formData.name} details were updated.`,
      editCustomer.id
    );

    setEditCustomer(null);
  }

  function handleDelete() {
    const hasSubscriptions =
      subscriptions.some(
        (subscription) =>
          subscription.userId ===
          deleteCustomer.id
      );

    if (hasSubscriptions) {
      error(
        "Cannot delete customer",
        "This customer has subscription records."
      );

      notifyError(
        "Customer deletion blocked",
        "The customer has subscription records.",
        deleteCustomer.id
      );

      setDeleteCustomer(null);

      return;
    }

    const updatedUsers = users.filter(
      (user) =>
        user.id !== deleteCustomer.id
    );

    dispatch({
      type: "SET_USERS",
      payload: updatedUsers
    });

    success(
      "Customer deleted",
      `${deleteCustomer.name} was removed.`
    );

    notifySuccess(
      "Customer deleted",
      `${deleteCustomer.name} was removed.`,
      deleteCustomer.id
    );

    setDeleteCustomer(null);
  }

  return (
    <section className="customers-page">
      <div className="customers-hero">
        <div>
          <span className="customers-eyebrow">
            CUSTOMER MANAGEMENT
          </span>

          <h1>Customers</h1>

          <p>
            Manage customer accounts, subscriptions
            and lifetime revenue from one workspace.
          </p>
        </div>

        <div className="customers-hero-stat">
          <Users size={19} />

          <div>
            <strong>
              {customerData.length}
            </strong>

            <span>
              Total customers
            </span>
          </div>
        </div>
      </div>

      <div className="customers-stats">
        <div className="customer-stat-card">
          <div className="customer-stat-icon">
            <Users size={19} />
          </div>

          <div>
            <span>Total Customers</span>
            <strong>
              {customerData.length}
            </strong>
            <small>
              Registered accounts
            </small>
          </div>
        </div>

        <div className="customer-stat-card">
          <div className="customer-stat-icon">
            <Users size={19} />
          </div>

          <div>
            <span>Active Customers</span>
            <strong>
              {activeCustomers}
            </strong>
            <small>
              Currently active
            </small>
          </div>
        </div>

        <div className="customer-stat-card">
          <div className="customer-stat-icon">
            <Mail size={19} />
          </div>

          <div>
            <span>Pending</span>
            <strong>
              {pendingCustomers}
            </strong>
            <small>
              Awaiting activation
            </small>
          </div>
        </div>

        <div className="customer-stat-card">
          <div className="customer-stat-icon">
            <Wallet size={19} />
          </div>

          <div>
            <span>Customer Revenue</span>
            <strong>
              {formatCurrency(totalRevenue)}
            </strong>
            <small>
              Total paid revenue
            </small>
          </div>
        </div>
      </div>

      <div className="customers-panel">
        <div className="customers-toolbar">
          <div className="customers-search">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search customers, email or company..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="customers-filters">
            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
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

              <option value="revenue">
                Highest Revenue
              </option>
            </select>
          </div>
        </div>

        <div className="customers-table-wrap">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Company</th>
                <th>Role</th>
                <th>Subscriptions</th>
                <th>Revenue</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map(
                (customer) => (
                  <tr key={customer.id}>
                    <td>
                      <div className="customer-person">
                        <div className="customer-avatar">
                          {getInitials(
                            customer.name
                          )}
                        </div>

                        <div>
                          <strong>
                            {customer.name}
                          </strong>

                          <span>
                            {customer.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span className="customer-company">
                        {customer.company}
                      </span>
                    </td>

                    <td>
                      <span className="customer-role">
                        {customer.role}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {customer.subscriptionCount}
                      </strong>
                    </td>

                    <td>
                      <strong className="customer-revenue">
                        {formatCurrency(
                          customer.revenue
                        )}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`customer-status ${customer.status.toLowerCase()}`}
                      >
                        {customer.status}
                      </span>
                    </td>

                    <td>
                      <span className="customer-date">
                        {formatDate(
                          customer.joinedAt
                        )}
                      </span>
                    </td>

                    <td>
                      <div className="customer-actions">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedCustomer(
                              customer
                            )
                          }
                          aria-label="View customer"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openEdit(customer)
                          }
                          aria-label="Edit customer"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          className="delete"
                          onClick={() =>
                            setDeleteCustomer(
                              customer
                            )
                          }
                          aria-label="Delete customer"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="customers-empty">
            <Users size={28} />

            <strong>
              No customers found
            </strong>

            <span>
              Try changing your search or filter.
            </span>
          </div>
        )}

        <div className="customers-footer">
          Showing{" "}
          <strong>
            {filteredCustomers.length}
          </strong>{" "}
          of{" "}
          <strong>
            {customerData.length}
          </strong>{" "}
          customers
        </div>
      </div>

      <div className="customers-mobile-list">
        {filteredCustomers.map(
          (customer) => (
            <div
              className="customer-mobile-card"
              key={customer.id}
            >
              <div className="customer-mobile-top">
                <div className="customer-person">
                  <div className="customer-avatar">
                    {getInitials(
                      customer.name
                    )}
                  </div>

                  <div>
                    <strong>
                      {customer.name}
                    </strong>

                    <span>
                      {customer.email}
                    </span>
                  </div>
                </div>

                <span
                  className={`customer-status ${customer.status.toLowerCase()}`}
                >
                  {customer.status}
                </span>
              </div>

              <div className="customer-mobile-info">
                <div>
                  <span>Company</span>
                  <strong>
                    {customer.company}
                  </strong>
                </div>

                <div>
                  <span>Subscriptions</span>
                  <strong>
                    {customer.subscriptionCount}
                  </strong>
                </div>

                <div>
                  <span>Revenue</span>
                  <strong>
                    {formatCurrency(
                      customer.revenue
                    )}
                  </strong>
                </div>
              </div>

              <div className="customer-mobile-actions">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedCustomer(
                      customer
                    )
                  }
                >
                  <Eye size={15} />
                  View
                </button>

                <button
                  type="button"
                  onClick={() =>
                    openEdit(customer)
                  }
                >
                  <Pencil size={15} />
                  Edit
                </button>

                <button
                  type="button"
                  className="delete"
                  onClick={() =>
                    setDeleteCustomer(
                      customer
                    )
                  }
                >
                  <Trash2 size={15} />
                  Delete
                </button>
              </div>
            </div>
          )
        )}
      </div>

      <Modal
        open={Boolean(selectedCustomer)}
        title="Customer Details"
        description="Customer account and subscription overview."
        onClose={() =>
          setSelectedCustomer(null)
        }
        size="small"
      >
        {selectedCustomer && (
          <div className="customer-detail">
            <div className="customer-detail-profile">
              <div className="customer-detail-avatar">
                {getInitials(
                  selectedCustomer.name
                )}
              </div>

              <div>
                <h3>
                  {selectedCustomer.name}
                </h3>

                <p>
                  {selectedCustomer.email}
                </p>
              </div>
            </div>

            <div className="customer-detail-grid">
              <div>
                <span>Company</span>
                <strong>
                  {selectedCustomer.company}
                </strong>
              </div>

              <div>
                <span>Role</span>
                <strong>
                  {selectedCustomer.role}
                </strong>
              </div>

              <div>
                <span>Status</span>
                <strong>
                  {selectedCustomer.status}
                </strong>
              </div>

              <div>
                <span>Subscriptions</span>
                <strong>
                  {
                    selectedCustomer.subscriptionCount
                  }
                </strong>
              </div>

              <div>
                <span>Revenue</span>
                <strong>
                  {formatCurrency(
                    selectedCustomer.revenue
                  )}
                </strong>
              </div>

              <div>
                <span>Joined</span>
                <strong>
                  {formatDate(
                    selectedCustomer.joinedAt
                  )}
                </strong>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={Boolean(editCustomer)}
        title="Edit Customer"
        description="Update customer account information."
        onClose={() => setEditCustomer(null)}
        size="medium"
      >
        <form
          className="customer-edit-form"
          onSubmit={handleUpdate}
        >
          <div className="customer-form-grid">
            <div>
              <label>
                Name
              </label>

              <input
                name="name"
                value={formData.name}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label>
                Company
              </label>

              <input
                name="company"
                value={formData.company}
                onChange={handleFormChange}
              />
            </div>

            <div>
              <label>
                Role
              </label>

              <select
                name="role"
                value={formData.role}
                onChange={handleFormChange}
              >
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
            </div>

            <div>
              <label>
                Status
              </label>

              <select
                name="status"
                value={formData.status}
                onChange={handleFormChange}
              >
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
            </div>
          </div>

          <div className="customer-form-actions">
            <button
              type="button"
              className="customer-secondary-button"
              onClick={() =>
                setEditCustomer(null)
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="customer-primary-button"
            >
              Update Customer
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteCustomer)}
        title="Delete Customer"
        message={
          deleteCustomer
            ? `Are you sure you want to delete ${deleteCustomer.name}? This action cannot be undone.`
            : ""
        }
        confirmText="Delete Customer"
        onConfirm={handleDelete}
        onCancel={() =>
          setDeleteCustomer(null)
        }
      />
    </section>
  );
}

export default Customers;