export function validateUser(formData) {
  const errors = {};

  const name = formData.name.trim();
  const email = formData.email.trim();
  const company = formData.company.trim();

  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2) {
    errors.name = "Name must contain at least 2 characters.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  ) {
    errors.email = "Enter a valid email address.";
  }

  if (!company) {
    errors.company = "Company is required.";
  }

  if (!formData.role) {
    errors.role = "Select a role.";
  }

  if (!formData.status) {
    errors.status = "Select a status.";
  }

  return errors;
}