const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
  let errors = {};
  //   for validator to work it needs to read as an empty string.

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (!validator.isEmail(data.email)) {
    errors.email = "emial is invalid";
  }
  if (validator.isEmpty(data.email)) {
    errors.email = "email field is required";
  }
  if (validator.isEmpty(data.password)) {
    errors.password = "password is required";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
