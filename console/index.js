/*
  Console Application accessing the Bank Ledger API hosted on http://localhost:8080/
 */
const ledgerApi = require('./ledgerApi');
const term = require('terminal-kit').terminal;
let isLoggedIn = false;

const exitApp = () => {
  term.clear();
  process.exit();
};

// trap CTRL-C to exit appliction
term.on('key', name => {
  if (name === 'CTRL_C') {
    exitApp();
  }
});

const appTitle = () => {
  term.clear();
  term.cyan(`***** Bank Ledger *****`);
};

const checkLogin = () => {
  if (!isLoggedIn) {
    throw new Error('You\'re not logged into any account.');
  }
};

/**
 * display prompt message. waits for user input and returns promise
 * that's will have user-selected value when resolved.
 * @param prompt
 * @param password - hides user's input if true. defaults to false
 * @returns {Promise<void>}
 */
const promptInput = async (prompt, password = false) => {
  term(prompt + ': ');
  const result = await term.inputField({cancelable: true, echoChar: password}).promise;
  term('\r\n');
  if (result === undefined) {
    mainMenu();
  } else {
    return result;
  }
};

const outputSubMenu = subMenuName => {
  term.moveTo(1, 3).eraseDisplayBelow();
  term.cyan(`${subMenuName}\r\n\r\n`);
};

const displayLoginMenu = async () => {
  outputSubMenu('Login');

  const accountName = await promptInput('Enter Account Name');
  const password = await promptInput('Enter Password', true);

  if (accountName && password) {
    try {
      await ledgerApi.login(accountName, password);
      displayMessage('Successfully logged in.', 'green');
      isLoggedIn = true;
      return displayMainMenu;
    } catch (err) {
      displayMessage(err);
      return displayLoginMenu;
    }
  }

  displayMessage('Invalid selection');

  // display main menu if user didn't enter any data.
  return displayMainMenu;
};

const displayLogoutMenu = async () => {
  checkLogin();

  try {
    await ledgerApi.logout();
    displayMessage('Successfully logged out.', 'green');
    isLoggedIn = false;
    return displayMainMenu;
  } catch (err) {
    displayMessage(err);
    return displayMainMenu;
  }
};

const displayCreateNewAccountMenu = async () => {
  outputSubMenu('Create New Account');

  const accountName = await promptInput('Enter New Account Name');
  const password = await promptInput('Enter New Account Password', true);

  if (accountName && password) {
    try {
      await ledgerApi.createAccount(accountName, password);
      displayMessage('Successfully created account.', 'green');
      return displayMainMenu;
    } catch (err) {
      displayMessage(err);
      return displayCreateNewAccountMenu;
    }
  }

  displayMessage('Invalid selection');

  return displayMainMenu;
};

const displayViewTransactionHistoryMenu = async () => {
  checkLogin();
  outputSubMenu('View Transaction History');

  try {
    const response = await ledgerApi.getTransactionHistory();
    displayMessage('Successfully retrieved history.', 'green');

    term(`Account Name: ${response.json.accountName}\r\n`);
    term(`Balance: $${response.json.balance.toFixed(2)}\r\n\r\n`);
    term('Transaction History\r\n');
    term('-------------------\r\n');
    term('Date\t\t\tMemo\t\t\tAmount\t\t\t\r\n');
    term('----\t\t\t----\t\t\t------\t\t\t\r\n');
    if (response.json.transactionHistory.length) {
      response.json.transactionHistory.forEach(h => {
        term(`${h.date}\t\t${h.memo}\t\t\t${h.transactionType == 'WITHDRAWAL' ? '-' : ''}$${h.amount.toFixed(2)}\r\n`);
      });
    } else {
      term('No transactions found. Add a transaction from the main menu.\r\n');
    }
    await promptInput('\r\nHit ENTER to return to main menu');
    return displayMainMenu;
  } catch (err) {
    displayMessage(err);
    return displayMainMenu;
  }

  displayMessage('Invalid selection');

  return displayMainMenu;
};

const displayCreateTransactionMenu = async () => {
  checkLogin();
  outputSubMenu('Create New Transaction');

  const memo = await promptInput('Enter Memo');
  const date = await promptInput('Enter Date (yyyy-mm-dd) - Blank defaults to today');

  term('Transaction Type: ');
  const transactionType = await term.singleColumnMenu(['DEPOSIT', 'WITHDRAWAL']).promise;

  const amount = await promptInput('Enter Amount (##.##)');

  if (memo && amount && transactionType) {
    try {
      await ledgerApi.createTransaction(memo, transactionType.selectedText, date, amount);
      displayMessage('Successfully created transaction.', 'green');
      return displayMainMenu;
    } catch (err) {
      displayMessage(err);
      return displayCreateTransactionMenu;
    }
  }

  displayMessage('Invalid selection');

  return displayMainMenu;
};

const displayMessage = (msg, color = 'red') => {
  term.saveCursor();
  term.moveTo(20, 2);
  let m = msg.json && msg.json.message ? msg.json.message : msg.body;
  if (!m) m = msg;

  term[color](m).eraseLineAfter();
  term.restoreCursor();
};

const displayMainMenu = async () => {
  outputSubMenu('Main Menu');

  const items = [
    'Login',
    'Create New Account',
    'View Transaction History',
    'Create Transaction',
    'Logout',
    'Quit',
  ];

  const selection = await term.singleColumnMenu(items).promise;

  switch (selection.selectedText) {
    case items[0]:
      return displayLoginMenu;
    case items[1]:
      return displayCreateNewAccountMenu;
    case items[2]:
      return displayViewTransactionHistoryMenu;
    case items[3]:
      return displayCreateTransactionMenu;
    case items[4]:
      return displayLogoutMenu;
    case items[5]:
      exitApp();
    default:
      return displayMessage('Invalid selection.');
  }
};

/**
 * event loop which dispays menu,
 * waits until menu returns next default menu, and loop forever.
 * @param menu
 * @returns {Promise<void>}
 */
const eventLoop = async menu => {
  while (true) {
    try {
      menu = await menu();
    } catch (err) {
      displayMessage(err);
      menu = displayMainMenu;
    }
  }
};

const mainMenu = () => {
  (async () => {
    appTitle();
    await eventLoop(displayMainMenu);
  })();
};

mainMenu();
