import { useEffect, useState } from "react";

import Modal from "../common/Modal";

import "./SubscriptionForm.css";

const initialForm = {
  userId: "",
  planId: "",
  startDate: "",
  renewalDate: "",
  status: "Active",
  paymentStatus: "Paid",
  amount: ""
};

function SubscriptionForm({
  open,
  subscription,
  users,
  plans,
  onClose,
  onSubmit
}) {
  const [formData, setFormData] =
    useState(initialForm);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (subscription) {
      setFormData({
        userId: subscription.userId || "",
        planId: subscription.planId || "",
        startDate:
          subscription.startDate || "",
        renewalDate:
          subscription.renewalDate || "",
        status:
          subscription.status || "Active",
        paymentStatus:
          subscription.paymentStatus || "Paid",
        amount:
          subscription.amount ?? ""
      });
    } else {
      setFormData(initialForm);
    }

    setErrors({});
  }, [subscription, open]);

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

    if (name === "planId" && value) {
      const selectedPlan = plans.find(
        (plan) => plan.id === value
      );

      if (selectedPlan) {
        setFormData((current) => ({
          ...current,
          planId: value,
          amount: selectedPlan.price
        }));
      }
    }
  }

  function validate() {
    const nextErrors = {};

    if (!formData.userId) {
      nextErrors.userId =
        "Please select a customer.";
    }

    if (!formData.planId) {
      nextErrors.planId =
        "Please select a subscription plan.";
    }

    if (!formData.startDate) {
      nextErrors.startDate =
        "Start date is required.";
    }

    if (!formData.renewalDate) {
      nextErrors.renewalDate =
        "Renewal date is required.";
    }

    if (
      formData.startDate &&
      formData.renewalDate &&
      new Date(formData.renewalDate) <=
        new Date(formData.startDate)
    ) {
      nextErrors.renewalDate =
        "Renewal date must be after start date.";
    }

    if (
      formData.amount === "" ||
      Number(formData.amount) < 0
    ) {
      nextErrors.amount =
        "Enter a valid amount.";
    }

    if (!formData.status) {
      nextErrors.status =
        "Please select a status.";
    }

    if (!formData.paymentStatus) {
      nextErrors.paymentStatus =
        "Please select payment status.";
    }

    setErrors(nextErrors);

    return (
      Object.keys(nextErrors).length === 0
    );
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      userId: formData.userId,
      planId: formData.planId,
      startDate: formData.startDate,
      renewalDate: formData.renewalDate,
      status: formData.status,
      paymentStatus:
        formData.paymentStatus,
      amount: Number(formData.amount)
    });
  }

  return (
    <Modal
      open={open}
      title={
        subscription
          ? "Edit Subscription"
          : "Create Subscription"
      }
      description={
        subscription
          ? "Update the customer subscription details."
          : "Create a new customer subscription."
      }
      onClose={onClose}
      size="medium"
    >
      <form
        className="subscription-form"
        onSubmit={handleSubmit}
      >
        <div className="subscription-form-section">
          <div className="subscription-section-title">
            Customer & Plan
          </div>

          <div className="subscription-form-grid">
            <div className="subscription-form-group">
              <label htmlFor="subscription-user">
                Customer
              </label>

              <select
                id="subscription-user"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
              >
                <option value="">
                  Select customer
                </option>

                {users.map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.name} — {user.email}
                  </option>
                ))}
              </select>

              {errors.userId && (
                <span className="subscription-form-error">
                  {errors.userId}
                </span>
              )}
            </div>

            <div className="subscription-form-group">
              <label htmlFor="subscription-plan">
                Plan
              </label>

              <select
                id="subscription-plan"
                name="planId"
                value={formData.planId}
                onChange={handleChange}
              >
                <option value="">
                  Select plan
                </option>

                {plans.map((plan) => (
                  <option
                    key={plan.id}
                    value={plan.id}
                  >
                    {plan.name} — ₹{plan.price}
                  </option>
                ))}
              </select>

              {errors.planId && (
                <span className="subscription-form-error">
                  {errors.planId}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="subscription-form-section">
          <div className="subscription-section-title">
            Subscription Period
          </div>

          <div className="subscription-form-grid">
            <div className="subscription-form-group">
              <label htmlFor="subscription-start">
                Start Date
              </label>

              <input
                id="subscription-start"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
              />

              {errors.startDate && (
                <span className="subscription-form-error">
                  {errors.startDate}
                </span>
              )}
            </div>

            <div className="subscription-form-group">
              <label htmlFor="subscription-renewal">
                Renewal Date
              </label>

              <input
                id="subscription-renewal"
                name="renewalDate"
                type="date"
                value={formData.renewalDate}
                onChange={handleChange}
              />

              {errors.renewalDate && (
                <span className="subscription-form-error">
                  {errors.renewalDate}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="subscription-form-section">
          <div className="subscription-section-title">
            Billing Details
          </div>

          <div className="subscription-form-grid">
            <div className="subscription-form-group">
              <label htmlFor="subscription-status">
                Subscription Status
              </label>

              <select
                id="subscription-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
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

              {errors.status && (
                <span className="subscription-form-error">
                  {errors.status}
                </span>
              )}
            </div>

            <div className="subscription-form-group">
              <label htmlFor="subscription-payment">
                Payment Status
              </label>

              <select
                id="subscription-payment"
                name="paymentStatus"
                value={formData.paymentStatus}
                onChange={handleChange}
              >
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

              {errors.paymentStatus && (
                <span className="subscription-form-error">
                  {errors.paymentStatus}
                </span>
              )}
            </div>
          </div>

          <div className="subscription-form-group subscription-amount-group">
            <label htmlFor="subscription-amount">
              Amount
            </label>

            <div className="subscription-amount-input">
              <span>₹</span>

              <input
                id="subscription-amount"
                name="amount"
                type="number"
                min="0"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0"
              />
            </div>

            {errors.amount && (
              <span className="subscription-form-error">
                {errors.amount}
              </span>
            )}
          </div>
        </div>

        <div className="subscription-form-footer">
          <button
            type="button"
            className="subscription-cancel-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="subscription-submit-button"
          >
            {subscription
              ? "Update Subscription"
              : "Create Subscription"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default SubscriptionForm;