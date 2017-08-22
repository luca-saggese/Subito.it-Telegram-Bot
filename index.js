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
				var price=xpath.select1('.//span[@class="item_price"]/text()',n);
				if(price) price=price.data.trim().replace('&euro;','€');
				const info=xpath.select1('.//span[contains(@class, "item_info")]',n).getAttribute('class').split(' ');
				const location=xpath.select1('.//span[@class="item_location"]/text()',n).data.trim();
				var extra_data=xpath.select('.//div[@class="item_extra_data"]/ul/li/text()',n);
				var phone_number=xpath.select1('.//div[@class="phone_number"]/span/text()',n);
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
		console.log(4,err,config);
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
			bot.on('polling_error', (error) => {
			  console.log(error);  // => 'EFATAL'
			  bot.stopPolling(); 
			  bot=null;
			  setTimeout(main, 30*1000);
			});

			bot.onText(/\/search\sadd (.+)/, (msg, match) => {
			  const chat_id = msg.chat.id;
			  const url = match[1]; 
			  const lastDatetime = new Date().getTime();
			  config.searches.push({url, chat_id, lastDatetime}); 
			  jsonfile.writeFile(file, config,{spaces: 2},function (err) {});
			  bot.sendMessage(chat_id, 'search added');
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
			  var ret='';
			  config.searches.forEach(s =>{
				  ret += id++ + ' ' + s.url + '\n';
			  });
			  bot.sendMessage(chatId, ret);
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
			 if(err){
				console.log('error',err,'restarting....');
				bot.stopPolling(); 
				setTimeout(main, 30*1000);
			 }else if(items){
				 items.forEach(i=>{
					 msg='<a href="'+i.url+'">'+ i.title  + '</a>\n' + (i.specs || i.extra_data.join(' ')) + '\n<strong>' + i.price +'</strong> tel: ' + i.phone_number;// + '\n' + i.img;
					 console.log(2,msg)
					 bot.sendMessage(s.chat_id, msg, {parse_mode:'HTML'});
				 })
				 s.lastDatetime=lastDatetime;
				 config.lastRun=new Date().getTime();
				 console.log(1,s);
				 jsonfile.writeFile(file, config,{spaces: 2},function (err) {
					  searchCount --;
					  if(searchCount==0) {
						  setTimeout(main, 180*1000);
					  }
				  })
			 }
		 });
	  })
	  
	})
 }
function fDate(d){return new Date(d).toISOString().substring(0,19).replace('T',' ')}

main();