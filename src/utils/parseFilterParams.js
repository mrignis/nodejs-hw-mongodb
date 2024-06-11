/* eslint-disable no-unused-vars */
const parseContactType = (contactType) => {
    const isString = typeof contactType === 'string';
    if (!isString) return;
  
    const isValidType = ['work', 'home', 'personal'].includes(contactType);
    if (!isValidType) return;
    return contactType;
  };
  
  const parseBoolean = (value) => {
    const isString = typeof value === 'string';
    if (!isString) return;
    return JSON.parse(value);
  };
  
  export const parseFilterParams = (query) => {
    const { type, isFavourite } = query;
  
    const parsedType = parseContactType(type);
    const parsedIsFavourite = parseBoolean(isFavourite);
  

  };