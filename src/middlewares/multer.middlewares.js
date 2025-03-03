import multer from "multer";


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"public/avatar")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+"^&^^"+file.originalname)
    }
})

 const fileFilter = (req,file,cb)=>{
        const allowedMimeTypes =[
            "image/png",
            "image/jpeg"
        ]
        if(allowedMimeTypes.includes(file.mimetype)){
            cb(null,true)}
        else{
            cb(new Error("File Type Not Matched"),false)
        }
        
 }

export const Upload = multer(
    {storage:storage,
        fileFilter:fileFilter,
        limits:{fileSize:5*1024*1024}
    }
)