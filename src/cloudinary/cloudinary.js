

export const uploadImageToCloudinary = (image) => {
    const data = new FormData()
    data.append('file', image)
    data.append('upload_preset', 'notebuddy')
    data.append('cloud_name', 'dvs8f5xki')

    return new Promise((res, rej) => {
        fetch('https://api.cloudinary.com/v1_1/dvs8f5xki/image/upload', {
            method: "post",
            body: data
        }).then(res => res.json()).then(data => {
            console.log('cloudinary_data', data);
            res(data)
        }).catch((err) => rej(err))
    })
}

export const fetchAllImagesFromCloudinary = async () => {

    const results = await fetch(`https://api.cloudinary.com/v1_1/dvs8f5xki/resources/image`, {
        headers: {
            Authorization: `Basic ${Buffer.from('575383171851765' + ':' + 'o26PLvzFEHT3YhD8nYpXz6QzFJ4').toString('base64')}`
        }
    }).then(r => r.json());

    const { resources } = results;

    const images = resources.map(resource => {
        return {
            id: resource.asset_id,
            title: resource.public_id,
            image: resource.secure_url,
        }
    });

    console.log('images', images);
};