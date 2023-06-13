# Trafik Monitor
Monitor the https://www.trafikverket.se for new booking slots available
* Install node.js 
* Fill in the config.json
```
{
	"socialSecurityNumber": "<Personal-number>",
	"telegramChatId": "<Chat-id>", // chat id for the telegram group 
	"telegramBotToken": "<Bot-token>", // bot token you can create it like mentioned here https://core.telegram.org/api/bots
	"interval": 1800000, // the interval of checking
	"threashorldDateTime": "2023-07-20T00:00:00.000Z" // the time of the exam that you should be notified if found before it.
}
```
* run `npm install`
* run `node index.js`
