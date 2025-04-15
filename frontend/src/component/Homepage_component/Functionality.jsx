import { useNavigate } from "react-router-dom";
// import Functions from "./Functions";
import Functions from "./Functions";
import styles from "../../styles/Homepage_styles/functionality.module.css";
import Scan_bills_logo from "../../../logos/scanner.png";
import Export_receipt_logo from "../../../logos/download_pdf.png";
import Visual_analysis_logo from "../../../logos/analysis1.png";
import Budget_alert_logo from "../../../logos/alert.png";

export default function Functionality() {
    const navigate = useNavigate();

    const handleScanBillsClick = () => {
        navigate("/scan_bills");
    };

    const handleExportExpenditureClick = () => {
        navigate("/dashboard", { state: { section: "export_receipt" } });
    };

    const handleVisualAnalysisClick = () => {
        navigate("/dashboard", { state: { section: "expense_analysis" } });
    };

    return (
        <div className={styles.prop}>
            <p className={styles.heading}>What makes us stand out</p>
            <br />
            <div className={styles.functions}>
                <Functions
                    onClick={handleScanBillsClick}
                    imagesrc={Scan_bills_logo}
                    text="Scan Bills"
                    animationSpeed="normal"
                />
                <Functions
                    onClick={handleExportExpenditureClick}
                    imagesrc={Export_receipt_logo}
                    text="Export Expenditure"
                    animationSpeed="slow"
                />
                <Functions
                    onClick={handleVisualAnalysisClick}
                    imagesrc={Visual_analysis_logo}
                    text="Visual Analysis"
                    animationSpeed="slower"
                />
                <Functions
                    imagesrc={Budget_alert_logo}
                    text="Budget Alert"
                    animationSpeed="slowest"
                />
            </div>
        </div>
    );
}
