import { useMemo, useState } from "react";
import {
  CalendarDays,
  CreditCard,
  Eye,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
  WalletCards,
  X
} from "lucide-react";

import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { useNotifications } from "../../context/NotificationContext";

import SubscriptionForm from "../../components/subscriptions/SubscriptionForm";
import Modal from "../../components/common/Modal";
import ConfirmDialog from "../../components/common/ConfirmDialog";

import "./Subscriptions.css";

const PAGE_SIZE = 6;

function Subscriptions() {
  const { state, dispatch } = useApp();
  const { success, error } = useToast();
  const {
    success: notifySuccess,
    error: notifyError
  } = useNotifications();

  const users = state.users || [];
  const plans = state.plans || [];
  const subscriptions = state.subscriptions || [];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");
  const [paymentFilter, setPaymentFilter] =
    useState("All");
  const [sortBy, setSortBy] =
    useState("Newest");

  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingSubscription, setEditingSubscription] =
    useState(null);

  const [viewSubscription, setViewSubscription] =
    useState(null);

  const [deleteSubscription, setDeleteSubscription] =
    useState(null);

  function getUser(userId) {
    return users.find(
      (user) => user.id === userId
    );
  }

  function getPlan(planId) {
    return plans.find(
      (plan) => plan.id === planId
    );
  }

  function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(Number(value || 0));
  }

  function formatDate(value) {
    if (!value) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    }).format(new Date(value));
  }

  function getInitials(name = "") {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  const statistics = useMemo(() => {
    const active = subscriptions.filter(
      (subscription) =>
        subscription.status === "Active"
    ).length;

    const trials = subscriptions.filter(
      (subscription) =>
        subscription.status === "Trial"
    ).length;

    const paidRevenue = subscriptions
      .filter(
        (subscription) =>
          subscription.paymentStatus === "Paid"
      )
      .reduce(
        (total, subscription) =>
          total +
          Number(subscription.amount || 0),
        0
      );

    return {
      total: subscriptions.length,
      active,
      trials,
      paidRevenue
    };
  }, [subscriptions]);

  const filteredSubscriptions = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    const result = subscriptions.filter(
      (subscription) => {
        const user = getUser(
          subscription.userId
        );

        const plan = getPlan(
          subscription.planId
        );

        const searchableText = [
          subscription.id,
          user?.name,
          user?.email,
          plan?.name,
          subscription.status,
          subscription.paymentStatus
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch =
          !normalizedSearch ||
          searchableText.includes(
            normalizedSearch
          );

        const matchesStatus =
          statusFilter === "All" ||
          subscription.status === statusFilter;

        const matchesPayment =
          paymentFilter === "All" ||
          subscription.paymentStatus ===
            paymentFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPayment
        );
      }
    );

    return result.sort((a, b) => {
      if (sortBy === "Newest") {
        return (
          new Date(b.createdAt || b.startDate) -
          new Date(a.createdAt || a.startDate)
        );
      }

      if (sortBy === "Oldest") {
        return (
          new Date(a.createdAt || a.startDate) -
          new Date(b.createdAt || b.startDate)
        );
      }

      if (sortBy === "Highest Amount") {
        return (
          Number(b.amount || 0) -
          Number(a.amount || 0)
        );
      }

      if (sortBy === "Lowest Amount") {
        return (
          Number(a.amount || 0) -
          Number(b.amount || 0)
        );
      }

      return 0;
    });
  }, [
    subscriptions,
    search,
    statusFilter,
    paymentFilter,
    sortBy,
    users,
    plans
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredSubscriptions.length / PAGE_SIZE
    )
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const paginatedSubscriptions =
    filteredSubscriptions.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    );

  function handleSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function handleStatusFilter(value) {
    setStatusFilter(value);
    setPage(1);
  }

  function handlePaymentFilter(value) {
    setPaymentFilter(value);
    setPage(1);
  }

  function handleSort(value) {
    setSortBy(value);
    setPage(1);
  }

  function clearFilters() {
    setSearch("");
    setStatusFilter("All");
    setPaymentFilter("All");
    setSortBy("Newest");
    setPage(1);
  }

  function openCreateForm() {
    setEditingSubscription(null);
    setFormOpen(true);
  }

  function openEditForm(subscription) {
    setEditingSubscription(subscription);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditingSubscription(null);
  }

  function handleSubmit(formData) {
    if (editingSubscription) {
      const updatedSubscriptions =
        subscriptions.map((subscription) =>
          subscription.id ===
          editingSubscription.id
            ? {
                ...subscription,
                ...formData
              }
            : subscription
        );

      dispatch({
        type: "SET_SUBSCRIPTIONS",
        payload: updatedSubscriptions
      });

      success(
        "Subscription updated",
        "Subscription details were updated successfully."
      );

      notifySuccess(
        "Subscription updated",
        "Subscription details were updated successfully.",
        editingSubscription.id
      );
    } else {
      const newSubscription = {
        id: `SUB-${Date.now()}`,
        ...formData,
        createdAt:
          new Date().toISOString()
      };

      dispatch({
        type: "SET_SUBSCRIPTIONS",
        payload: [
          newSubscription,
          ...subscriptions
        ]
      });

      success(
        "Subscription created",
        "New subscription was created successfully."
      );

      notifySuccess(
        "Subscription created",
        "New subscription was created successfully.",
        newSubscription.id
      );
    }

    closeForm();
  }

  function confirmDelete() {
    if (!deleteSubscription) {
      return;
    }

    const updatedSubscriptions =
      subscriptions.filter(
        (subscription) =>
          subscription.id !==
          deleteSubscription.id
      );

    dispatch({
      type: "SET_SUBSCRIPTIONS",
      payload: updatedSubscriptions
    });

    success(
      "Subscription deleted",
      "The subscription was removed successfully."
    );

    notifySuccess(
      "Subscription deleted",
      "The subscription was removed successfully.",
      deleteSubscription.id
    );

    setDeleteSubscription(null);

    if (
      currentPage > 1 &&
      paginatedSubscriptions.length === 1
    ) {
      setPage((current) =>
        Math.max(1, current - 1)
      );
    }
  }

  function renderStatus(status) {
    return (
      <span
        className={`subscription-status ${status
          .toLowerCase()
          .replace(/\s+/g, "-")}`}
      >
        {status}
      </span>
    );
  }

  function renderPaymentStatus(status) {
    return (
      <span
        className={`subscription-status ${status
          .toLowerCase()
          .replace(/\s+/g, "-")}`}
      >
        {status}
      </span>
    );
  }

  return (
    <section className="subscriptions-page">
      <div className="subscription-page-heading">
        <div>
          <span className="subscription-page-eyebrow">
            Subscription Management
          </span>

          <h1>Subscriptions</h1>

          <p>
            Manage customer subscriptions,
            payments and renewal activity from
            one workspace.
          </p>
        </div>

        <button
          className="subscription-primary-button"
          onClick={openCreateForm}
        >
          <Plus size={16} />
          New Subscription
        </button>
      </div>

      <div className="subscription-stat-grid">
        <div className="subscription-stat-card">
          <div className="subscription-stat-icon">
            <CreditCard size={20} />
          </div>

          <div>
            <span>Total Subscriptions</span>
            <strong>{statistics.total}</strong>
          </div>
        </div>

        <div className="subscription-stat-card">
          <div className="subscription-stat-icon">
            <Users size={20} />
          </div>

          <div>
            <span>Active</span>
            <strong>{statistics.active}</strong>
          </div>
        </div>

        <div className="subscription-stat-card">
          <div className="subscription-stat-icon">
            <CalendarDays size={20} />
          </div>

          <div>
            <span>Trial Accounts</span>
            <strong>{statistics.trials}</strong>
          </div>
        </div>

        <div className="subscription-stat-card">
          <div className="subscription-stat-icon">
            <WalletCards size={20} />
          </div>

          <div>
            <span>Paid Revenue</span>
            <strong>
              {formatCurrency(
                statistics.paidRevenue
              )}
            </strong>
          </div>
        </div>
      </div>

      <div className="subscription-card">
        <div className="subscription-toolbar">
          <div className="subscription-search">
            <Search size={16} />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                handleSearch(
                  event.target.value
                )
              }
              placeholder="Search subscriptions..."
            />
          </div>

          <div className="subscription-filters">
            <select
              value={statusFilter}
              onChange={(event) =>
                handleStatusFilter(
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

              <option value="Trial">
                Trial
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

              <option value="Expired">
                Expired
              </option>
            </select>

            <select
              value={paymentFilter}
              onChange={(event) =>
                handlePaymentFilter(
                  event.target.value
                )
              }
            >
              <option value="All">
                All Payments
              </option>

              <option value="Paid">
                Paid
              </option>

              <option value="Pending">
                Pending
              </option>

              <option value="Failed">
                Failed
              </option>

              <option value="Refunded">
                Refunded
              </option>
            </select>

            <select
              value={sortBy}
              onChange={(event) =>
                handleSort(
                  event.target.value
                )
              }
            >
              <option value="Newest">
                Newest
              </option>

              <option value="Oldest">
                Oldest
              </option>

              <option value="Highest Amount">
                Highest Amount
              </option>

              <option value="Lowest Amount">
                Lowest Amount
              </option>
            </select>

            {(search ||
              statusFilter !== "All" ||
              paymentFilter !== "All" ||
              sortBy !== "Newest") && (
              <button
                className="subscription-clear-button"
                onClick={clearFilters}
              >
                <X size={14} />
                Clear
              </button>
            )}
          </div>
        </div>

        {paginatedSubscriptions.length > 0 ? (
          <>
            <div className="subscription-table-wrapper">
              <table className="subscription-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Plan</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Start Date</th>
                    <th>Renewal Date</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedSubscriptions.map(
                    (subscription) => {
                      const user = getUser(
                        subscription.userId
                      );

                      const plan = getPlan(
                        subscription.planId
                      );

                      return (
                        <tr
                          key={subscription.id}
                        >
                          <td>
                            <div className="subscription-cell">
                              <div className="subscription-avatar">
                                {getInitials(
                                  user?.name
                                )}
                              </div>

                              <div>
                                <strong>
                                  {user?.name ||
                                    "Unknown customer"}
                                </strong>

                                <span>
                                  {user?.email ||
                                    subscription.userId}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="subscription-plan-name">
                              {plan?.name ||
                                subscription.planId}
                            </span>
                          </td>

                          <td>
                            {renderStatus(
                              subscription.status
                            )}
                          </td>

                          <td>
                            <strong>
                              {formatCurrency(
                                subscription.amount
                              )}
                            </strong>
                          </td>

                          <td>
                            {formatDate(
                              subscription.startDate
                            )}
                          </td>

                          <td>
                            {formatDate(
                              subscription.renewalDate
                            )}
                          </td>

                          <td>
                            {renderPaymentStatus(
                              subscription.paymentStatus
                            )}
                          </td>

                          <td>
                            <div className="subscription-actions">
                              <button
                                onClick={() =>
                                  setViewSubscription(
                                    subscription
                                  )
                                }
                                aria-label="View subscription"
                              >
                                <Eye size={15} />
                              </button>

                              <button
                                onClick={() =>
                                  openEditForm(
                                    subscription
                                  )
                                }
                                aria-label="Edit subscription"
                              >
                                <Pencil size={15} />
                              </button>

                              <button
                                className="delete-action"
                                onClick={() =>
                                  setDeleteSubscription(
                                    subscription
                                  )
                                }
                                aria-label="Delete subscription"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            <div className="subscription-mobile-list">
              {paginatedSubscriptions.map(
                (subscription) => {
                  const user = getUser(
                    subscription.userId
                  );

                  const plan = getPlan(
                    subscription.planId
                  );

                  return (
                    <div
                      className="subscription-mobile-card"
                      key={subscription.id}
                    >
                      <div className="subscription-mobile-header">
                        <div className="subscription-cell">
                          <div className="subscription-avatar">
                            {getInitials(
                              user?.name
                            )}
                          </div>

                          <div>
                            <strong>
                              {user?.name ||
                                "Unknown customer"}
                            </strong>

                            <span>
                              {plan?.name ||
                                "Unknown plan"}
                            </span>
                          </div>
                        </div>

                        {renderStatus(
                          subscription.status
                        )}
                      </div>

                      <div className="subscription-mobile-details">
                        <div>
                          <span>Amount</span>
                          <strong>
                            {formatCurrency(
                              subscription.amount
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>Payment</span>
                          {renderPaymentStatus(
                            subscription.paymentStatus
                          )}
                        </div>

                        <div>
                          <span>Start Date</span>
                          <strong>
                            {formatDate(
                              subscription.startDate
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>Renewal</span>
                          <strong>
                            {formatDate(
                              subscription.renewalDate
                            )}
                          </strong>
                        </div>
                      </div>

                      <div className="subscription-mobile-actions">
                        <button
                          onClick={() =>
                            setViewSubscription(
                              subscription
                            )
                          }
                        >
                          <Eye size={14} />
                          View
                        </button>

                        <button
                          onClick={() =>
                            openEditForm(
                              subscription
                            )
                          }
                        >
                          <Pencil size={14} />
                          Edit
                        </button>

                        <button
                          className="delete-action"
                          onClick={() =>
                            setDeleteSubscription(
                              subscription
                            )
                          }
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            <div className="subscription-pagination">
              <span>
                Showing{" "}
                {Math.min(
                  (currentPage - 1) *
                    PAGE_SIZE +
                    1,
                  filteredSubscriptions.length
                )}
                {" - "}
                {Math.min(
                  currentPage * PAGE_SIZE,
                  filteredSubscriptions.length
                )}{" "}
                of{" "}
                {filteredSubscriptions.length}{" "}
                subscriptions
              </span>

              <div className="subscription-pagination-buttons">
                <button
                  disabled={currentPage === 1}
                  onClick={() =>
                    setPage((current) =>
                      Math.max(1, current - 1)
                    )
                  }
                >
                  Prev
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    className={
                      pageNumber === currentPage
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setPage(pageNumber)
                    }
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  disabled={
                    currentPage === totalPages
                  }
                  onClick={() =>
                    setPage((current) =>
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
        ) : (
          <div className="subscription-empty">
            <div className="subscription-empty-icon">
              <CreditCard size={25} />
            </div>

            <h3>
              No subscriptions found
            </h3>

            <p>
              Try changing your search or filter
              options.
            </p>

            <button
              onClick={openCreateForm}
            >
              Create Subscription
            </button>
          </div>
        )}
      </div>

      <SubscriptionForm
        open={formOpen}
        subscription={editingSubscription}
        users={users}
        plans={plans}
        onClose={closeForm}
        onSubmit={handleSubmit}
      />

      <Modal
        open={Boolean(viewSubscription)}
        title="Subscription Details"
        onClose={() =>
          setViewSubscription(null)
        }
        size="small"
      >
        {viewSubscription && (
          <div className="subscription-details-modal">
            {(() => {
              const user = getUser(
                viewSubscription.userId
              );

              const plan = getPlan(
                viewSubscription.planId
              );

              return (
                <>
                  <div className="subscription-detail-profile">
                    <div className="subscription-large-avatar">
                      {getInitials(
                        user?.name
                      )}
                    </div>

                    <div>
                      <h3>
                        {user?.name ||
                          "Unknown customer"}
                      </h3>

                      <p>
                        {user?.email ||
                          "No email available"}
                      </p>
                    </div>
                  </div>

                  <div className="subscription-detail-grid">
                    <div>
                      <span>Subscription ID</span>
                      <strong>
                        {viewSubscription.id}
                      </strong>
                    </div>

                    <div>
                      <span>Plan</span>
                      <strong>
                        {plan?.name ||
                          viewSubscription.planId}
                      </strong>
                    </div>

                    <div>
                      <span>Status</span>
                      {renderStatus(
                        viewSubscription.status
                      )}
                    </div>

                    <div>
                      <span>Payment</span>
                      {renderPaymentStatus(
                        viewSubscription.paymentStatus
                      )}
                    </div>

                    <div>
                      <span>Amount</span>
                      <strong>
                        {formatCurrency(
                          viewSubscription.amount
                        )}
                      </strong>
                    </div>

                    <div>
                      <span>Renewal Date</span>
                      <strong>
                        {formatDate(
                          viewSubscription.renewalDate
                        )}
                      </strong>
                    </div>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteSubscription)}
        title="Delete subscription?"
        message="This subscription will be permanently removed from the dashboard."
        confirmText="Delete Subscription"
        cancelText="Cancel"
        onCancel={() =>
          setDeleteSubscription(null)
        }
        onConfirm={confirmDelete}
      />
    </section>
  );
}

export default Subscriptions;