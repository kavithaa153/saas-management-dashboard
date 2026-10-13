import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CreditCard,
  DollarSign,
  TrendingUp,
  Wallet
} from "lucide-react";
import "./RevenueAnalytics.css";
import { useApp } from "../../context/AppContext";

import "./RevenueAnalytics.css";

function RevenueAnalytics() {
  const { state } = useApp();

  const plans = state.plans || [];
  const subscriptions = state.subscriptions || [];

  const [period, setPeriod] =
    useState("6");

  const paidSubscriptions = useMemo(
    () =>
      subscriptions.filter(
        (subscription) =>
          subscription.paymentStatus === "Paid"
      ),
    [subscriptions]
  );

  const totalRevenue = useMemo(
    () =>
      paidSubscriptions.reduce(
        (total, subscription) =>
          total +
          Number(subscription.amount || 0),
        0
      ),
    [paidSubscriptions]
  );

  const activeRevenue = useMemo(
    () =>
      paidSubscriptions
        .filter(
          (subscription) =>
            subscription.status === "Active"
        )
        .reduce(
          (total, subscription) =>
            total +
            Number(subscription.amount || 0),
          0
        ),
    [paidSubscriptions]
  );

  const averageRevenue =
    paidSubscriptions.length > 0
      ? totalRevenue / paidSubscriptions.length
      : 0;

  const revenueByPlan = useMemo(() => {
    return plans
      .map((plan) => {
        const planSubscriptions =
          paidSubscriptions.filter(
            (subscription) =>
              subscription.planId === plan.id
          );

        const revenue =
          planSubscriptions.reduce(
            (total, subscription) =>
              total +
              Number(subscription.amount || 0),
            0
          );

        const subscribers =
          planSubscriptions.length;

        return {
          id: plan.id,
          name: plan.name,
          revenue,
          subscribers
        };
      })
      .filter(
        (plan) =>
          plan.revenue > 0 ||
          plan.subscribers > 0
      )
      .sort(
        (a, b) =>
          b.revenue - a.revenue
      );
  }, [plans, paidSubscriptions]);

  const monthlyRevenue = useMemo(() => {
    const months = [];
    const monthCount = Number(period);

    for (
      let index = monthCount - 1;
      index >= 0;
      index -= 1
    ) {
      const date = new Date();

      date.setMonth(
        date.getMonth() - index
      );

      const monthIndex =
        date.getMonth();

      const year =
        date.getFullYear();

      const revenue =
        paidSubscriptions
          .filter((subscription) => {
            const subscriptionDate =
              new Date(
                subscription.createdAt ||
                  subscription.startDate
              );

            return (
              subscriptionDate.getMonth() ===
                monthIndex &&
              subscriptionDate.getFullYear() ===
                year
            );
          })
          .reduce(
            (total, subscription) =>
              total +
              Number(subscription.amount || 0),
            0
          );

      months.push({
        month: date.toLocaleString(
          "en-US",
          {
            month: "short"
          }
        ),
        revenue
      });
    }

    return months;
  }, [paidSubscriptions, period]);

  const maxRevenue = Math.max(
    ...monthlyRevenue.map(
      (item) => item.revenue
    ),
    1
  );

  const currentRevenue =
    monthlyRevenue[
      monthlyRevenue.length - 1
    ]?.revenue || 0;

  const previousRevenue =
    monthlyRevenue[
      monthlyRevenue.length - 2
    ]?.revenue || 0;

  const revenueGrowth =
    previousRevenue > 0
      ? Math.round(
          ((currentRevenue -
            previousRevenue) /
            previousRevenue) *
            100
        )
      : 0;

  const planTotalRevenue =
    revenueByPlan.reduce(
      (total, plan) =>
        total + plan.revenue,
      0
    );

  function formatCurrency(value) {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
      }
    ).format(Number(value || 0));
  }

  function getShare(revenue) {
    if (planTotalRevenue === 0) {
      return 0;
    }

    return Math.round(
      (revenue / planTotalRevenue) *
        100
    );
  }

  return (
    <section className="revenue-page">
      <div className="revenue-hero">
        <div className="revenue-hero-content">
          <span className="revenue-eyebrow">
            Revenue Intelligence
          </span>

          <h1>Revenue Analytics</h1>

          <p>
            Track subscription revenue,
            plan performance and business
            growth from one workspace.
          </p>
        </div>

        <div className="revenue-period-control">
          <CalendarDays size={16} />

          <select
            value={period}
            onChange={(event) =>
              setPeriod(event.target.value)
            }
          >
            <option value="6">
              Last 6 months
            </option>

            <option value="12">
              Last 12 months
            </option>
          </select>
        </div>
      </div>

      <div className="revenue-kpi-grid">
        <div className="revenue-kpi-card">
          <div className="revenue-kpi-icon">
            <DollarSign size={20} />
          </div>

          <div className="revenue-kpi-content">
            <span>Total Revenue</span>

            <strong>
              {formatCurrency(
                totalRevenue
              )}
            </strong>

            <small>
              All paid subscriptions
            </small>
          </div>
        </div>

        <div className="revenue-kpi-card">
          <div className="revenue-kpi-icon">
            <TrendingUp size={20} />
          </div>

          <div className="revenue-kpi-content">
            <span>Active Revenue</span>

            <strong>
              {formatCurrency(
                activeRevenue
              )}
            </strong>

            <small>
              From active subscriptions
            </small>
          </div>
        </div>

        <div className="revenue-kpi-card">
          <div className="revenue-kpi-icon">
            <CreditCard size={20} />
          </div>

          <div className="revenue-kpi-content">
            <span>Paid Subscriptions</span>

            <strong>
              {paidSubscriptions.length}
            </strong>

            <small>
              Successfully paid
            </small>
          </div>
        </div>

        <div className="revenue-kpi-card">
          <div className="revenue-kpi-icon">
            <Wallet size={20} />
          </div>

          <div className="revenue-kpi-content">
            <span>Average Revenue</span>

            <strong>
              {formatCurrency(
                averageRevenue
              )}
            </strong>

            <small>
              Per paid subscription
            </small>
          </div>
        </div>
      </div>

      <div className="revenue-main-grid">
        <div className="revenue-card revenue-chart-card">
          <div className="revenue-card-header">
            <div>
              <span className="revenue-card-label">
                Revenue Performance
              </span>

              <h2>
                Revenue Trend
              </h2>

              <p>
                Actual paid subscription
                revenue by month.
              </p>
            </div>

            <div
              className={`revenue-growth ${
                revenueGrowth >= 0
                  ? "positive"
                  : "negative"
              }`}
            >
              {revenueGrowth >= 0 ? (
                <ArrowUpRight size={14} />
              ) : (
                <ArrowDownRight size={14} />
              )}

              {Math.abs(
                revenueGrowth
              )}%
            </div>
          </div>

          <div className="revenue-chart">
            <div className="revenue-y-axis">
              <span>
                {formatCurrency(
                  maxRevenue
                )}
              </span>

              <span>
                {formatCurrency(
                  maxRevenue * 0.75
                )}
              </span>

              <span>
                {formatCurrency(
                  maxRevenue * 0.5
                )}
              </span>

              <span>
                {formatCurrency(
                  maxRevenue * 0.25
                )}
              </span>

              <span>₹0</span>
            </div>

            <div className="revenue-chart-area">
              <div className="revenue-grid-lines">
                <span />
                <span />
                <span />
                <span />
                <span />
              </div>

              <div className="revenue-bars">
                {monthlyRevenue.map(
                  (item) => {
                    const height =
                      item.revenue > 0
                        ? Math.max(
                            (item.revenue /
                              maxRevenue) *
                              100,
                            4
                          )
                        : 3;

                    return (
                      <div
                        className="revenue-bar-column"
                        key={`${item.month}-${item.revenue}`}
                      >
                        <div className="revenue-bar-value">
                          {item.revenue > 0
                            ? formatCurrency(
                                item.revenue
                              )
                            : "₹0"}
                        </div>

                        <div className="revenue-bar-track">
                          <div
                            className="revenue-bar"
                            style={{
                              height: `${height}%`
                            }}
                          />
                        </div>

                        <span>
                          {item.month}
                        </span>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="revenue-card revenue-breakdown-card">
          <div className="revenue-card-header">
            <div>
              <span className="revenue-card-label">
                Revenue Breakdown
              </span>

              <h2>
                By Plan
              </h2>

              <p>
                Revenue contribution by
                subscription plan.
              </p>
            </div>

            <BarChart3 size={19} />
          </div>

          <div className="revenue-breakdown-list">
            {revenueByPlan.length > 0 ? (
              revenueByPlan.map(
                (plan) => {
                  const share =
                    getShare(
                      plan.revenue
                    );

                  return (
                    <div
                      className="revenue-breakdown-item"
                      key={plan.id}
                    >
                      <div className="revenue-breakdown-top">
                        <div>
                          <strong>
                            {plan.name}
                          </strong>

                          <span>
                            {
                              plan.subscribers
                            }{" "}
                            paid subscriber
                            {plan.subscribers !==
                            1
                              ? "s"
                              : ""}
                          </span>
                        </div>

                        <strong>
                          {share}%
                        </strong>
                      </div>

                      <div className="revenue-progress">
                        <div
                          style={{
                            width: `${share}%`
                          }}
                        />
                      </div>

                      <div className="revenue-breakdown-bottom">
                        <span>
                          Revenue
                        </span>

                        <strong>
                          {formatCurrency(
                            plan.revenue
                          )}
                        </strong>
                      </div>
                    </div>
                  );
                }
              )
            ) : (
              <div className="revenue-empty-small">
                <BarChart3 size={24} />

                <strong>
                  No revenue data
                </strong>

                <span>
                  Paid subscriptions will
                  appear here.
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="revenue-card revenue-plan-card">
        <div className="revenue-card-header">
          <div>
            <span className="revenue-card-label">
              Plan Performance
            </span>

            <h2>
              Revenue by Plan
            </h2>

            <p>
              Compare subscribers and
              revenue contribution.
            </p>
          </div>
        </div>

        {revenueByPlan.length > 0 ? (
          <>
            <div className="revenue-plan-table-wrapper">
              <table className="revenue-plan-table">
                <thead>
                  <tr>
                    <th>Plan</th>
                    <th>Subscribers</th>
                    <th>Revenue</th>
                    <th>Share</th>
                    <th>Performance</th>
                  </tr>
                </thead>

                <tbody>
                  {revenueByPlan.map(
                    (plan) => {
                      const share =
                        getShare(
                          plan.revenue
                        );

                      return (
                        <tr
                          key={plan.id}
                        >
                          <td>
                            <div className="revenue-plan-name">
                              <div className="revenue-plan-icon">
                                <Wallet
                                  size={16}
                                />
                              </div>

                              <strong>
                                {plan.name}
                              </strong>
                            </div>
                          </td>

                          <td>
                            {
                              plan.subscribers
                            }
                          </td>

                          <td>
                            <strong>
                              {formatCurrency(
                                plan.revenue
                              )}
                            </strong>
                          </td>

                          <td>
                            <span className="revenue-share-badge">
                              {share}%
                            </span>
                          </td>

                          <td>
                            <div className="revenue-table-progress">
                              <div>
                                <span
                                  style={{
                                    width: `${share}%`
                                  }}
                                />
                              </div>

                              <small>
                                {share}%
                              </small>
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            <div className="revenue-mobile-plans">
              {revenueByPlan.map(
                (plan) => {
                  const share =
                    getShare(
                      plan.revenue
                    );

                  return (
                    <div
                      className="revenue-mobile-plan"
                      key={plan.id}
                    >
                      <div className="revenue-mobile-plan-top">
                        <div className="revenue-plan-name">
                          <div className="revenue-plan-icon">
                            <Wallet
                              size={16}
                            />
                          </div>

                          <strong>
                            {plan.name}
                          </strong>
                        </div>

                        <span className="revenue-share-badge">
                          {share}%
                        </span>
                      </div>

                      <div className="revenue-mobile-plan-info">
                        <div>
                          <span>
                            Subscribers
                          </span>

                          <strong>
                            {
                              plan.subscribers
                            }
                          </strong>
                        </div>

                        <div>
                          <span>
                            Revenue
                          </span>

                          <strong>
                            {formatCurrency(
                              plan.revenue
                            )}
                          </strong>
                        </div>
                      </div>

                      <div className="revenue-progress">
                        <div
                          style={{
                            width: `${share}%`
                          }}
                        />
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        ) : (
          <div className="revenue-empty">
            <div className="revenue-empty-icon">
              <Wallet size={25} />
            </div>

            <h3>
              No revenue records
            </h3>

            <p>
              Create a paid subscription to
              start tracking revenue.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default RevenueAnalytics;