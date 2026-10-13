import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Package
} from "lucide-react";
import "./Plans.css";

import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";
import { useNotifications } from "../../context/NotificationContext";

import PlanForm from "../../components/plans/PlanForm";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import Modal from "../../components/common/Modal";

const PAGE_SIZE = 6;

function Plans() {
  const { state, dispatch } = useApp();

  const toast = useToast();

  const notification =
    useNotifications();

  const plans = state.plans || [];

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [billingFilter, setBillingFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("newest");

  const [page, setPage] = useState(1);

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingPlan, setEditingPlan] =
    useState(null);

  const [viewPlan, setViewPlan] =
    useState(null);

  const [deletePlan, setDeletePlan] =
    useState(null);

  const [openMenu, setOpenMenu] =
    useState(null);

  const filteredPlans = useMemo(() => {
    let result = [...plans];

    const searchValue =
      search.trim().toLowerCase();

    if (searchValue) {
      result = result.filter((plan) =>
        [
          plan.name,
          plan.description,
          plan.billingCycle,
          plan.status,
          ...(plan.features || [])
        ]
          .join(" ")
          .toLowerCase()
          .includes(searchValue)
      );
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (plan) =>
          plan.status === statusFilter
      );
    }

    if (billingFilter !== "All") {
      result = result.filter(
        (plan) =>
          plan.billingCycle ===
          billingFilter
      );
    }

    result.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(
          b.name
        );
      }

      if (sortBy === "price-low") {
        return a.price - b.price;
      }

      if (sortBy === "price-high") {
        return b.price - a.price;
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.createdAt) -
          new Date(b.createdAt)
        );
      }

      return (
        new Date(b.createdAt) -
        new Date(a.createdAt)
      );
    });

    return result;
  }, [
    plans,
    search,
    statusFilter,
    billingFilter,
    sortBy
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredPlans.length / PAGE_SIZE
    )
  );

  const currentPage = Math.min(
    page,
    totalPages
  );

  const paginatedPlans =
    filteredPlans.slice(
      (currentPage - 1) * PAGE_SIZE,
      currentPage * PAGE_SIZE
    );

  const activePlans = plans.filter(
    (plan) => plan.status === "Active"
  ).length;

  const monthlyPlans = plans.filter(
    (plan) =>
      plan.billingCycle === "Monthly"
  ).length;

  const yearlyPlans = plans.filter(
    (plan) =>
      plan.billingCycle === "Yearly"
  ).length;

  function openCreateForm() {
    setEditingPlan(null);
    setFormOpen(true);
  }

  function openEditForm(plan) {
    setEditingPlan(plan);
    setFormOpen(true);
    setOpenMenu(null);
  }

  function handlePlanSubmit(formData) {
    if (editingPlan) {
      const updatedPlan = {
        ...editingPlan,
        ...formData
      };

      dispatch({
        type: "SET_PLANS",
        payload: plans.map((plan) =>
          plan.id === editingPlan.id
            ? updatedPlan
            : plan
        )
      });

      toast.success(
        "Plan updated",
        `${updatedPlan.name} was updated successfully.`
      );

      notification.success(
        "Plan updated",
        `${updatedPlan.name} was updated successfully.`,
        updatedPlan.id
      );
    } else {
      const newPlan = {
        id: `PLAN-${Date.now()}`,
        ...formData,
        createdAt:
          new Date().toISOString()
      };

      dispatch({
        type: "SET_PLANS",
        payload: [newPlan, ...plans]
      });

      toast.success(
        "Plan created",
        `${newPlan.name} was created successfully.`
      );

      notification.success(
        "New plan created",
        `${newPlan.name} is now available.`,
        newPlan.id
      );
    }

    setFormOpen(false);
    setEditingPlan(null);
  }

  function handleDeletePlan() {
    if (!deletePlan) {
      return;
    }

    dispatch({
      type: "SET_PLANS",
      payload: plans.filter(
        (plan) =>
          plan.id !== deletePlan.id
      )
    });

    toast.success(
      "Plan deleted",
      `${deletePlan.name} was removed successfully.`
    );

    notification.warning(
      "Plan deleted",
      `${deletePlan.name} was removed.`,
      deletePlan.id
    );

    setDeletePlan(null);
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setBillingFilter("All");
    setSortBy("newest");
    setPage(1);
  }

  return (
    <div className="plans-page">
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">
            PLAN MANAGEMENT
          </span>

          <h1>Plans</h1>

          <p>
            Create and manage subscription
            plans and pricing.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openCreateForm}
        >
          <Plus size={16} />
          Create Plan
        </button>
      </div>

      <div className="plans-stat-grid">
        <div className="plans-stat-card">
          <div>
            <span>Total Plans</span>
            <strong>{plans.length}</strong>
          </div>

          <div className="plans-stat-icon blue">
            <Package size={18} />
          </div>
        </div>

        <div className="plans-stat-card">
          <div>
            <span>Active Plans</span>
            <strong>{activePlans}</strong>
          </div>

          <div className="plans-stat-icon green">
            <Package size={18} />
          </div>
        </div>

        <div className="plans-stat-card">
          <div>
            <span>Monthly</span>
            <strong>{monthlyPlans}</strong>
          </div>

          <div className="plans-stat-icon purple">
            <Package size={18} />
          </div>
        </div>

        <div className="plans-stat-card">
          <div>
            <span>Yearly</span>
            <strong>{yearlyPlans}</strong>
          </div>

          <div className="plans-stat-icon orange">
            <Package size={18} />
          </div>
        </div>
      </div>

      <div className="plans-card">
        <div className="plans-toolbar">
          <div className="plans-search">
            <Search size={16} />

            <input
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search plans..."
            />
          </div>

          <div className="plans-filters">
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(
                  event.target.value
                );
                setPage(1);
              }}
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
            </select>

            <select
              value={billingFilter}
              onChange={(event) => {
                setBillingFilter(
                  event.target.value
                );
                setPage(1);
              }}
            >
              <option value="All">
                All Billing
              </option>

              <option value="Monthly">
                Monthly
              </option>

              <option value="Yearly">
                Yearly
              </option>
            </select>

            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(
                  event.target.value
                )
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

              <option value="price-low">
                Price Low
              </option>

              <option value="price-high">
                Price High
              </option>
            </select>
          </div>
        </div>

        {paginatedPlans.length === 0 ? (
          <div className="plans-empty">
            <div className="plans-empty-icon">
              <Package size={24} />
            </div>

            <h3>No plans found</h3>

            <p>
              No plans match the current search
              and filters.
            </p>

            <div>
              <button
                className="secondary-button"
                onClick={resetFilters}
              >
                Reset Filters
              </button>

              <button
                className="primary-button"
                onClick={openCreateForm}
              >
                <Plus size={14} />
                Create Plan
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="plans-table-wrapper">
              <table className="plans-table">
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Price</th>
                    <th>Billing</th>
                    <th>Features</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th />
                  </tr>
                </thead>

                <tbody>
                  {paginatedPlans.map(
                    (plan) => (
                      <tr key={plan.id}>
                        <td>
                          <div className="plan-cell">
                            <div className="plan-icon">
                              <Package
                                size={16}
                              />
                            </div>

                            <div>
                              <strong>
                                {plan.name}
                              </strong>

                              <span>
                                {plan.description}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <strong className="plan-price">
                            ₹
                            {plan.price.toLocaleString(
                              "en-IN"
                            )}
                          </strong>
                        </td>

                        <td>
                          <span className="billing-badge">
                            {plan.billingCycle}
                          </span>
                        </td>

                        <td>
                          <span className="feature-count">
                            {plan.features?.length ||
                              0}{" "}
                            features
                          </span>
                        </td>

                        <td>
                          <span
                            className={`status-badge status-${plan.status.toLowerCase()}`}
                          >
                            <span />
                            {plan.status}
                          </span>
                        </td>

                        <td>
                          {new Date(
                            plan.createdAt
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
                          <div className="plan-actions">
                            <button
                              className="more-button"
                              onClick={() =>
                                setOpenMenu(
                                  openMenu ===
                                    plan.id
                                    ? null
                                    : plan.id
                                )
                              }
                            >
                              <MoreHorizontal
                                size={17}
                              />
                            </button>

                            {openMenu ===
                              plan.id && (
                              <div className="user-action-menu">
                                <button
                                  onClick={() => {
                                    setViewPlan(
                                      plan
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
                                      plan
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
                                    setDeletePlan(
                                      plan
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

            <div className="mobile-plan-list">
              {paginatedPlans.map(
                (plan) => (
                  <div
                    className="mobile-plan-card"
                    key={plan.id}
                  >
                    <div className="mobile-plan-header">
                      <div className="plan-cell">
                        <div className="plan-icon">
                          <Package
                            size={16}
                          />
                        </div>

                        <div>
                          <strong>
                            {plan.name}
                          </strong>

                          <span>
                            {plan.description}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`status-badge status-${plan.status.toLowerCase()}`}
                      >
                        <span />
                        {plan.status}
                      </span>
                    </div>

                    <div className="mobile-plan-price">
                      ₹
                      {plan.price.toLocaleString(
                        "en-IN"
                      )}

                      <small>
                        /{" "}
                        {plan.billingCycle.toLowerCase()}
                      </small>
                    </div>

                    <div className="mobile-plan-features">
                      {plan.features?.map(
                        (feature) => (
                          <span
                            key={feature}
                          >
                            {feature}
                          </span>
                        )
                      )}
                    </div>

                    <div className="mobile-plan-actions">
                      <button
                        onClick={() =>
                          setViewPlan(plan)
                        }
                      >
                        <Eye size={14} />
                        View
                      </button>

                      <button
                        onClick={() =>
                          openEditForm(plan)
                        }
                      >
                        <Pencil size={14} />
                        Edit
                      </button>

                      <button
                        className="danger"
                        onClick={() =>
                          setDeletePlan(plan)
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
                {filteredPlans.length === 0
                  ? 0
                  : (currentPage - 1) *
                      PAGE_SIZE +
                    1}{" "}
                -{" "}
                {Math.min(
                  currentPage * PAGE_SIZE,
                  filteredPlans.length
                )}{" "}
                of {filteredPlans.length}
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

      <PlanForm
        open={formOpen}
        plan={editingPlan}
        onClose={() => {
          setFormOpen(false);
          setEditingPlan(null);
        }}
        onSubmit={handlePlanSubmit}
      />

      <ConfirmDialog
        open={Boolean(deletePlan)}
        title="Delete plan?"
        message={
          deletePlan
            ? `Are you sure you want to delete ${deletePlan.name}? This action cannot be undone.`
            : ""
        }
        confirmText="Delete Plan"
        onCancel={() =>
          setDeletePlan(null)
        }
        onConfirm={handleDeletePlan}
      />

      <Modal
        open={Boolean(viewPlan)}
        title="Plan Details"
        description="Complete information about this subscription plan."
        onClose={() => setViewPlan(null)}
        size="small"
      >
        {viewPlan && (
          <div className="plan-details">
            <div className="plan-details-header">
              <div className="plan-icon large">
                <Package size={20} />
              </div>

              <div>
                <h3>{viewPlan.name}</h3>

                <p>
                  {viewPlan.description}
                </p>
              </div>
            </div>

            <div className="plan-details-price">
              ₹
              {viewPlan.price.toLocaleString(
                "en-IN"
              )}

              <span>
                /{" "}
                {viewPlan.billingCycle.toLowerCase()}
              </span>
            </div>

            <div className="plan-details-section">
              <span>Features</span>

              <div className="detail-feature-list">
                {viewPlan.features?.map(
                  (feature) => (
                    <div key={feature}>
                      <span />
                      {feature}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="detail-list">
              <div>
                <span>Status</span>

                <strong>
                  {viewPlan.status}
                </strong>
              </div>

              <div>
                <span>Plan ID</span>

                <strong>
                  {viewPlan.id}
                </strong>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Plans;