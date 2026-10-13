import { useMemo, useState } from "react";
import "./UsageAnalytics.css";
import {
  Activity,
  Users,
  HardDrive,
  Zap,
  TrendingUp,
  BarChart3
} from "lucide-react";

import { useApp } from "../../context/AppContext";

function UsageAnalytics() {
  const { state } = useApp();

  const users = state.users || [];
  const subscriptions = state.subscriptions || [];
  const plans = state.plans || [];

  const [period, setPeriod] = useState("30");

  const metrics = useMemo(() => {
    const activeUsers = users.filter(
      (user) => user.status === "Active"
    ).length;

    const activeSubscriptions =
      subscriptions.filter(
        (subscription) =>
          subscription.status === "Active"
      ).length;

    const trialSubscriptions =
      subscriptions.filter(
        (subscription) =>
          subscription.status === "Trial"
      ).length;

    const totalUsers = users.length;

    const usageRate =
      totalUsers > 0
        ? Math.round(
            (activeUsers / totalUsers) * 100
          )
        : 0;

    const subscriptionRate =
      totalUsers > 0
        ? Math.round(
            (activeSubscriptions / totalUsers) *
              100
          )
        : 0;

    return {
      activeUsers,
      activeSubscriptions,
      trialSubscriptions,
      totalUsers,
      usageRate,
      subscriptionRate
    };
  }, [users, subscriptions]);

  const planUsage = useMemo(() => {
    return plans.map((plan) => {
      const planSubscriptions =
        subscriptions.filter(
          (subscription) =>
            subscription.planId === plan.id
        );

      const active =
        planSubscriptions.filter(
          (subscription) =>
            subscription.status === "Active"
        ).length;

      const trial =
        planSubscriptions.filter(
          (subscription) =>
            subscription.status === "Trial"
        ).length;

      const total = planSubscriptions.length;

      return {
        ...plan,
        active,
        trial,
        total
      };
    });
  }, [plans, subscriptions]);

  const activityData = [
    {
      label: "Week 1",
      value: 42
    },
    {
      label: "Week 2",
      value: 58
    },
    {
      label: "Week 3",
      value: 71
    },
    {
      label: "Week 4",
      value: 86
    },
    {
      label: "Week 5",
      value: 94
    },
    {
      label: "Week 6",
      value: 108
    }
  ];

  const maxActivity = Math.max(
    ...activityData.map((item) => item.value),
    1
  );

  return (
    <div className="plans-page">
      <div className="page-heading">
        <div>
          <span className="page-eyebrow">
            PRODUCT ANALYTICS
          </span>

          <h1>Usage Analytics</h1>

          <p>
            Monitor user activity, subscription
            usage and product engagement.
          </p>
        </div>

        <select
          className="analytics-period"
          value={period}
          onChange={(event) =>
            setPeriod(event.target.value)
          }
        >
          <option value="7">
            Last 7 days
          </option>

          <option value="30">
            Last 30 days
          </option>

          <option value="90">
            Last 90 days
          </option>
        </select>
      </div>

      <div className="plans-stat-grid">
        <div className="plans-stat-card">
          <div>
            <span>Active Users</span>
            <strong>
              {metrics.activeUsers}
            </strong>
          </div>

          <div className="plans-stat-icon blue">
            <Users size={18} />
          </div>
        </div>

        <div className="plans-stat-card">
          <div>
            <span>Active Subscriptions</span>
            <strong>
              {metrics.activeSubscriptions}
            </strong>
          </div>

          <div className="plans-stat-icon green">
            <Activity size={18} />
          </div>
        </div>

        <div className="plans-stat-card">
          <div>
            <span>Trial Accounts</span>
            <strong>
              {metrics.trialSubscriptions}
            </strong>
          </div>

          <div className="plans-stat-icon orange">
            <Zap size={18} />
          </div>
        </div>

        <div className="plans-stat-card">
          <div>
            <span>Usage Rate</span>
            <strong>
              {metrics.usageRate}%
            </strong>
          </div>

          <div className="plans-stat-icon purple">
            <TrendingUp size={18} />
          </div>
        </div>
      </div>

      <div className="analytics-grid">
        <div className="plans-card analytics-chart-card">
          <div className="analytics-card-header">
            <div>
              <span className="analytics-label">
                USER ACTIVITY
              </span>

              <h2>Product Usage Trend</h2>

              <p>
                Active usage across the selected
                period.
              </p>
            </div>

            <BarChart3 size={20} />
          </div>

          <div className="usage-chart">
            {activityData.map((item) => (
              <div
                className="usage-bar-column"
                key={item.label}
              >
                <div className="usage-bar-value">
                  {item.value}
                </div>

                <div className="usage-bar-track">
                  <div
                    className="usage-bar"
                    style={{
                      height: `${
                        (item.value /
                          maxActivity) *
                        100
                      }%`
                    }}
                  />
                </div>

                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="plans-card analytics-summary-card">
          <div className="analytics-card-header">
            <div>
              <span className="analytics-label">
                ENGAGEMENT
              </span>

              <h2>Usage Summary</h2>
            </div>

            <Activity size={20} />
          </div>

          <div className="usage-summary">
            <div className="usage-summary-row">
              <div>
                <span>Active user rate</span>

                <strong>
                  {metrics.usageRate}%
                </strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${metrics.usageRate}%`
                  }}
                />
              </div>
            </div>

            <div className="usage-summary-row">
              <div>
                <span>Subscription rate</span>

                <strong>
                  {metrics.subscriptionRate}%
                </strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${metrics.subscriptionRate}%`
                  }}
                />
              </div>
            </div>

            <div className="usage-summary-row">
              <div>
                <span>Trial conversion base</span>

                <strong>
                  {metrics.trialSubscriptions}
                </strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      metrics.totalUsers
                        ? Math.min(
                            100,
                            (metrics.trialSubscriptions /
                              metrics.totalUsers) *
                              100
                          )
                        : 0
                    }%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="plans-card">
        <div className="analytics-card-header">
          <div>
            <span className="analytics-label">
              PLAN USAGE
            </span>

            <h2>Usage by Plan</h2>

            <p>
              Understand which subscription plans
              are being actively used.
            </p>
          </div>

          <HardDrive size={20} />
        </div>

        <div className="plans-table-wrapper">
          <table className="plans-table">
            <thead>
              <tr>
                <th>Plan</th>
                <th>Price</th>
                <th>Total Subscribers</th>
                <th>Active</th>
                <th>Trial</th>
                <th>Usage Share</th>
              </tr>
            </thead>

            <tbody>
              {planUsage.map((plan) => {
                const share =
                  subscriptions.length > 0
                    ? Math.round(
                        (plan.total /
                          subscriptions.length) *
                          100
                      )
                    : 0;

                return (
                  <tr key={plan.id}>
                    <td>
                      <div className="plan-cell">
                        <div className="plan-icon">
                          <HardDrive size={16} />
                        </div>

                        <div>
                          <strong>
                            {plan.name}
                          </strong>

                          <span>
                            {plan.billingCycle}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      ₹
                      {Number(
                        plan.price
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>{plan.total}</td>

                    <td>{plan.active}</td>

                    <td>{plan.trial}</td>

                    <td>
                      <div className="analytics-share">
                        <div className="progress-track">
                          <div
                            className="progress-fill"
                            style={{
                              width: `${share}%`
                            }}
                          />
                        </div>

                        <span>{share}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default UsageAnalytics;