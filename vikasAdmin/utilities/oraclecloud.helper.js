const AWS = require('aws-sdk');
const s3 = new AWS.S3({
	region: process.env.S3_REGION,
	endpoint: process.env.S3_ENDPOINT,
	accessKeyId: process.env.AWS_ACCESS_KEY,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	s3ForcePathStyle: true,
	signatureVersion: 'v4',
});
async function saveIconToOracle(imageBuffer, imageContentType, fileName) {
	const s3Params = {
		Bucket: process.env.S3_BUCKET,
		Key: fileName,
		Expires: 60,
		Body: imageBuffer,
		ContentType: imageContentType,
	};
	return new Promise(function (resolve, reject) {
		s3.putObject(s3Params, (e, d) => {
			if (e) {
				reject();
			} else {
				resolve();
			}
		});
	});
};
module.exports = {saveIconToOracle};
