const xpath = require('xpath')
  , dom = require('xmldom').DOMParser
const jsonfile = require('jsonfile')
const http = require("http");
const process = require("process");
const request = require('request');
const TelegramBot = require('node-telegram-bot-api');
//const nodemailer = require('nodemailer');
const startDate = new Date();
const MD5 = function(s){function L(k,d){return(k<<d)|(k>>>(32-d))}function K(G,k){var I,d,F,H,x;F=(G&2147483648);H=(k&2147483648);I=(G&1073741824);d=(k&1073741824);x=(G&1073741823)+(k&1073741823);if(I&d){return(x^2147483648^F^H)}if(I|d){if(x&1073741824){return(x^3221225472^F^H)}else{return(x^1073741824^F^H)}}else{return(x^F^H)}}function r(d,F,k){return(d&F)|((~d)&k)}function q(d,F,k){return(d&k)|(F&(~k))}function p(d,F,k){return(d^F^k)}function n(d,F,k){return(F^(d|(~k)))}function u(G,F,aa,Z,k,H,I){G=K(G,K(K(r(F,aa,Z),k),I));return K(L(G,H),F)}function f(G,F,aa,Z,k,H,I){G=K(G,K(K(q(F,aa,Z),k),I));return K(L(G,H),F)}function D(G,F,aa,Z,k,H,I){G=K(G,K(K(p(F,aa,Z),k),I));return K(L(G,H),F)}function t(G,F,aa,Z,k,H,I){G=K(G,K(K(n(F,aa,Z),k),I));return K(L(G,H),F)}function e(G){var Z;var F=G.length;var x=F+8;var k=(x-(x%64))/64;var I=(k+1)*16;var aa=Array(I-1);var d=0;var H=0;while(H<F){Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=(aa[Z]| (G.charCodeAt(H)<<d));H++}Z=(H-(H%4))/4;d=(H%4)*8;aa[Z]=aa[Z]|(128<<d);aa[I-2]=F<<3;aa[I-1]=F>>>29;return aa}function B(x){var k="",F="",G,d;for(d=0;d<=3;d++){G=(x>>>(d*8))&255;F="0"+G.toString(16);k=k+F.substr(F.length-2,2)}return k}function J(k){k=k.replace(/rn/g,"n");var d="";for(var F=0;F<k.length;F++){var x=k.charCodeAt(F);if(x<128){d+=String.fromCharCode(x)}else{if((x>127)&&(x<2048)){d+=String.fromCharCode((x>>6)|192);d+=String.fromCharCode((x&63)|128)}else{d+=String.fromCharCode((x>>12)|224);d+=String.fromCharCode(((x>>6)&63)|128);d+=String.fromCharCode((x&63)|128)}}}return d}var C=Array();var P,h,E,v,g,Y,X,W,V;var S=7,Q=12,N=17,M=22;var A=5,z=9,y=14,w=20;var o=4,m=11,l=16,j=23;var U=6,T=10,R=15,O=21;s=J(s);C=e(s);Y=1732584193;X=4023233417;W=2562383102;V=271733878;for(P=0;P<C.length;P+=16){h=Y;E=X;v=W;g=V;Y=u(Y,X,W,V,C[P+0],S,3614090360);V=u(V,Y,X,W,C[P+1],Q,3905402710);W=u(W,V,Y,X,C[P+2],N,606105819);X=u(X,W,V,Y,C[P+3],M,3250441966);Y=u(Y,X,W,V,C[P+4],S,4118548399);V=u(V,Y,X,W,C[P+5],Q,1200080426);W=u(W,V,Y,X,C[P+6],N,2821735955);X=u(X,W,V,Y,C[P+7],M,4249261313);Y=u(Y,X,W,V,C[P+8],S,1770035416);V=u(V,Y,X,W,C[P+9],Q,2336552879);W=u(W,V,Y,X,C[P+10],N,4294925233);X=u(X,W,V,Y,C[P+11],M,2304563134);Y=u(Y,X,W,V,C[P+12],S,1804603682);V=u(V,Y,X,W,C[P+13],Q,4254626195);W=u(W,V,Y,X,C[P+14],N,2792965006);X=u(X,W,V,Y,C[P+15],M,1236535329);Y=f(Y,X,W,V,C[P+1],A,4129170786);V=f(V,Y,X,W,C[P+6],z,3225465664);W=f(W,V,Y,X,C[P+11],y,643717713);X=f(X,W,V,Y,C[P+0],w,3921069994);Y=f(Y,X,W,V,C[P+5],A,3593408605);V=f(V,Y,X,W,C[P+10],z,38016083);W=f(W,V,Y,X,C[P+15],y,3634488961);X=f(X,W,V,Y,C[P+4],w,3889429448);Y=f(Y,X,W,V,C[P+9],A,568446438);V=f(V,Y,X,W,C[P+14],z,3275163606);W=f(W,V,Y,X,C[P+3],y,4107603335);X=f(X,W,V,Y,C[P+8],w,1163531501);Y=f(Y,X,W,V,C[P+13],A,2850285829);V=f(V,Y,X,W,C[P+2],z,4243563512);W=f(W,V,Y,X,C[P+7],y,1735328473);X=f(X,W,V,Y,C[P+12],w,2368359562);Y=D(Y,X,W,V,C[P+5],o,4294588738);V=D(V,Y,X,W,C[P+8],m,2272392833);W=D(W,V,Y,X,C[P+11],l,1839030562);X=D(X,W,V,Y,C[P+14],j,4259657740);Y=D(Y,X,W,V,C[P+1],o,2763975236);V=D(V,Y,X,W,C[P+4],m,1272893353);W=D(W,V,Y,X,C[P+7],l,4139469664);X=D(X,W,V,Y,C[P+10],j,3200236656);Y=D(Y,X,W,V,C[P+13],o,681279174);V=D(V,Y,X,W,C[P+0],m,3936430074);W=D(W,V,Y,X,C[P+3],l,3572445317);X=D(X,W,V,Y,C[P+6],j,76029189);Y=D(Y,X,W,V,C[P+9],o,3654602809);V=D(V,Y,X,W,C[P+12],m,3873151461);W=D(W,V,Y,X,C[P+15],l,530742520);X=D(X,W,V,Y,C[P+2],j,3299628645);Y=t(Y,X,W,V,C[P+0],U,4096336452);V=t(V,Y,X,W,C[P+7],T,1126891415);W=t(W,V,Y,X,C[P+14],R,2878612391);X=t(X,W,V,Y,C[P+5],O,4237533241);Y=t(Y,X,W,V,C[P+12],U,1700485571);V=t(V,Y,X,W,C[P+3],T,2399980690);W=t(W,V,Y,X,C[P+10],R,4293915773);X=t(X,W,V,Y,C[P+1],O,2240044497);Y=t(Y,X,W,V,C[P+8],U,1873313359);V=t(V,Y,X,W,C[P+15],T,4264355552);W=t(W,V,Y,X,C[P+6],R,2734768916);X=t(X,W,V,Y,C[P+13],O,1309151649);Y=t(Y,X,W,V,C[P+4],U,4149444226);V=t(V,Y,X,W,C[P+11],T,3174756917);W=t(W,V,Y,X,C[P+2],R,718787259);X=t(X,W,V,Y,C[P+9],O,3951481745);Y=K(Y,h);X=K(X,E);W=K(W,v);V=K(V,g)}var i=B(Y)+B(X)+B(W)+B(V);return i.toLowerCase()};

