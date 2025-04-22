

// const puppeteer = require('puppeteer');
// const fs = require('fs');
// const path = require('path');
// const Handlebars = require('handlebars');

// Handlebars.registerHelper('json', function (context) {
//   return JSON.stringify(context);
// });


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

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const { writeFile } = require('fs/promises');


Handlebars.registerHelper('json', function (context) {
  return JSON.stringify(context);
});

const BROWSERLESS_TOKEN = process.env.BROWSERLESS_TOKEN;
const BROWSERLESS_URL = `https://production-sfo.browserless.io/pdf?token=${BROWSERLESS_TOKEN}`;

const generateExpensePDF = async (userExpenseReport, outputPath) => {
  try {
    console.log('Starting PDF generation...');

    const templateHtml = fs.readFileSync(
      path.join(__dirname, '../templates/expense-report-template.html'),
      'utf8'
    );
    const template = Handlebars.compile(templateHtml);

    const breakdown = userExpenseReport.breakdown;
    const categoryTotals = {};

    breakdown.forEach(entry => {
      if (!categoryTotals[entry.category]) {
        categoryTotals[entry.category] = 0;
      }
      categoryTotals[entry.category] += entry.amount;
    });

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

    const response = await fetch(BROWSERLESS_URL, {
      method: 'POST',
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html,
        options: {
          format: 'A4',
          printBackground: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Browserless API Error: ${errorText}`);
    }

    const buffer = await response.arrayBuffer();
    await writeFile(outputPath, Buffer.from(buffer));

    console.log(`PDF saved as ${outputPath}`);
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

module.exports = generateExpensePDF;
