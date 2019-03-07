const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  //   for validator to work it needs to read as an empty string.
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";
  //   password 2 is for confirm password
  data.password2 = !isEmpty(data.password2) ? data.password2 : "";

  if (!validator.isLength(data.name, { min: 2, max: 30 })) {
    errors.name = "name must be 2 and 30 characters";
  }
  if (validator.isEmpty(data.name)) {
    errors.name = "name field is required";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "email field is required";
  }
  if (!validator.isEmail(data.email)) {
    errors.email = "emial is invalid";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "password is required";
  }
  if (validator.isLength(data.password, { min: 6, max: 15 })) {
    errors.password = "password must be between 6 and 15 characters";
  }
  if (validator.isEmpty(data.password2)) {
    errors.password2 = "confirm password is required";
  }
  if (validator.equals(data.password, data.password2)) {
    errors.password2 = "passwords must match";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
