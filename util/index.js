function getFieldsfromDataIfPresent(fieldsArray, data) {
  const selectedFields = {};
  for (let i = 0; i < fieldsArray.length; i++) {
    if (data[fieldsArray[i]] !== undefined) selectedFields[fieldsArray[i]] = data[fieldsArray[i]];
  }
  return selectedFields;
}
module.exports.getFieldsfromDataIfPresent = getFieldsfromDataIfPresent;

module.exports.okRes = (data) => ({ status: 'ok', data });

module.exports.errorRes = (data, message) => {
  console.log('DATA: ', data);
  console.log('MESSAGE: ', message);
  return ({ status: 'error', message, error: data });
}