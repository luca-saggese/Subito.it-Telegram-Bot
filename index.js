const xpath = require('xpath')
  , dom = require('xmldom').DOMParser
const jsonfile = require('jsonfile')
const http = require("http");
const process = require("process");
const request = require('request');
const TelegramBot = require('node-telegram-bot-api');
//const nodemailer = require('nodemailer');
const startDate = new Date();

var transporter;

function sendMail(msg){
	var mailOptions = {
	  from: config.gmail_user,
	  to: config.mail_to,
	  subject: 'subito bot',
	  text: msg
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
		console.log(error);
	  } else {
		console.log('Email sent: ' + info.response);
	  }
	});
}

var file = './config.json'
var config={}

 function getSubitoArticles(url, lastDatetime, callback){
	request({'url':url,
			'proxy':config.proxy}, function (error, response, body) {
		
		var ret=[];
		if (!error && response.statusCode == 200) {
			if(!lastDatetime)lastDatetime=0;
			var _lastDatetime=lastDatetime;
			var doc = new dom({errorHandler:{warning:function(w){},error:function(w){},fatalError:function(w){}}}).parseFromString(body);

			var nodes = xpath.select('//article[@class="item_list view_listing"]', doc);
			nodes.forEach(n=>{
				const idArticle = n.getAttribute('data-id');
				const title=xpath.select1('.//h2/a/text()', n).data.trim();
				const url=xpath.select1('.//h2/a', n).getAttribute('href');
				const category=url.split('/')[3];
				const img=xpath.select1('.//img',n).getAttribute('src');
				const datetime=new Date(xpath.select1('.//time',n).getAttribute('datetime')).getTime();
				const dateString=xpath.select1('.//time',n).getAttribute('datetime');
				var specs=xpath.select1('.//span[@class="item_specs"]/text()',n);
				if(specs) specs=specs.data.trim();
				const price=xpath.select1('.//span[@class="item_price"]/text()',n).data.trim().replace('&euro;','€');
				const info=xpath.select1('.//span[contains(@class, "item_info")]',n).getAttribute('class').split(' ');
				const location=xpath.select1('.//span[@class="item_location"]/text()',n).data.trim();
				var extra_data=xpath.select('.//div[@class="item_extra_data"]/ul/li/text()',n);
				var phone_number=xpath.select1('.//div[@class="phone_number"]/text()',n);
				if(phone_number) phone_number=phone_number.data.trim();
				
				if(extra_data)extra_data=extra_data.map((d)=> {return d.data.trim()});

				const item={idArticle, title, img, datetime, specs, location, price, info, extra_data, dateString, url, phone_number, category};
				if(datetime>lastDatetime){
					ret.push(item);
				}
				_lastDatetime=Math.max(_lastDatetime,datetime);
				//console.log(title.data)
				//console.log(item);
			});
			callback(null, ret, _lastDatetime);
		}else{
			callback(error);
		}
	})
 
 }
 var bot;
 function main(){
	jsonfile.readFile(file, function(err, obj) {
		config=obj;
		console.log(err,config);
		if(!transporter){
			/*transporter = nodemailer.createTransport({
			  service: 'gmail',
			  auth: {
				user: config.gmail_user,
				pass: config.gmail_pass
			  }
			});*/
		}
		if(!bot){
			bot = new TelegramBot(config.telegram_token, {
			  polling: true,
			  request: {
				proxy: config.proxy,
			  },
			});

			bot.onText(/\/search\sadd (.+)/, (msg, match) => {
			  const chatId = msg.chat.id;
			  const url = match[1]; 
			  config.searches.push({url}); 
			  jsonfile.writeFile(file, config,{spaces: 2},function (err) {});
			  bot.sendMessage(chatId, 'search added');
			});

			bot.onText(/\/search\sdel (\d+)/, (msg, match) => {
			  const chatId = msg.chat.id;
			  const id = match[1]; 
			  config.searches.splice(id - 1, 1); 
			  jsonfile.writeFile(file, config,{spaces: 2},function (err) {});
			  bot.sendMessage(chatId, 'search ' + id + ' removed');
			});

			bot.onText(/\/search list/, (msg, match) => {
			  const chatId = msg.chat.id;
			  var id=1;
			  config.searches.forEach(s =>{
				bot.sendMessage(chatId,id++ + ' ' + s.url);
			  });
			});
			bot.onText(/\help/, (msg, match) => {
			  const chatId = msg.chat.id;
			  bot.sendMessage(chatId,'available commands:\n/search add [url]\n/search list\n/search del [id]\n/info');
			});
			bot.onText(/\info/, (msg, match) => {
			  const chatId = msg.chat.id;
			  bot.sendMessage(chatId,'started: '  + fDate(startDate) +  '\nlast run: ' + fDate(config.lastRun) +'\nsearch count: ' + config.searches.length);
			});
			
			
	  }
	  var searchCount = config.searches.length;
	  config.searches.forEach(s =>{
		 getSubitoArticles(s.url, s.lastDatetime, (err, items, lastDatetime) =>{
			 console.log(items);
			 if(items){
				 items.forEach(i=>{
					 msg='<a href="'+i.url+'">'+ i.title  + '</a>\n' + (i.specs || i.extra_data.join(' ')) + '\n<strong>' + i.price +'</strong>';// + '\n' + i.img;
					 console.log(msg)
					 bot.sendMessage(config.telegram_chatId, msg, {parse_mode:'HTML'});
				 })
				 s.lastDatetime=lastDatetime;
				 config.lastRun=new Date().getTime();
				 console.log(s);
				 jsonfile.writeFile(file, config,{spaces: 2},function (err) {
					  searchCount --;
					  if(searchCount==0) {
						  
						  //bot.stopPolling();
						  setTimeout(main, 180*1000);
						  //process.exit(0);
					  }
				  })
			 }
		 });
	  })
	  
	})
 }
function fDate(d){return new Date(d).toISOString().substring(0,19).replace('T',' ')}

main();