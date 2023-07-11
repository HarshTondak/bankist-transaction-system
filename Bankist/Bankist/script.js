'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


// IMPLEMENTATION

// Function for showing cash movements
const displayMovements = function (acc, sort = false) {
  // To remove old(hard coded) transactions written in html file
  containerMovements.innerHTML = '';

  // For the sort button
  // slice() is used to create a copy of original array so that original array remains unchanged
  const newMovements = sort ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  // similar to  .textContent = 0;
  newMovements.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // Creating dates
    const day = new Date(acc.movementsDates[i]);
    const date = `${day.getDate()}`.padStart(2, 0);
    const month = `${day.getMonth() + 1}`.padStart(2, 0);
    const year = day.getFullYear();
    let displayDate = `${date}/${month}/${year}`;

    // To make working of dates more real...
    const calcDaysPassed = (date1, date2) => Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
    const daysPassed = calcDaysPassed(new Date(), day);
    if (daysPassed === 0) {
      displayDate = "Today";
    }
    else if (daysPassed === 1) {
      displayDate = "Yesterday";
    }
    else if (daysPassed < 7) {
      displayDate = `${daysPassed} days ago`;
    }

    // Formatted movements
    const formattedMov = new Intl.NumberFormat(acc.locale, { style: "currency", currency: acc.currency }).format(mov);

    // toFixed() is used here to roundoff the amount upto to 2 decimal points
    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    // To add new html code in the beginning of the container
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};


// Function to update the summary of incoming, outgoing and interests on the transactions
const calcDisplaySummary = function (acc) {
  const income = acc.movements.filter(mov => mov > 0).reduce((acc, mov) => acc + mov, 0);
  // toFixed() is used here to roundoff the amount upto to 2 decimal points
  labelSumIn.textContent = `${income.toFixed(2)} €`;

  const outcome = acc.movements.filter(mov => mov < 0).reduce((acc, mov) => acc + mov, 0);
  // toFixed() is used here to roundoff the amount upto to 2 decimal points
  labelSumOut.textContent = `${Math.abs(outcome).toFixed(2)} €`;

  const interests = acc.movements.filter(mov => mov < 0).map(mov => mov * acc.interestRate)
    .reduce((acc, mov) => acc + mov, 0);
  // toFixed() is used here to roundoff the amount upto to 2 decimal points
  labelSumInterest.textContent = `${Math.abs(interests).toFixed(2)} €`;
}


// Function for updating the balance sum in the logged-in user's account
const calcDisplayBalance = function (acc) {
  const balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  // toFixed() is used here to roundoff the amount upto to 2 decimal points

  // Formatted movements
  const formattedMov = new Intl.NumberFormat(acc.locale, { style: "currency", currency: acc.currency }).format(balance);

  labelBalance.textContent = `${formattedMov}`;

  // Adding/Updating new property(balance)
  acc.balance = balance;
}


// Function to create usernames of the account-owners using their initial letter in small-case
const createUsernames = function (users) {
  users.forEach(function (acc) {
    acc.username = acc.owner.toLowerCase().split(" ").map(name => name[0]).join("");
  });
};
createUsernames(accounts);


// Log-Out Timer function
const startLogOutTimer = function () {
  // set time to 5 mins
  let time = 300;   // 300 seconds

  // Function to show the remaining time
  const tick = function () {
    const min = String(Math.floor(time / 60)).padStart(2, 0);
    const sec = String(time % 60).padStart(2, 0);

    //In each call print the remaining time on the UI
    labelTimer.textContent = `${min} : ${sec}`;

    // When time becomes 0, log-out the user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = "Log in to get started";
      containerApp.style.opacity = 0;
    }

    // Decrease one sec
    time--;
  };

  // To immediately show the remaining time, as setInterval() will begin 1 sec later
  tick();
  // Update the time every second
  const timer = setInterval(tick, 1000);

  // To solve the problem of multiple timer running as multiple user login...
  return timer;
}


// ...........EVENT HANDLERS...........
let currentAccount, timer;

// To update all data on the screen
const updateData = function (acc) {
  // Display Movements
  displayMovements(acc);
  // Display Balance
  calcDisplayBalance(acc);
  // Display Summary
  calcDisplaySummary(acc);
}


