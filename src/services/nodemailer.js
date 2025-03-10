import nodemailer from 'nodemailer'


const transport = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: "",
        pass:""
    }
})

const send = async(to,subject,text,html)=>{
    try {
        const mailOptions = {
            from : user,
            to,
            subject,
            text,
            html,
        }
        const info = await transport.sendMail(mailOptions)
        console.log( info.response)
    } catch (error) {
        console.log(error ,"Error in sending mail")
    }
}

export {send}