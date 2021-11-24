const TeleBot = require('telebot')
const admin = require('./admin')
const { getStatus } = require('./database')
const { send_log, query, count } = require('./query.js')
require('dotenv').config()

const token = process.env.API_KEY
const bot = new TeleBot(token)

bot.on(['/start', '/hello'], (msg) => msg.reply.text('[🍑] > به سریع ترین بات موزیک تلگرام خوش اومدی😉✅ \n اسم موزیک یا لینک یوتوبشو برام بفرست و خودت نتیجه رو ببین‼️🔞 \n اگه حال کردی مارو به دوستات معرفی کن♥️ \n\n [🍑] > Hi There, Welcome to the fastest telegram music bot ever! Wanna liten to a music? Send me the name or its Youtube URL 😉'))

bot.on('/donate', (msg) => msg.reply.text('[IRAN]> https://idpay.ir/nelody\n\n[PAYPAL]> https://www.paypal.me/znightfuryz'))

bot.on('/joom', msg => {
    if (msg.from.id === 111733645 || msg.from.id === 214619416)
        getStatus()
            .then(res => msg.reply.text(`Users: ${res.users}\n\nMemory: All ${count.all} | Success ${count.success}\n\nDatabase: All ${res.all} | Success ${res.success}`))
            .catch((e) => send_log(bot, `User: ${msg.from.id}\nQuery: ${msg.query}\nError: ${JSON.stringify(e)}`))
})

bot.on('/send', msg => {
    if (msg.from.id !== 111733645 || msg.from.id !== 214619416) return

    const query = msg.text.split('\n')
    const user_id = query[0].split(' ')[1]

    query.shift()
    admin.sendToUser(bot, msg, user_id, query.join('\n'))
})

bot.on('/user', msg => (msg.from.id === 111733645 || msg.from.id === 214619416) && admin.searchUser(msg))

bot.on('text', async (msg) => {
    const bannedCmds = ['/joom', '/donate', '/start', '/hello', '/user', '/send']
    if (bannedCmds.some((cmd => msg.text.startsWith(cmd)))) return
    if (msg.chat.id === -1001749065212 || msg.chat.id === -1001765223291) return

    query(bot, msg)
})

bot.start()

// Interval Test Log
setInterval(() => {
    const msg = {
        text: "Tataloo Amanat",
        chat: {
            id: -1001749065212
        },
        message_id: 1,
        from: {
            id: 1,
            username: "mmd",
            first_name: "gholi"
        }
    }
    query(bot, msg, true)
}, 60 * 60 * 1000)
