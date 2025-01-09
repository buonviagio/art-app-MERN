import { v2 as cloudinary } from "cloudinary";

const pictureDelete = async (public_id) => {
    try {
        const deletedImage = await cloudinary.uploader.destroy(public_id);
        console.log('deletedImage :>> ', deletedImage);
        return deletedImage
    } catch (error) {
        console.log(`Error is => ${error}`.bgBlue);
        return null;
    }
}

export { pictureDelete }