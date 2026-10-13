import {
  BarChart3,
  CreditCard,
  Download,
  FileText,
  TrendingUp,
  Users,
  Wallet
} from "lucide-react";

import { useApp } from "../../context/AppContext";
import { useToast } from "../../context/ToastContext";

import "./Reports.css";

function Reports() {
  const { state } = useApp();
  const { success } = useToast();

  const users = state.users || [];
  const plans = state.plans || [];
  const subscriptions =
    state.subscriptions || [];

  const paidSubscriptions =
    subscriptions.filter(
      (subscription) =>
        subscription.paymentStatus === "Paid"
    );

  const activeSubscriptions =
    subscriptions.filter(
      (subscription) =>
        subscription.status === "Active"
    );

  const trialSubscriptions =
    subscriptions.filter(
      (subscription) =>
        subscription.status === "Trial"
    );

  const cancelledSubscriptions =
    subscriptions.filter(
      (subscription) =>
        subscription.status === "Cancelled"
    );

  const totalRevenue =
    paidSubscriptions.reduce(
      (total, subscription) =>
        total +
        Number(subscription.amount || 0),
      0
    );

  const activeRate =
    subscriptions.length > 0
      ? Math.round(
          (activeSubscriptions.length /
            subscriptions.length) *
            100
        )
      : 0;

  function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount);
  }

  function exportReport() {
    const rows = [
      [
        "Plan",
        "Price",
        "Billing",
        "Status"
      ],
      ...plans.map((plan) => [
        plan.name,
        plan.price,
        plan.billingCycle,
        plan.status
      ])
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${value}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv"
    });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "saasflow-report.csv";

    link.click();

    URL.revokeObjectURL(url);

    success(
      "Report exported",
      "Your report was downloaded successfully."
    );
  }

  return (
    <section className="reports-page">

      <div className="reports-hero">

        <div>
          <span className="reports-eyebrow">
            BUSINESS REPORTING
          </span>

          <h1>
            Reports
          </h1>

          <p>
            Analyze customers, subscriptions,
            revenue and plan performance from
            one workspace.
          </p>
        </div>

        <button
          className="reports-export-button"
          onClick={exportReport}
        >
          <Download size={16} />
          Export Report
        </button>

      </div>

      <div className="reports-stat-grid">

        <div className="reports-stat-card">
          <div className="reports-stat-icon">
            <Users size={20} />
          </div>

          <span>
            Total Customers
          </span>

          <strong>
            {users.length}
          </strong>

          <small>
            Registered users
          </small>
        </div>

        <div className="reports-stat-card">
          <div className="reports-stat-icon">
            <CreditCard size={20} />
          </div>

          <span>
            Subscriptions
          </span>

          <strong>
            {subscriptions.length}
          </strong>

          <small>
            Total subscriptions
          </small>
        </div>

        <div className="reports-stat-card">
          <div className="reports-stat-icon">
            <Wallet size={20} />
          </div>

          <span>
            Paid Revenue
          </span>

          <strong>
            {formatCurrency(totalRevenue)}
          </strong>

          <small>
            Successfully paid
          </small>
        </div>

        <div className="reports-stat-card">
          <div className="reports-stat-icon">
            <TrendingUp size={20} />
          </div>

          <span>
            Active Rate
          </span>

          <strong>
            {activeRate}%
          </strong>

          <small>
            Subscription health
          </small>
        </div>

      </div>

      <div className="reports-grid">

        <div className="reports-card">

          <div className="reports-card-heading">
            <div>
              <span>
                SUBSCRIPTION OVERVIEW
              </span>

              <h2>
                Subscription Health
              </h2>

              <p>
                Current subscription status.
              </p>
            </div>

            <BarChart3 size={21} />
          </div>

          <div className="reports-health">

            <div className="reports-health-item">
              <div>
                <span className="health-dot active" />
                Active
              </div>

              <strong>
                {activeSubscriptions.length}
              </strong>
            </div>

            <div className="reports-progress">
              <div
                className="active-progress"
                style={{
                  width: `${
                    subscriptions.length
                      ? (activeSubscriptions.length /
                          subscriptions.length) *
                        100
                      : 0
                  }%`
                }}
              />
            </div>

            <div className="reports-health-item">
              <div>
                <span className="health-dot trial" />
                Trial
              </div>

              <strong>
                {trialSubscriptions.length}
              </strong>
            </div>

            <div className="reports-progress">
              <div
                className="trial-progress"
                style={{
                  width: `${
                    subscriptions.length
                      ? (trialSubscriptions.length /
                          subscriptions.length) *
                        100
                      : 0
                  }%`
                }}
              />
            </div>

            <div className="reports-health-item">
              <div>
                <span className="health-dot cancelled" />
                Cancelled
              </div>

              <strong>
                {cancelledSubscriptions.length}
              </strong>
            </div>

            <div className="reports-progress">
              <div
                className="cancelled-progress"
                style={{
                  width: `${
                    subscriptions.length
                      ? (cancelledSubscriptions.length /
                          subscriptions.length) *
                        100
                      : 0
                  }%`
                }}
              />
            </div>

          </div>
        </div>

        <div className="reports-card">

          <div className="reports-card-heading">
            <div>
              <span>
                PLAN OVERVIEW
              </span>

              <h2>
                Available Plans
              </h2>

              <p>
                Current subscription plans.
              </p>
            </div>

            <FileText size={21} />
          </div>

          <div className="reports-plan-list">

            {plans.length === 0 ? (
              <div className="reports-empty">
                No plans available
              </div>
            ) : (
              plans.map((plan) => (
                <div
                  className="reports-plan-row"
                  key={plan.id}
                >
                  <div className="reports-plan-icon">
                    {plan.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="reports-plan-info">
                    <strong>
                      {plan.name}
                    </strong>

                    <span>
                      {plan.billingCycle}
                    </span>
                  </div>

                  <div className="reports-plan-price">
                    <strong>
                      {formatCurrency(
                        plan.price
                      )}
                    </strong>

                    <span>
                      {plan.status}
                    </span>
                  </div>
                </div>
              ))
            )}

          </div>
        </div>

      </div>

      <div className="reports-card reports-table-card">

        <div className="reports-card-heading">
          <div>
            <span>
              REVENUE REPORT
            </span>

            <h2>
              Revenue by Plan
            </h2>

            <p>
              Revenue contribution from paid
              subscriptions.
            </p>
          </div>

          <Wallet size={21} />
        </div>

        <div className="reports-table-wrapper">

          <table className="reports-table">

            <thead>
              <tr>
                <th>
                  Plan
                </th>

                <th>
                  Subscribers
                </th>

                <th>
                  Revenue
                </th>

                <th>
                  Status
                </th>
              </tr>
            </thead>

            <tbody>

              {plans.map((plan) => {

                const planSubscriptions =
                  subscriptions.filter(
                    (subscription) =>
                      subscription.planId ===
                      plan.id
                  );

                const revenue =
                  planSubscriptions
                    .filter(
                      (subscription) =>
                        subscription.paymentStatus ===
                        "Paid"
                    )
                    .reduce(
                      (
                        total,
                        subscription
                      ) =>
                        total +
                        Number(
                          subscription.amount ||
                            0
                        ),
                      0
                    );

                return (
                  <tr key={plan.id}>

                    <td>
                      <div className="table-plan">
                        <div>
                          {plan.name
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <strong>
                          {plan.name}
                        </strong>
                      </div>
                    </td>

                    <td>
                      {planSubscriptions.length}
                    </td>

                    <td>
                      <strong className="table-revenue">
                        {formatCurrency(
                          revenue
                        )}
                      </strong>
                    </td>

                    <td>
                      <span
                        className={`table-status ${plan.status.toLowerCase()}`}
                      >
                        {plan.status}
                      </span>
                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

      </div>

    </section>
  );
}

export default Reports;