// To LOG-IN in the account
btnLogin.addEventListener('click', function (e) {
  // Prevent the form from submitting(i.e. geting refreshed)
  e.preventDefault();

  // Checking username
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  // Checking pin(if correct then LOG-IN)
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    // Display Message
    labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(" ")[0]}`;
    // Display UI
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    // const date = `${now.getDate()}`.padStart(2, 0);
    // const month = `${now.getMonth() + 1}`.padStart(2, 0);
    // const year = now.getFullYear();
    // const hr = `${now.getHours()}`.padStart(2, 0);
    // const min = `${now.getMinutes()}`.padStart(2, 0);
    // labelDate.textContent = `${date}/${month}/${year}  ${hr}:${min}`;

    // Using Internationalization of Dates through INTL API
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    };
    // const local = navigator.language;
    // console.log(local);
    const local = currentAccount.locale;
    labelDate.textContent = new Intl.DateTimeFormat(local, options).format(now);

    // If timer already exists, close it...
    if (timer) {
      clearInterval(timer);
    }
    // Starting the timer
    timer = startLogOutTimer();

    // Update Data
    updateData(currentAccount);
  }
  else {
    // If Wrong Credentials were used
    window.alert("Wrong Credentials");
  }
});


// Transfering funds
btnTransfer.addEventListener('click', function (e) {
  // Prevent the form from submitting(i.e. geting refreshed)
  e.preventDefault();

  // For the amount to transfer
  const amount = Number(inputTransferAmount.value);
  // Reciever's username
  const recieverAcc = accounts.find(acc => acc.username === inputTransferTo.value);

  // Conditions for the transfer of funds
  if (amount > 0 && recieverAcc && currentAccount.balance >= amount && recieverAcc.username !== currentAccount.username) {
    // console.log('Transfer Valid');

    // Adding some time(2 sec) to add the new transactions into history
    setTimeout(function () {
      // Doing the transfer
      currentAccount.movements.push(-amount);
      recieverAcc.movements.push(amount);

      // Adding transfer dates
      currentAccount.movementsDates.push(new Date().toISOString());
      recieverAcc.movementsDates.push(new Date().toISOString());

      // Update Data
      updateData(currentAccount);

      // Resetting the timer
      clearInterval(timer);
      // Starting the timer
      timer = startLogOutTimer();
    }, 2000);
    // Clearing the input fields
    inputTransferAmount.value = inputTransferTo.value = '';
  }
  else {
    // If Wrong Credentials were used OR account-holder have insufficient funds
    window.alert("Wrong Credentials OR Insufficient Funds");
  }
});


// For Processing the Loan Amount
btnLoan.addEventListener('click', function (e) {
  // Prevent the form from submitting(i.e. geting refreshed)
  e.preventDefault();

  // To round off the LoanAmount into decimal
  const amount = Math.floor(inputLoanAmount.value);

  // Pass If the Account-holder have atleast one +ve transaction[i.e. deposit] of amount greater than 10%loanAmount
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {

    // Adding some time(2 sec) to add the new loan into history
    setTimeout(function () {
      // Adding the amount in transactions
      currentAccount.movements.push(amount);

      // Adding transfer dates
      currentAccount.movementsDates.push(new Date().toISOString());

      // Update the data
      updateData(currentAccount);

      // Resetting the timer
      clearInterval(timer);
      // Starting the timer
      timer = startLogOutTimer();
    }, 2000);
    // Clearing the input fields
    inputLoanAmount.value = '';
  }
  else {
    // Account-holder didnot have atleast one +ve transaction[i.e. deposit] of amount greater than 10%loanAmount
    window.alert("Sorry, but Loan cannot be passed...")
  }

});


// Deleting Account
btnClose.addEventListener('click', function (e) {
  // Prevent the form from submitting(i.e. geting refreshed)
  e.preventDefault();

  // Checking if username and pin matches to the credentials of the logged-in user
  if (inputCloseUsername.value === currentAccount.username && Number(inputClosePin.value) === currentAccount.pin) {
    // Clear the input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    // Finding the index of currentAccount in accounts array
    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    // console.log(index);

    // Deleting the account on "index" in accounts array
    accounts.splice(index, 1);

    // Clearing the input fields
    inputCloseUsername.value = inputClosePin.value = '';
    // Display Message
    labelWelcome.textContent = `Log in to get started`;
    // Hiding the UI
    containerApp.style.opacity = 0;
  }
  else {
    // If Wrong Credentials were used
    window.alert("Wrong Credentials");
  }
});


// For the Sorting of tranction list
let sorted = false;
btnSort.addEventListener('click', function (e) {
  // Prevent the form from submitting(i.e. geting refreshed)
  e.preventDefault();

  // Updating the transaction list
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});






/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 200, 70, 1300];




// const f = new Date(2037, 10, 19, 15, 23);
setInterval(function () {
  const now = new Date();
  console.log(`  ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}  `);
}, 1000);
/////////////////////////////////////////////////