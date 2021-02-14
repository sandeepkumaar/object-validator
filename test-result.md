# Test Results 


obj = { name: 'sandeep', age: 24, city: 'cbe' }
TAP version 13
# validate()()()
ok 1 Given validate(string)([name,city])(obj): should return obj
ok 2 Given validate(string)([name,age])(obj): should throw Error expecting string for age
ok 3 Given validate(string)([name,city?,address?])(obj): should return obj
ok 4 Given validate(string, minString(4))(['name', 'city'])(obj): should throw Error expecting city to be of minumum 4 chars
ok 5 Given validate(string)(['name', 'city', 'age'], errFn)(obj): should throw Custom Error 
# composeValidators()()
ok 6 Given composeValidators(string(name, city), number(age))(obj): should return obj
ok 7 Given composeValidators(string(name, city), number(age, name))(obj): should throw Error expecting name to be of type number
ok 8 Given composeValidators(string(name, city), number(age))(obj, cb): should return the cb value
obj:  {
  name: 'sandeep',
  age: 24,
  startDate: '09/21/2020',
  endDate: '09/16/2020'
}
ok 9 Given composeValidators(string(name, city), number(age), checkDateInterval)(obj): should throw Error startDate is after the endDate
ok 10 Given composeValidators(string(name, city), number(age), assignDefaultAddress)(obj): should return obj with default address
# truthy
ok 11 Given a pair obj: should return the same pair obj
ok 12 Given pair value=null: should throw err expecting truthy value
# falsy
ok 13 Given a pair obj: should return the same pair obj
ok 14 Given pair value=abc: should throw err expecting falsy value
# date
ok 15 Given pair value=abc: should throw err expecting Date
# equals
ok 16 Given a pair obj: should return the same pair obj
ok 17 Given pair value=sandeep for eqauls('sandeep'): should return pair
ok 18 Given pair value=r for eqauls('sandeep'): should throw TypeErr expecting to be equal
# number
ok 19 Given a pair obj: should return the same pair obj
ok 20 Given pair value=abc: should throw err expecting number
# minNumber
ok 21 Given a pair obj: should return the same pair obj
ok 22 Given pair value=boolean: should throw type err expecting number
ok 23 Given pair value=24 for minNumber(28): should throw err expecting minValue=28
ok 24 Given pair value=24 for minNumber(24): should return pair
# maxNumber
ok 25 Given a pair obj: should return the same pair obj
ok 26 Given pair value=string: should throw type err expecting number
ok 27 Given pair value=34 for maxNumber(28): should throw err expecting maxValue=28
ok 28 Given pair value=18 for maxNumber(24): should return pair
# regex(/sand*/): literal version
ok 29 Given a pair obj: should return the same pair obj
ok 30 Given pair value=sandeep for regex(/sand*/): should return pair
ok 31 Given pair value=abc for regex(/sand*/): should Throw TypeErr expecting to match
# string
ok 32 Given a pair obj: should return the same pair obj
ok 33 Given pair value=4: should throw err expecting string
# minString
ok 34 Given a pair obj: should return the same pair obj
ok 35 Given pair value=boolean: should throw type err expecting string
ok 36 Given pair value='abcd' for minString(6): should throw err expecting len=6
ok 37 Given pair value=4 for minString(4): should return pair
# maxString
ok 38 Given a pair obj: should return the same pair obj
ok 39 Given pair value={} for maxString()(): should throw type err expecting string
ok 40 Given pair value='abcdefg' for maxString(6): should throw err expecting maxlen=6
ok 41 Given pair value='abcd' for maxString(4): should return pair

1..41
# tests 41
# pass  41

# ok

