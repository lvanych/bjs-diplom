const logoutButton = new LogoutButton();
logoutButton.action = () => {
  ApiConnector.logout((responce) => {
    if (responce) {
      location.reload();
    }
  });
};

ApiConnector.current((responce) => {
  if (responce) {
    ProfileWidget.showProfile(responce.data);
  }
});

let ratesBoard = new RatesBoard();

let getCurrencyExchangeRates = function () {
  ApiConnector.getStocks((responce) => {
    if (responce) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(responce.data);
    }
  });
};
getCurrencyExchangeRates();
setInterval(getCurrencyExchangeRates, 60000);

let moneyManager = new MoneyManager();

function func(result) {
  if (result.success) {
    ProfileWidget.showProfile(result.data);
    moneyManager.setMessage(true, "Успешно");
  } else {
    moneyManager.setMessage(false, result.error || "Что-то пошло не так...");
  }
}
moneyManager.addMoneyCallback = (data) => ApiConnector.addMoney(data, func);
moneyManager.conversionMoneyCallback = (data) =>
  ApiConnector.convertMoney(data, func);
moneyManager.sendMoneyCallback = (data) =>
  ApiConnector.transferMoney(data, func);

let favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites((responce) => {
  if (responce) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(responce.data);
    moneyManager.updateUsersList(responce.data);
  }
});

function func2(responce) {
  if (responce) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(responce.data);
    moneyManager.updateUsersList(responce.data);
    favoritesWidget.setMessage(true, "Успешно");
  } else {
    favoritesWidget.setMessage(
      false,
      responce.error || "Что-то пошло не так..."
    );
  }
}

favoritesWidget.addUserCallback = (data) =>
  ApiConnector.addUserToFavorites(data, func2);
favoritesWidget.removeUserCallback = (data) =>
  ApiConnector.removeUserFromFavorites(data, func2);
