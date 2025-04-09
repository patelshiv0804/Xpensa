// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');
// const Handlebars = require('handlebars');
// const config = require("../utils/config");

// const generateExpensePDF = async (userExpenseReport, outputPath) => {
//   const templateHtml = fs.readFileSync(path.join(__dirname, '../templates/expense-report-template.html'), 'utf8');
//   const template = Handlebars.compile(templateHtml);

//   // Ensure data is passed as JSON strings
//   const breakdown = userExpenseReport.breakdown;

//   const categoryTotals = {};

//   // Aggregate total amount for each category
//   breakdown.forEach(entry => {
//     if (!categoryTotals[entry.category]) {
//       categoryTotals[entry.category] = 0;
//     }
//     categoryTotals[entry.category] += entry.amount;
//   });

//   // Prepare chartLabels and chartData
//   const chartLabels = JSON.stringify(Object.keys(categoryTotals));
//   const chartData = JSON.stringify(Object.values(categoryTotals));

//   const imagePath = path.join(__dirname, '../images/xpensa.png');
//   const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
//   const base64Image = `data:image/png;base64,${imageBase64}`;




//   const html = template({
//     ...userExpenseReport,
//     chartLabels,
//     chartData,
//     imageSrc: base64Image,
//   });

//   const browser = await puppeteer.launch({
//     headless: true,  // Use 'new' only if running in modern Chromium versions
//     args: ['--no-sandbox', '--disable-setuid-sandbox']
//   });

//   const page = await browser.newPage();
//   await page.setContent(html, { waitUntil: 'networkidle0' });

//   // Wait for Chart.js to render
//   await page.waitForFunction(() => {
//     return document.querySelector('#expenseChart') !== null;
//   });

//   await page.pdf({
//     path: outputPath,
//     format: 'A4',
//     printBackground: true,
//   });

//   await browser.close();
// };

// module.exports = generateExpensePDF;


// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');
// const Handlebars = require('handlebars');
// const config = require("../utils/config");

// // Register Handlebars helper for JSON stringification
// Handlebars.registerHelper('json', function (context) {
//   return JSON.stringify(context);
// });

// const generateExpensePDF = async (userExpenseReport, outputPath) => {
//   try {
//     // Read the HTML template
//     const templatePath = path.join(__dirname, '../templates/expense-report-template.html');

//     if (!fs.existsSync(templatePath)) {
//       throw new Error(`Template file not found at: ${templatePath}`);
//     }

//     const templateHtml = fs.readFileSync(templatePath, 'utf8');
//     const template = Handlebars.compile(templateHtml);

//     // Process data for the chart
//     const breakdown = userExpenseReport.breakdown || [];
//     const categoryTotals = {};

//     // Aggregate total amount for each category
//     breakdown.forEach(entry => {
//       if (!categoryTotals[entry.category]) {
//         categoryTotals[entry.category] = 0;
//       }
//       categoryTotals[entry.category] += entry.amount;
//     });

//     // Prepare chartLabels and chartData
//     const chartLabels = Object.keys(categoryTotals);
//     const chartData = Object.values(categoryTotals);

//     // Get logo image
//     let base64Image = '';
//     try {
//       const imagePath = path.join(__dirname, '../images/xpensa.png');
//       if (fs.existsSync(imagePath)) {
//         const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
//         base64Image = `data:image/png;base64,${imageBase64}`;
//       }
//     } catch (err) {
//       console.warn('Logo image not found, continuing without it');
//     }

//     // Render the HTML with the data
//     const html = template({
//       ...userExpenseReport,
//       chartLabels: chartLabels,
//       chartData: chartData,
//       imageSrc: base64Image || '',
//     });

//     // Launch browser for PDF generation
//     const browser = await puppeteer.launch({
//       headless: true,
//       args: ['--no-sandbox', '--disable-setuid-sandbox']
//     });

//     const page = await browser.newPage();

//     // Set page content and wait for chart rendering
//     await page.setContent(html, { waitUntil: 'networkidle0' });

//     // Wait for chart to render (with timeout)
//     try {
//       await page.waitForFunction(() => {
//         return document.querySelector('#expenseChart') !== null;
//       }, { timeout: 5000 });

//       // Additional wait to ensure chart is fully rendered
//       await page.waitForTimeout(1000);
//     } catch (err) {
//       console.warn('Warning: Chart may not have rendered completely', err);
//     }

//     // Generate PDF
//     await page.pdf({
//       path: outputPath,
//       format: 'A4',
//       printBackground: true,
//       margin: {
//         top: '20px',
//         right: '20px',
//         bottom: '20px',
//         left: '20px'
//       }
//     });

//     // Close browser
//     await browser.close();

//     return outputPath;
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     throw error;
//   }
// };

// module.exports = generateExpensePDF;

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

Handlebars.registerHelper('json', function (context) {
  return JSON.stringify(context);
});


const generateExpensePDF = async (userExpenseReport, outputPath) => {
  const templateHtml = fs.readFileSync(path.join(__dirname, '../templates/expense-report-template.html'), 'utf8');
  const template = Handlebars.compile(templateHtml);

  // Ensure data is passed as JSON strings
  const breakdown = userExpenseReport.breakdown;

  const categoryTotals = {};

  // Aggregate total amount for each category
  breakdown.forEach(entry => {
    if (!categoryTotals[entry.category]) {
      categoryTotals[entry.category] = 0;
    }
    categoryTotals[entry.category] += entry.amount;
  });

  // Prepare chartLabels and chartData
  const chartLabels = JSON.stringify(Object.keys(categoryTotals));
  const chartData = JSON.stringify(Object.values(categoryTotals));

  const imagePath = path.join(__dirname, '../images/xpensa.png');
  const imageBase64 = fs.readFileSync(imagePath, { encoding: 'base64' });
  const base64Image = `data:image/png;base64,${imageBase64}`;




  const html = template({
    ...userExpenseReport,
    chartLabels,
    chartData,
    imageSrc: base64Image,
  });

  const browser = await puppeteer.launch({
    headless: true,  // Use 'new' only if running in modern Chromium versions
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  // Wait for Chart.js to render
  await page.waitForFunction(() => {
    return document.querySelector('#expenseChart') !== null;
  });

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
  });

  await browser.close();
};

module.exports = generateExpensePDF;
