import { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";

import Modal from "../common/Modal";

import "./PlanForm.css";

const initialForm = {
  name: "",
  description: "",
  price: "",
  billingCycle: "Monthly",
  status: "Active",
  features: []
};

function PlanForm({
  open,
  plan,
  onClose,
  onSubmit
}) {
  const [formData, setFormData] = useState(initialForm);
  const [featureInput, setFeatureInput] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (plan) {
      setFormData({
        name: plan.name || "",
        description: plan.description || "",
        price: plan.price ?? "",
        billingCycle: plan.billingCycle || "Monthly",
        status: plan.status || "Active",
        features: plan.features || []
      });
    } else {
      setFormData(initialForm);
    }

    setFeatureInput("");
    setErrors({});
  }, [plan, open]);

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

  function addFeature() {
    const value = featureInput.trim();

    if (!value) {
      return;
    }

    if (formData.features.includes(value)) {
      setFeatureInput("");
      return;
    }

    setFormData((current) => ({
      ...current,
      features: [...current.features, value]
    }));

    setFeatureInput("");
  }

  function removeFeature(featureToRemove) {
    setFormData((current) => ({
      ...current,
      features: current.features.filter(
        (feature) => feature !== featureToRemove
      )
    }));
  }

  function handleFeatureKeyDown(event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addFeature();
    }
  }

  function validate() {
    const nextErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = "Plan name is required.";
    } else if (formData.name.trim().length < 2) {
      nextErrors.name =
        "Plan name must contain at least 2 characters.";
    }

    if (!formData.description.trim()) {
      nextErrors.description =
        "Description is required.";
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      nextErrors.price =
        "Enter a valid price.";
    }

    if (!formData.billingCycle) {
      nextErrors.billingCycle =
        "Select a billing cycle.";
    }

    if (!formData.status) {
      nextErrors.status =
        "Select a status.";
    }

    if (formData.features.length === 0) {
      nextErrors.features =
        "Add at least one feature.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: Number(formData.price),
      billingCycle: formData.billingCycle,
      status: formData.status,
      features: formData.features
    });
  }

  return (
    <Modal
      open={open}
      title={plan ? "Edit Plan" : "Create Plan"}
      description={
        plan
          ? "Update the subscription plan details."
          : "Create a new subscription plan."
      }
      onClose={onClose}
      size="medium"
    >
      <form
        className="plan-form"
        onSubmit={handleSubmit}
      >
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="plan-name">
              Plan Name
            </label>

            <input
              id="plan-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter plan name"
            />

            {errors.name && (
              <span className="form-error">
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="plan-price">
              Price
            </label>

            <input
              id="plan-price"
              name="price"
              type="number"
              min="0"
              value={formData.price}
              onChange={handleChange}
              placeholder="Enter price"
            />

            {errors.price && (
              <span className="form-error">
                {errors.price}
              </span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="plan-description">
            Description
          </label>

          <textarea
            id="plan-description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe this subscription plan"
          />

          {errors.description && (
            <span className="form-error">
              {errors.description}
            </span>
          )}
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="plan-billing">
              Billing Cycle
            </label>

            <select
              id="plan-billing"
              name="billingCycle"
              value={formData.billingCycle}
              onChange={handleChange}
            >
              <option value="Monthly">
                Monthly
              </option>

              <option value="Yearly">
                Yearly
              </option>
            </select>

            {errors.billingCycle && (
              <span className="form-error">
                {errors.billingCycle}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="plan-status">
              Status
            </label>

            <select
              id="plan-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>

            {errors.status && (
              <span className="form-error">
                {errors.status}
              </span>
            )}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="plan-feature">
            Features
          </label>

          <div className="feature-input-row">
            <input
              id="plan-feature"
              type="text"
              value={featureInput}
              onChange={(event) =>
                setFeatureInput(event.target.value)
              }
              onKeyDown={handleFeatureKeyDown}
              placeholder="Add a feature"
            />

            <button
              type="button"
              className="secondary-button"
              onClick={addFeature}
            >
              <Plus size={15} />
              Add
            </button>
          </div>

          {formData.features.length > 0 && (
            <div className="feature-chip-list">
              {formData.features.map((feature) => (
                <span
                  className="feature-chip"
                  key={feature}
                >
                  {feature}

                  <button
                    type="button"
                    onClick={() =>
                      removeFeature(feature)
                    }
                    aria-label={`Remove ${feature}`}
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {errors.features && (
            <span className="form-error">
              {errors.features}
            </span>
          )}
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="primary-button"
          >
            {plan ? "Update Plan" : "Create Plan"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default PlanForm;