import { v2 as cloudinary } from "cloudinary";


const pictureUpload = async (filePath) => {
    try {
        const uploadedImage = await cloudinary.uploader.upload(filePath, {
            folder: "projrct-app"
        });
        console.log('uploadedImage :>> ', uploadedImage);
        return uploadedImage
    } catch (error) {
        console.log(`Error is => ${error}`.bgBlue);
        return null;
    }
}

export { pictureUpload }
