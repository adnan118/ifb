const { getAllData } = require("../../controllers/functions");
const { getConnection } = require("../../controllers/db");

const getPayments = async (req, res) => {
  try {
    const result = await getAllData("payments");

    if (result.status === "success") {
      res.status(200).json({
        status: "success",
        message: "Payments fetched successfully",
        data: result.data,
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: result.message || "Error fetching payments data",
      });
    }
  } catch (error) {
    console.error("Error in getData payments:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

// وظيفة لحساب الإيرادات والدفعات بناءً على السنة والشهر
const getRevenueByYearAndMonth = async (req, res) => {
  try {
    const { date } = req.body; // تتوقع تاريخ بصيغة "2025-09" أو "2025"

    // التحقق من وجود التاريخ
    if (!date) {
      return res.status(400).json({
        status: "failure",
        message: "Date is required (format: YYYY or YYYY-MM)",
      });
    }

    const connection = await getConnection();

    let query;
    let params = [];
    let isMonthly = false;

    // تحديد نوع الاستعلام بناءً على صيغة التاريخ
    if (date.includes('-')) {
      // إذا كان التاريخ يحتوي على شهر (مثل 2025-09)
      const [year, month] = date.split('-');
      isMonthly = true;
      
      query = `
        SELECT 
          SUM(payments_amount) as total_revenue,
          COUNT(*) as total_payments,
          payments.*
        FROM payments 
        WHERE YEAR(payments_date) = ? AND MONTH(payments_date) = ?
      `;
      params = [year, month];
    } else {
      // إذا كان التاريخ سنة فقط (مثل 2025)
      query = `
        SELECT 
          SUM(payments_amount) as total_revenue,
          COUNT(*) as total_payments,
          payments.*
        FROM payments 
        WHERE YEAR(payments_date) = ?
      `;
      params = [date];
    }

    // تنفيذ الاستعلام للحصول على الإحصائيات
    const [summaryResult] = await connection.execute(
      query.replace('payments.*', '1'), // استعلام للإحصائيات فقط
      params
    );

    // تنفيذ الاستعلام للحصول على تفاصيل الدفعات
    const [paymentsResult] = await connection.execute(
      query.replace('SUM(payments_amount) as total_revenue,\n          COUNT(*) as total_payments,\n          ', ''),
      params
    );

    await connection.end();

    // تنسيق البيانات
    const summary = summaryResult[0];
    
    const responseData = {
      period: date,
      period_type: isMonthly ? "monthly" : "yearly",
      summary: {
        total_revenue: parseFloat(summary.total_revenue) || 0,
        total_payments: summary.total_payments || 0
      },
      payments: paymentsResult || []
    };

    res.status(200).json({
      status: "success",
      message: `${isMonthly ? 'Monthly' : 'Yearly'} revenue and payments data fetched successfully`,
      data: responseData,
    });

  } catch (error) {
    console.error("Error in getRevenueByYearAndMonth:", error);
    res.status(500).json({
      status: "failure",
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  getPayments,
  getRevenueByYearAndMonth
};
