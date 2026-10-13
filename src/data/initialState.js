import { initialUsers } from "./users";
import { initialPlans } from "./plans";
import { initialSubscriptions } from "./subscriptions";

export const initialState = {
  users: initialUsers,
  plans: initialPlans,
  subscriptions: initialSubscriptions,
  notifications: [],
  preferences: {
    theme: "light"
  }
};