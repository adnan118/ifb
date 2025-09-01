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

// وظيفة لحساب الإيرادات بناءً على السنة والشهر
const getRevenueByYearAndMonth = async (req, res) => {
  try {
    const { year, month } = req.body;

    // التحقق من وجود السنة
    if (!year) {
      return res.status(400).json({
        status: "failure",
        message: "Year is required",
      });
    }

    const connection = await getConnection();

    let yearlyRevenueQuery;
    let monthlyRevenueQuery;
    let yearlyParams = [year];
    let monthlyParams = [year];

    // حساب الإيرادات السنوية
    yearlyRevenueQuery = `
      SELECT 
        SUM(payments_amount) as total_revenue,
        COUNT(*) as total_payments
      FROM payments 
      WHERE YEAR(payments_date) = ?
    `;

    // حساب الإيرادات الشهرية لكل شهر في السنة
    let monthlyRevenueByMonthQuery = `
      SELECT 
        MONTH(payments_date) as month,
        SUM(payments_amount) as monthly_revenue,
        COUNT(*) as monthly_payments
      FROM payments 
      WHERE YEAR(payments_date) = ?
      GROUP BY MONTH(payments_date)
      ORDER BY MONTH(payments_date)
    `;

    // إذا تم تحديد شهر معين، احسب الإيرادات لذلك الشهر فقط
    if (month) {
      monthlyRevenueQuery = `
        SELECT 
          SUM(payments_amount) as monthly_revenue,
          COUNT(*) as monthly_payments
        FROM payments 
        WHERE YEAR(payments_date) = ? AND MONTH(payments_date) = ?
      `;
      monthlyParams.push(month);
    }

    // تنفيذ الاستعلامات
    const [yearlyResult] = await connection.execute(yearlyRevenueQuery, yearlyParams);
    const [monthlyByMonthResult] = await connection.execute(monthlyRevenueByMonthQuery, [year]);
    
    let specificMonthResult = null;
    if (month) {
      const [specificMonth] = await connection.execute(monthlyRevenueQuery, monthlyParams);
      specificMonthResult = specificMonth[0];
    }

    await connection.end();

    // تنسيق البيانات
    const yearlyRevenue = yearlyResult[0];
    
    // إنشاء مصفوفة للأشهر الـ 12 مع القيم الافتراضية
    const monthsData = [];
    for (let i = 1; i <= 12; i++) {
      const monthData = monthlyByMonthResult.find(item => item.month === i);
      monthsData.push({
        month: i,
        monthly_revenue: monthData ? parseFloat(monthData.monthly_revenue) || 0 : 0,
        monthly_payments: monthData ? monthData.monthly_payments || 0 : 0
      });
    }

    const responseData = {
      year: parseInt(year),
      yearly_summary: {
        total_revenue: parseFloat(yearlyRevenue.total_revenue) || 0,
        total_payments: yearlyRevenue.total_payments || 0
      },
      monthly_breakdown: monthsData
    };

    // إضافة بيانات الشهر المحدد إذا تم طلبه
    if (month && specificMonthResult) {
      responseData.specific_month = {
        month: parseInt(month),
        monthly_revenue: parseFloat(specificMonthResult.monthly_revenue) || 0,
        monthly_payments: specificMonthResult.monthly_payments || 0
      };
    }

    res.status(200).json({
      status: "success",
      message: "Revenue data fetched successfully",
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
