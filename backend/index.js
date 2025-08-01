import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { nanoid } from 'nanoid'
import dotenv from 'dotenv'
dotenv.config()

import QRCode from 'qrcode'

const app=express()
const port=process.env.PORT || 4000
app.use(cors())
app.use(express.json())

//connection the database
try {
    mongoose.connect(process.env.DATABASE_URL)
    console.log("DB connected")
} catch (error) {
    console.log(error)
}

// create user/Url model based on schema
const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
    clicks: {
        type:Number,
        default:0
    }
})

const Url = mongoose.model("Url",urlSchema)

// now create api - ek to database me data bhejne k liye aur ek lane k liye...
app.post('/api/short',async (req,res)=>{
    try {
        const {originalUrl} =  req.body
        if(!originalUrl){
            return res.status(400).json({message:"originalUrl required"})
        }
        // just ek Url ka ek object banaya
        // yaha nanoid id k base pr string generate kr shortUrl me dal jayega.
        const shortUrl = nanoid(8)
        const url = new Url({originalUrl, shortUrl})
        // for qrcode 2 line
        const myUrl = `http://localhost:3000/${shortUrl}`
        const qrCodeImg = await QRCode.toDataURL(myUrl)
        await url.save()
        return res.status(200).json({message:"URL Generated", shortUrl: myUrl,qrCodeImg}) //url: url
    } catch (error) {
        return res.status(500).json({message:"Internal server error"})
    }
})

// another api-jb user shortUrl pr click krega to originalUrl open hona chahiye, iska data leke aayenge database se..
app.get('/:shortUrl',async (req,res)=>{
    try {
        const { shortUrl } = req.params
        const url = await Url.findOne({ shortUrl })
        console.log("url found",url)
        if(url){
            url.clicks++
            await url.save()
            return res.redirect(url.originalUrl)
        }else{
            return res.status(404).json({message:"URL not found"})
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({message:"Internal server error"})
    }
})

app.listen(port ,()=>{
    console.log(`server is connected at ${port}`)
})