/*
const memwatch = require('node-memwatch');

memwatch.on('leak', function(info) { console.log(info) });
*/



/*
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
*/

const file = './config.json'
var config={}

 function getSubitoArticles(url, lastDatetime, callback){
	request({'url':url,
			'proxy':config.proxy, rejectUnauthorized: false}, function (error, response, body) {
		
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
 var bot;//
 const cache_file='cache.json';
 var cached=[];
 var in_error = false;
 
 process.on('uncaughtException', function(err) {
    // handle the error safely
    console.log(err)
})
 var main;
var timer
 function doNextSearch(id){
	
	var s=config.searches[id];

	console.log('\tsearching for',getSearchDesc(s.url),'...')
	var ret_err = getSubitoArticles(s.url, s.lastDatetime, (err, items, lastDatetime) =>{
		if(err){
			console.log('error',err,'restarting....');
			id=config.searches.length -1;
			if(bot)
				bot.stopPolling(); 
			bot=null;			
		}else if(items && items.length>0 && (typeof(s.enabled)=='undefined' || s.enabled)){
			items.forEach(i=>{
				var id=MD5(i.title + (i.specs || i.extra_data.join(' ')));//parseInt(i.idArticle);
				//console.log(id, cached.indexOf(id))
				var show=true;//!(config.no_rimettiincima && cached.indexOf(id)>-1)
				if(s.max_price || s.min_price){
					if(i.price){
						if(s.max_price && i.price && parseInt(extractPrice(i.price))>s.max_price){
							console.log('prezzo troppo alto', i.price, s.max_price, extractPrice(i.price))
							show &= false;
						}
						if(s.min_price && i.price && parseInt(extractPrice(i.price))<s.min_price){
							console.log('prezzo troppo basso', i.price, s.min_price, extractPrice(i.price))
							show &= false;
						}
					 }
				}
				if(show){
					console.log(i.title + '\n' + (i.specs || i.extra_data.join(' ')),'tel: ' + i.phone_number,'\n')
					msg='<a href="'+i.url+'">'+ i.title  + '</a>\n' + (i.specs || i.extra_data.join(' ')) + '\n<strong>' + i.price +'</strong> tel: ' + i.phone_number;// + '\n' + i.img;
					bot.sendMessage(s.chat_id || config.telegram_chatId, msg, {parse_mode:'HTML'});
				}
				if(config.no_rimettiincima && cached.indexOf(id)===-1){
					cached.push(id);
					if(cached.length>1000) cached.pop();
					jsonfile.writeFile(cache_file, cached,function (err) {});
				}
			})
			s.lastDatetime=lastDatetime;
			config.lastRun=new Date().getTime();
			//console.log(s);
			 
			  
		}else{
			console.log('\t\t', getSearchDesc(s.url),(typeof(s.enabled)=='undefined' || s.enabled) ? 'no new items' : 'disabled')
		}
	
		jsonfile.writeFile(file, config,{spaces: 2},function (err) {
			id ++;
			if(id<config.searches.length) {
				doNextSearch(id)
			}else{
				if (timer) {
					clearTimeout(timer);
					timer = 0;
				}
				timer = setTimeout(main, 180*1000);
				console.log('done, going to sleep, wake up in 3 min.\n')
			}
		})
		
	});
 }
 

 
 function main(){
	console.log('start')
	jsonfile.readFile(cache_file, function(err, obj) {
		if(!err) cached = obj;
		jsonfile.readFile(file, function(err, obj) {
			if(err || !obj)
				throw err;
			config=obj;

			/*if(!transporter){
				transporter = nodemailer.createTransport({
				  service: 'gmail',
				  auth: {
					user: config.gmail_user,
					pass: config.gmail_pass
				  }
				});
			}*/
			if(!bot)
				bot=createBot();
			//var searchCount = config.searches.length;

			doNextSearch(0);
		});
	});
	
 }
 
 function getSearchDesc(url){
	 var rx = /q=([^&]*)/gm;
	 var arr = rx.exec(url);
	 return '"' + arr[1].replace('+',' ').replace('%20',' ') + '"'; 
 }

 function createBot(){
	 var bot = new TelegramBot(config.telegram_token, {
	  polling: true,
	  request: {
		proxy: config.proxy,
	  rejectUnauthorized: false},
	});
	bot.on('polling_error', (error) => {
	  console.log(error);  // => 'EFATAL'
	  bot.stopPolling(); 
	  bot=null;
	  setTimeout(main, 30*1000);
	});

	bot.onText(/\/search\sadd (.+)/, (msg, match) => {
	  const chat_id = msg.chat.id;
	  const url = match[1].replace("https:","http:"); 
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
	
	bot.onText(/\/search\son (\d+)/, (msg, match) => {
	  const chatId = msg.chat.id;
	  const id = match[1]; 
	  config.searches[id-1].enabled=true; 
	  jsonfile.writeFile(file, config,{spaces: 2},function (err) {});
	  bot.sendMessage(chatId, 'search ' + id + ' enabled');
	});
	
	bot.onText(/\/search\soff (\d+)/, (msg, match) => {
	  const chatId = msg.chat.id;
	  const id = match[1]; 
	  config.searches[id-1].enabled=false; 
	  jsonfile.writeFile(file, config,{spaces: 2},function (err) {});
	  bot.sendMessage(chatId, 'search ' + id + ' disabled');
	});
	
	bot.onText(/\/search\smax (\d+) (\d+)/, (msg, match) => {
	  const chatId = msg.chat.id;
	  const id = match[1]; 
	  const val = match[2];
	  config.searches[id].max_price=val; 
	  jsonfile.writeFile(file, config,{spaces: 2},function (err) {});
	  bot.sendMessage(chatId, 'search ' + id + ' max ' + val);
	});
	
	bot.onText(/\/search\smin (\d+) (\d+)/, (msg, match) => {
	  const chatId = msg.chat.id;
	  const id = match[1]; 
	  const val = match[2];
	  config.searches[id].min_price=val; 
	  jsonfile.writeFile(file, config,{spaces: 2},function (err) {});
	  bot.sendMessage(chatId, 'search ' + id + ' min ' + val);
	});

	bot.onText(/\/search list/, (msg, match) => {
	  const chatId = msg.chat.id;
	  var id=1;
	  var ret='';
	  config.searches.forEach(s =>{
		  ret += '\n<b>' + id++ + '</b> ' + getSearchDesc(s.url) +'<b>';
		  if(typeof s.enabled !== 'undefined' && s.enabled==false) ret +='\tdisabled'
		  if(s.max_price) ret +='\tmax ' + s.max_price +' €'
		  if(s.min_price) ret +='\tmin ' + s.min_price +' €'
		  ret += '</b>'
	  });
	  bot.sendMessage(chatId, ret, {parse_mode:'HTML'});
	});
	bot.onText(/\help/, (msg, match) => {
	  const chatId = msg.chat.id;
	  bot.sendMessage(chatId,'available commands:\n/search add [url]\n/search list\n/search on [id]\n/search off [id]\n/search del [id]\n/search max [id] [maxprice]\n/search min [id] [minprice]\n/info');
	});
	bot.onText(/\info/, (msg, match) => {
	  const chatId = msg.chat.id;
	  bot.sendMessage(chatId,'chatId: ' + chatId +'\nstarted: '  + fDate(startDate) +  '\nlast run: ' + fDate(config.lastRun) +'\nsearch count: ' + config.searches.length);
	});
	return bot;
 }
 
function fDate(d){return new Date(d).toISOString().substring(0,19).replace('T',' ')}
function extractPrice(priceString) {
  var rx = /[\d\.]*/g;
  var arr = rx.exec(priceString);
  return arr[0].replace('.',''); 
}

main();
