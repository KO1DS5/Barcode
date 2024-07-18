const fs = require('fs');
const path = require('path');

exports.handler = async function(event, context) {
    try {
        const body = JSON.parse(event.body);
        const imgData = body.imgData.replace(/^data:image\/png;base64,/, '');
        const buffer = Buffer.from(imgData, 'base64');
        const fileName = `barcode_${Date.now()}.png`;
        const filePath = path.join('/tmp', fileName);

        fs.writeFileSync(filePath, buffer);

        const uploadsDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
        }

        const publicFilePath = path.join(uploadsDir, fileName);
        fs.copyFileSync(filePath, publicFilePath);

        return {
            statusCode: 200,
            body: JSON.stringify({
                url: `https://YOUR_NETLIFY_DOMAIN/uploads/${fileName}`
            })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
