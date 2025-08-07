const validator = require("validator");

const validateUser = (user) => {
  const errors = {};

  if (!user.FullName || user.FullName.length < 5 || user.FullName.length > 50) {
    errors.FullName = "Full Name must be between 5 and 50 characters.";
  }

  if (!user.emailId || !validator.isEmail(user.emailId)) {
    errors.emailId = "Invalid email address.";
  }

  if (!user.password || !validator.isStrongPassword(user.password)) {
    errors.password = "Password must be strong.";
  }

  if (user.age < 12) {
    errors.age = "Age must be at least 12.";
  }

  if (!user.address || user.address.length < 5 || user.address.length > 100) {
    errors.address = "Address must be between 5 and 100 characters.";
  }
  if (user.phone && !validator.isMobilePhone(user.phone.toString(), "any")) {
    errors.phone = "Invalid phone number.";
  }

  if (user.role && !["user", "admin"].includes(user.role)) {
    errors.role = "Role must be either 'user' or 'admin'.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// utils/validateProductInput.js
const validateProductInput = (body) => {
  const errors = {};

  if (!body.ProductName?.trim()) {
    errors.ProductName = "Product name is required";
  } else if (body.ProductName.length < 3 || body.ProductName.length > 50) {
    errors.ProductName = "Product name must be between 3 and 50 characters";
  }

  if (!body.description?.trim()) {
    errors.description = "Description is required";
  } else if (body.description.length < 10 || body.description.length > 500) {
    errors.description = "Description must be between 10 and 500 characters";
  }

  if (!body.price && body.price !== 0) {
    errors.price = "Price is required";
  } else if (isNaN(body.price)) {
    errors.price = "Price must be a number";
  }

  if (!body.stock && body.stock !== 0) {
    errors.stock = "Stock is required";
  } else if (isNaN(body.stock)) {
    errors.stock = "Stock must be a number";
  }

  if (!body.category?.trim()) {
    errors.category = "Category is required";
  } else if (
    !["furniture", "handbag", "books", "tech", "sneakers", "travel"].includes(
      body.category
    )
  ) {
    errors.category = "Invalid category";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};
const validateProductInputForEdit = (body) => {
  const errors = {};

  if (body.ProductName?.trim()) {
    if (body.ProductName.length < 3 || body.ProductName.length > 50) {
      errors.ProductName = "Product name must be between 3 and 50 characters";
    }
  }

  if (body.description?.trim()) {
    if (body.description.length < 10 || body.description.length > 500) {
      errors.description = "Description must be between 10 and 500 characters";
    }
  }

  if (body.price !== undefined) {
    if (body.price === "" || isNaN(body.price)) {
      errors.price = "Price must be a valid number";
    }
  }

  if (body.stock !== undefined) {
    if (body.stock === "" || isNaN(body.stock)) {
      errors.stock = "Stock must be a valid number";
    }
  }

  if (body.category?.trim()) {
    if (
      !["furniture", "handbag", "books", "tech", "sneakers", "travel"].includes(
        body.category
      )
    ) {
      errors.category = "Invalid category";
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
};

const validateEditProfileData = (req) => {
  const allowedEditFields = ["FullName", "age", "phone", "address", "photo"];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};
module.exports = {
  validateUser,
  validateEditProfileData,
  validateProductInput,
  validateProductInputForEdit
,
};
