const {validate, composeValidators, pipe } = require('./');
const { string, maxString, minNumber, minDate, maxDate, boolean } = require('./predicates');
const isEmail = require('validator/lib/isEmail');

// wrap as a predicate fn
let email = (pair) => {
  let {key, value} = pair;
  if(isEmail(value)) return pair;
  throw TypeError(`Expected {${key}} to be of type ${expected}. Given {${key}: ${value}}`);
};

const user = {
  name: 'sandeep',
  age: 24,
  city: 'cbe',
  purchaseDate: '02/14/2021',
  expiryDate: '02/15/2025',
  email: 'cskumaar1992@gmail.com'
};

let validateExpiryDate = (user) => {
  let {purchaseDate, expiryDate} = user;
  let bool = new Date(purchaseDate) < new Date(expiryDate)
  if(bool) return user; // dont forget to return the entire obj
  throw TypeError('Invalid Expiry. Expiry date is before the purchase date');
};



let assignDefaults = ({isPremium=false, ...rest}) => ({...rest, isPremium});

const validateUser = composeValidators(
  validate(string)(["name", "city", "email"]),
  validate(maxString(3))(["city"]),
  validate(minNumber(18))(["age"], (e) => "User's age should be 18 or above"),
  validate(
    minDate("01/01/2020"),
    maxDate("12/31/2029")
  )(["purchaseDate", "expiryDate"]), // checks if dates fall within the date range
  validate(email)(["email"]),
  validate(boolean)(["isPremium?"]),
  validateExpiryDate,
  assignDefaults
);

var _user = validateUser(user); // throws error on failure; returns user obj on success
_user = validateUser(user, (e) => false) // returns false on failure; returns user obj on success

console.log(_user);

