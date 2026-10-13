import { useMemo } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
  Wallet
} from "lucide-react";

import { useApp } from "../../context/AppContext";

import "./Dashboard.css";

function Dashboard() {
  const { state } = useApp();

  const users = state.users || [];
  const subscriptions = state.subscriptions || [];
  const plans = state.plans || [];

  const paidSubscriptions = useMemo(
    () =>
      subscriptions.filter(
        (subscription) =>
          subscription.paymentStatus === "Paid"
      ),
    [subscriptions]
  );

  const activeSubscriptions = useMemo(
    () =>
      subscriptions.filter(
        (subscription) =>
          subscription.status === "Active"
      ),
    [subscriptions]
  );

  const totalRevenue = useMemo(
    () =>
      paidSubscriptions.reduce(
        (total, subscription) =>
          total + Number(subscription.amount || 0),
        0
      ),
    [paidSubscriptions]
  );

  const activeRate =
    subscriptions.length > 0
      ? Math.round(
          (activeSubscriptions.length /
            subscriptions.length) *
            100
        )
      : 0;

  const revenueByMonth = useMemo(() => {
    const months = [];
    const today = new Date();

    for (let index = 5; index >= 0; index -= 1) {
      const date = new Date(
        today.getFullYear(),
        today.getMonth() - index,
        1
      );

      months.push({
        key: `${date.getFullYear()}-${String(
          date.getMonth() + 1
        ).padStart(2, "0")}`,
        label: date.toLocaleDateString("en-IN", {
          month: "short"
        }),
        value: 0
      });
    }

    paidSubscriptions.forEach((subscription) => {
      const date = new Date(
        subscription.createdAt ||
          subscription.startDate
      );

      const key = `${date.getFullYear()}-${String(
        date.getMonth() + 1
      ).padStart(2, "0")}`;

      const month = months.find(
        (item) => item.key === key
      );

      if (month) {
        month.value += Number(
          subscription.amount || 0
        );
      }
    });

    return months;
  }, [paidSubscriptions]);

  const maxRevenue = Math.max(
    ...revenueByMonth.map((month) => month.value),
    1
  );

  const topPlans = useMemo(() => {
    return plans
      .map((plan) => {
        const planSubscriptions =
          subscriptions.filter(
            (subscription) =>
              subscription.planId === plan.id
          );

        const revenue =
          planSubscriptions
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
          ...plan,
          subscribers:
            planSubscriptions.length,
          revenue
        };
      })
      .sort(
        (first, second) =>
          second.subscribers -
          first.subscribers
      );
  }, [plans, subscriptions]);

  const recentSubscriptions = useMemo(
    () =>
      [...subscriptions]
        .sort(
          (first, second) =>
            new Date(
              second.createdAt ||
                second.startDate
            ) -
            new Date(
              first.createdAt ||
                first.startDate
            )
        )
        .slice(0, 5),
    [subscriptions]
  );

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

  function getStatusClass(status) {
    return status
      .toLowerCase()
      .replace(/\s+/g, "-");
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-hero">
        <div>
          <span className="dashboard-eyebrow">
            BUSINESS OVERVIEW
          </span>

          <h1>
            Welcome back
          </h1>

          <p>
            Monitor your SaaS business,
            subscriptions and revenue from
            one workspace.
          </p>
        </div>

        <div className="dashboard-live">
          <span />
          Live overview
        </div>
      </div>

      <div className="dashboard-kpi-grid">
        <div className="dashboard-kpi-card">
          <div className="dashboard-kpi-icon">
            <Users size={20} />
          </div>

          <div>
            <span>Total Users</span>
            <strong>{users.length}</strong>

            <small>
              Registered accounts
            </small>
          </div>
        </div>

        <div className="dashboard-kpi-card">
          <div className="dashboard-kpi-icon">
            <CreditCard size={20} />
          </div>

          <div>
            <span>Subscriptions</span>
            <strong>
              {subscriptions.length}
            </strong>

            <small>
              {activeSubscriptions.length} active
            </small>
          </div>
        </div>

        <div className="dashboard-kpi-card">
          <div className="dashboard-kpi-icon">
            <DollarSign size={20} />
          </div>

          <div>
            <span>Total Revenue</span>
            <strong>
              {formatCurrency(totalRevenue)}
            </strong>

            <small>
              From paid subscriptions
            </small>
          </div>
        </div>

        <div className="dashboard-kpi-card">
          <div className="dashboard-kpi-icon">
            <Activity size={20} />
          </div>

          <div>
            <span>Active Rate</span>
            <strong>{activeRate}%</strong>

            <small>
              Subscription health
            </small>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="dashboard-panel revenue-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-panel-label">
                REVENUE PERFORMANCE
              </span>

              <h2>
                Revenue Overview
              </h2>

              <p>
                Paid subscription revenue
                over the last 6 months.
              </p>
            </div>

            <div className="dashboard-trend">
              <ArrowUpRight size={15} />
              Live
            </div>
          </div>

          <div className="dashboard-chart">
            <div className="dashboard-chart-values">
              {revenueByMonth.map(
                (month) => (
                  <div
                    className="dashboard-chart-column"
                    key={month.key}
                  >
                    <span>
                      {formatCurrency(
                        month.value
                      )}
                    </span>

                    <div className="dashboard-bar-area">
                      <div
                        className="dashboard-bar"
                        style={{
                          height: `${
                            month.value === 0
                              ? 8
                              : Math.max(
                                  (month.value /
                                    maxRevenue) *
                                    100,
                                  12
                                )
                          }%`
                        }}
                      />
                    </div>

                    <small>
                      {month.label}
                    </small>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div className="dashboard-panel health-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-panel-label">
                SUBSCRIPTION HEALTH
              </span>

              <h2>
                Subscription Status
              </h2>
            </div>

            <Wallet size={20} />
          </div>

          <div className="dashboard-health">
            <div className="health-circle">
              <strong>
                {activeRate}%
              </strong>

              <span>
                Active
              </span>
            </div>

            <div className="health-list">
              <div>
                <span>
                  <i className="status-dot active" />
                  Active
                </span>

                <strong>
                  {activeSubscriptions.length}
                </strong>
              </div>

              <div>
                <span>
                  <i className="status-dot trial" />
                  Trial
                </span>

                <strong>
                  {
                    subscriptions.filter(
                      (subscription) =>
                        subscription.status ===
                        "Trial"
                    ).length
                  }
                </strong>
              </div>

              <div>
                <span>
                  <i className="status-dot cancelled" />
                  Cancelled
                </span>

                <strong>
                  {
                    subscriptions.filter(
                      (subscription) =>
                        subscription.status ===
                        "Cancelled"
                    ).length
                  }
                </strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-bottom-grid">
        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-panel-label">
                PLAN PERFORMANCE
              </span>

              <h2>
                Top Plans
              </h2>

              <p>
                Plans ranked by subscribers.
              </p>
            </div>

            <ArrowUpRight size={19} />
          </div>

          <div className="dashboard-plan-list">
            {topPlans.length === 0 ? (
              <div className="dashboard-empty">
                <CreditCard size={22} />
                <span>
                  No plan data available
                </span>
              </div>
            ) : (
              topPlans
                .slice(0, 4)
                .map((plan, index) => (
                  <div
                    className="dashboard-plan-row"
                    key={plan.id}
                  >
                    <div className="plan-rank">
                      {index + 1}
                    </div>

                    <div className="plan-info">
                      <strong>
                        {plan.name}
                      </strong>

                      <span>
                        {plan.subscribers}{" "}
                        subscriber
                        {plan.subscribers !== 1
                          ? "s"
                          : ""}
                      </span>
                    </div>

                    <div className="plan-revenue">
                      <strong>
                        {formatCurrency(
                          plan.revenue
                        )}
                      </strong>

                      <span>
                        Revenue
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>

        <div className="dashboard-panel">
          <div className="dashboard-panel-header">
            <div>
              <span className="dashboard-panel-label">
                RECENT ACTIVITY
              </span>

              <h2>
                Recent Subscriptions
              </h2>

              <p>
                Latest subscription activity.
              </p>
            </div>

            <Activity size={19} />
          </div>

          <div className="dashboard-activity-list">
            {recentSubscriptions.length ===
            0 ? (
              <div className="dashboard-empty">
                <Activity size={22} />
                <span>
                  No recent activity
                </span>
              </div>
            ) : (
              recentSubscriptions.map(
                (subscription) => {
                  const user = getUser(
                    subscription.userId
                  );

                  const plan = getPlan(
                    subscription.planId
                  );

                  return (
                    <div
                      className="dashboard-activity-row"
                      key={subscription.id}
                    >
                      <div className="activity-avatar">
                        {user?.name
                          ?.charAt(0)
                          .toUpperCase() || "U"}
                      </div>

                      <div className="activity-info">
                        <strong>
                          {user?.name ||
                            "Unknown user"}
                        </strong>

                        <span>
                          {plan?.name ||
                            "Unknown plan"}{" "}
                          ·{" "}
                          {formatDate(
                            subscription.startDate
                          )}
                        </span>
                      </div>

                      <span
                        className={`dashboard-status ${getStatusClass(
                          subscription.status
                        )}`}
                      >
                        {subscription.status}
                      </span>
                    </div>
                  );
                }
              )
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-summary-strip">
        <div>
          <span>
            Paid subscriptions
          </span>

          <strong>
            {paidSubscriptions.length}
          </strong>
        </div>

        <div>
          <span>
            Available plans
          </span>

          <strong>
            {plans.length}
          </strong>
        </div>

        <div>
          <span>
            Average paid revenue
          </span>

          <strong>
            {formatCurrency(
              paidSubscriptions.length
                ? totalRevenue /
                    paidSubscriptions.length
                : 0
            )}
          </strong>
        </div>

        <div>
          <span>
            Business health
          </span>

          <strong className="health-positive">
            {activeRate >= 60
              ? "Healthy"
              : "Needs attention"}
          </strong>
        </div>
      </div>
    </section>
  );
}

export default Dashboard;