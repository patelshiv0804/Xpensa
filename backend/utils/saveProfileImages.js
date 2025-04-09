const path = require('path');

const saveProfileImages = (originalName) => {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
    return `${timestamp}_${originalName}`;
};

module.exports = saveProfileImages;
