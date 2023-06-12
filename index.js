const axios = require('axios');
const moment = require('moment');
const TelegramBot = require('node-telegram-bot-api');
const config = require("./config.json");

// Telegram bot token and chat ID
const telegramBotToken = config.telegramBotToken;
const telegramChatId = config.telegramChatId;

// URL and payload
const url = 'https://fp.trafikverket.se/boka/occasion-bundles';
const payload = {
  bookingSession: {
    socialSecurityNumber: config.socialSecurityNumber,
    licenceId: 5,
    bookingModeId: 0,
    ignoreDebt: false,
    ignoreBookingHindrance: false,
    examinationTypeId: 0,
    excludeExaminationCategories: [],
    rescheduleTypeId: 0,
    paymentIsActive: false,
    paymentReference: null,
    paymentUrl: null,
    searchedMonths: 0,
  },
  occasionBundleQuery: {
    startDate: '1970-01-01T00:00:00.000Z',
    searchedMonths: 0,
    locationId: 1000019,
    nearbyLocationIds: [],
    languageId: 0,
    vehicleTypeId: 4,
    tachographTypeId: 1,
    occasionChoiceId: 1,
    examinationTypeId: 12,
  },
};

// Initialize Telegram bot
const bot = new TelegramBot(telegramBotToken);

// Function to send Telegram notification
function sendTelegramNotification(message) {
  bot.sendMessage(telegramChatId, message);
}

// Function to process the occasions
function processOccasions(occasions) {
    const filteredOccasions = occasions.filter((occasion) => {
        const startDateTime = moment(occasion.duration.start);
        const notificationDateTime = moment('2023-06-15T12:10:00+02:00');
        return startDateTime.isBefore(notificationDateTime);
    });
    
    if (filteredOccasions.length > 0) {
        const message = filteredOccasions.map((occasion) => {
          return `Date: ${occasion.date}\nTime: ${occasion.time}\nLocation: ${occasion.locationName}\nCost: ${occasion.cost}\n\n`;
        }).join('');
    
        sendTelegramNotification(message);
    }
}

// Function to make the request and process the response
function makeRequest() {
  axios
    .post(url, payload)
    .then((response) => {
      const occasions = response.data.data.bundles.flatMap((bundle) => bundle.occasions);
      sendTelegramNotification(`Found ${occasions.length} occasions`);
      processOccasions(occasions);
    })
    .catch((error) => {
      console.error('Error in request:', error);
    });
}

// Invoke the request initially
makeRequest();

// Schedule the request to be made every half an hour
setInterval(makeRequest, config.interval); 
