// // const isLocal = (url, origin) => {
//   const { origin } = new URL(lurl);
//   return url.origin === origin;
// };

// const load = (url) => axios.get(url, { responseType: 'arraybuffer' })
//   .then(({ data }) => data);

// const downloadBinaryResource = (resourceUrl, filepath) => {
//     logRequest("Requesting binary '%s'", resourceUrl);
//     return axios.get(resourceUrl, { responseType: 'stream' })
//       .then((response) => response.data.pipe(fs.createWriteStream(filepath)))

// fs.access(assetsDirPath, constants.F_OK)