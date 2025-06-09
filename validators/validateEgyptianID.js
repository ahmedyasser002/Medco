// validateEgyptianId.js

function isValidEgyptianNationalID(id) {
    if (!/^[23]\d{13}$/.test(id)) return false;
  
    const century = id[0] === '2' ? 1900 : 2000;
    const year = parseInt(id.substr(1, 2), 10);
    const month = parseInt(id.substr(3, 2), 10);
    const day = parseInt(id.substr(5, 2), 10);
  
    // Check valid date
    const dob = new Date(century + year, month - 1, day);
    if (
      dob.getFullYear() !== century + year ||
      dob.getMonth() + 1 !== month ||
      dob.getDate() !== day
    ) {
      return false;
    }
  
    // Check governorate code
    const govCode = parseInt(id.substr(7, 2), 10);
    if (govCode < 1 || govCode > 88) return false;
  
    return true;
  }
  
  module.exports = { isValidEgyptianNationalID };
  