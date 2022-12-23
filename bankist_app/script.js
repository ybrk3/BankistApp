'use strict';

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
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

//Username shortcut
const createUsername = function (accs) {
  accs.forEach(function (acc, i) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUsername(accounts);

//Displaying all movements
const displayMovements = function (acc, sort = false) {
  //clears the existing movements
  containerMovements.innerHTML = ' ';
  //getting the all movements and accordingly adding movements to html
  const movs = sort
    ? acc.movements.slice().sort((a, b) => a - b)
    : acc.movements;
  movs.forEach((mov, i, arr) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const eachRow = ` <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__value">${mov}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', eachRow);
  });
};
displayMovements(account1);
//Displaying balance value
const displayBalance = function (acc) {
  acc.balance = acc.movements.reduce(function (acc, cur, i, arr) {
    return acc + cur;
  }, 0);

  labelBalance.textContent = `${acc.balance} €`;
};
displayBalance(account1);

//Display total income value
const displayIncome = function (acc) {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumIn.textContent = `${income} €`;
};
displayIncome(account1);

//Display total outcome value
const displayOutcome = function (acc) {
  const outcome = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${outcome} €`;
};
displayOutcome(account1);

//Display total interest value
const displayInterest = function (acc) {
  const interest =
    (acc.movements.reduce(function (acc, cur, i, arr) {
      return acc + cur;
    }, 0) *
      acc.interestRate) /
    100;
  labelSumInterest.textContent = interest;
};
displayInterest(account1);
//Getting the user
const gettingUser = function (accs) {
  return accs.find(acc => acc.username === inputLoginUsername.value);
};
//Updating UI to be used after each transaction events
const updateUI = currentAccount => {
  displayMovements(currentAccount);
  displayBalance(currentAccount);
  displayIncome(currentAccount);
  displayOutcome(currentAccount);
  displayInterest(currentAccount);
};

/*____Event Listeners____*/
//Login eventListener
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //Prevent form from submitting
  e.preventDefault();
  //Getting the entered account
  currentAccount = gettingUser(accounts);

  //checking the pin value
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Clear login input fields and cursor
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //Welcome message
    labelWelcome.textContent = `Welcome, ${currentAccount.owner.split(' ')[0]}`;

    //Display UI & welcome message
    containerApp.style.opacity = 100;

    //Display movements
    //Display balance
    //Display summary
    updateUI(currentAccount);
  } else {
    alert('User not found');
    inputLoginUsername.value = inputLoginPin.value = '';
  }
});

//Money transfer
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferTo.value = inputTransferAmount.value = '';
  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    recieverAcc.movements.push(amount);
    updateUI(currentAccount);
  } else {
    alert('User not found');
  }
});
//Loan
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  } else {
    alert('Not engouh balance to take this loan');
  }
  inputLoanAmount.value = '';
});

//Closing account
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    //Delete account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
  }
  //Clear input areas
  inputCloseUsername.value = inputClosePin.value = '';
});

//Sorting the movements
let sorted = true;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  displayMovements(currentAccount, sorted);
  sorted = !sorted;
});
