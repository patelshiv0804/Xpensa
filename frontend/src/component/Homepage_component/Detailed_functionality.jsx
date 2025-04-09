import Detailed_first from "./Detailed_first"
import Detailed_second from "./Detailed_second"
import capture_categorize_img from "../../../Images/capture_categorize.jpeg"
import report_img from "../../../Images/detailed_report.jpg"
import expense_analysis_img from "../../../Images/expense_analysis.jpeg"
import stay_on_alert_img from "../../../Images/stay_on_alert.jpeg"

export default function Detailed_functionality() {
    return (
        <div>
            <Detailed_first imgsrc={capture_categorize_img} heading="Capture & Categorize Expense Instantly" text="Easily capture your receipts with your phone’s camera. Our smart technology reads and extracts key details—like amounts, dates, and vendors—so you never have to manually enter your expenses again." />
            <Detailed_second imgsrc={report_img} heading="Quick & Detailed Reports" text="Generate detailed spending reports in just a few clicks. You can download them as PDFs for easy sharing or as Excel files for a deeper look, making tax time and budgeting simple." />
            <Detailed_first imgsrc={expense_analysis_img} heading="Effortless Expense Analysis" text="Easily see how you spend your money with simple charts and graphs. Track your spending over time to plan better, save more, and celebrate your progress." />
            <Detailed_second imgsrc={stay_on_alert_img} heading="Quick & Stay on Track Alerts" text="Set your monthly budget and get alerts when you’re close to your limit. Simple notifications help you know when to adjust your spending." />
        </div>
    )
}
