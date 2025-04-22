

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

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');
const os = require('os');

Handlebars.registerHelper('json', function (context) {
  return JSON.stringify(context);
});

const generateExpensePDF = async (userExpenseReport, outputPath) => {
  try {
    console.log('Starting PDF generation...');
    
    // Check if Chrome executable exists
    const execPath = '/opt/render/.cache/puppeteer/chrome/linux-1045629/chrome-linux/chrome';
    const exists = fs.existsSync(execPath);
    console.log(`Chrome executable path: ${execPath}`);
    console.log(`Chrome executable exists: ${exists}`);
    
    // Get OS platform details for debugging
    console.log(`OS Platform: ${os.platform()}`);
    console.log(`OS Type: ${os.type()}`);
    
    const templateHtml = fs.readFileSync(path.join(__dirname, '../templates/expense-report-template.html'), 'utf8');
    const template = Handlebars.compile(templateHtml);

    // Rest of your existing code...
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

    console.log('Launching browser...');
    const browser = await puppeteer.launch({
      headless: true,
      executablePath: execPath,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--single-process'
      ]
    });

    console.log('Browser launched successfully');
    const page = await browser.newPage();
    console.log('New page created');
    await page.setContent(html, { waitUntil: 'networkidle0' });
    console.log('Page content set');

    await page.waitForFunction(() => {
      return document.querySelector('#expenseChart') !== null;
    });
    console.log('Chart rendered');

    await page.pdf({
      path: outputPath,
      format: 'A4',
      printBackground: true,
    });
    console.log(`PDF saved to: ${outputPath}`);

    await browser.close();
    console.log('Browser closed');
    return true;
  } catch (error) {
    console.error('PDF generation error:', error);
    throw error;
  }
};

module.exports = generateExpensePDF;