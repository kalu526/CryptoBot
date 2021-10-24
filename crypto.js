const Telegraf=require('telegraf');
const axios=require('axios');

const bot=new Telegraf('2079747549:AAEbDRn7cumBE8H-WBG64c6SQVbJ-i5OIT0');

const apikey="a6a4ddc899debe5a95e1ffcf142534703e70409e628f239049dfce428f654d2d";
const startMessage="Welcome, This bot help you to get CryptoCurrency information";

bot.command("start",(ctx)=>{
    bot.telegram.sendMessage(ctx.chat.id,startMessage,{
       reply_markup:{
           inline_keyboard:[
               [
                   {text:"cryptoPrice",callback_data:"price"},
                   {text:"cryptoMarkCap",url:'https://coinmarketcap.com/'}
               ]
           ]
       }
    })
})
bot.action("price",(ctx)=>{
    const priceMessage="Get Price Information .Select One Of The CryptoCurrency Below";
    ctx.deleteMessage();
    bot.telegram.sendMessage(ctx.chat.id,priceMessage,{
        reply_markup:{
            inline_keyboard:[
                [
                    {text:"BTC",callback_data:"PRICE-BTC"},
                    {text:"ETH",callback_data:"PRICE-ETH"}
                ],
                [
                    {text:"BCH",callback_data:"PRICE-BCH"},
                    {text:"LTC",callback_data:"PRICE-LTC"}
                ],
                [
                    {text:"BACK TO MENU",callback_data:"MENU"},
                    
                ],
            ]
        }  
    })
})

bot.action("MENU",(ctx)=>{
    ctx.deleteMessage();
    const priceMessage="Get Price Information .Select One Of The CryptoCurrency Below";
    bot.telegram.sendMessage(ctx.chat.id,priceMessage,{
        reply_markup:{
            inline_keyboard:[
                [
                    {text:"cryptoPrice",callback_data:"price"},
                    {text:"cryptoMarkCap",url:'https://coinmarketcap.com/'}
                ]
            ]
        }  
    })
})
let priceactionlist=['PRICE-BTC','PRICE-ETH','PRICE-BCH','PRICE-LTC'];

bot.action(priceactionlist,async (ctx)=>{
    let symbol=ctx.match.split('-')[1];
    console.log(symbol);
   
    try{
     let res=await axios.get(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD,EUR&api_key=${apikey}`);
     
     let data=res.data.DISPLAY[symbol].USD
     let message=
     `
     Symbol:${symbol}
     Price:${data.PRICE}
     Open:${data.OPENDAY}
     High:${data.HIGHDAY}
     Low:${data.LOWDAY}
     Supply:${data.SUPPLY}
     Market Cap:${data.MKTCAP}
     `;
     ctx.deleteMessage();
     bot.telegram.sendMessage(ctx.chat.id,message,{
         reply_markup:{
             inline_keyboard:[
                 [
                     {text:"BackPriceMenu", callback_data:"price"}
                 ]
             ]

             
         }
     })
    }catch(err){
        console.log("error");
    }
   
})
bot.command("info",(ctx)=>{
    bot.telegram.sendMessage(ctx.chat.id,"Bot Info",{
       reply_markup:{
           keyboard:[
               [
                   {text:"Credits"},
                   {text:"API"}
               ]
           ],
           resize_keyboard:true,
           one_time_keyboard:true
       } 
    })
})
bot.hears("Credits",(ctx)=>{
    ctx.reply("This Bot Was made By "+ ctx.from.first_name);
})
bot.hears("API",(ctx)=>{
    ctx.reply("This Bot Use CryptoCompare API");
})
bot.launch();