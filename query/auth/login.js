const { getAllData, updateData } = require("../../controllers/functions");
const bcrypt = require("bcrypt");
// START ADDED: JWT auth helpers
const {
  ACCESS_TOKEN_EXPIRES_IN,
  createAccessToken,
  sanitizeUser,
} = require("../../controllers/authToken");
// END ADDED: JWT auth helpers

// START ADDED: build additive auth response payload
function buildAuthPayload(user, role) {
  const sanitizedUser = sanitizeUser(user);
  const accessToken = createAccessToken({
    id: sanitizedUser.users_id || sanitizedUser.id || sanitizedUser.phone,
    role,
    phone: sanitizedUser.users_phone || sanitizedUser.phone || null,
  });

  return {
    data: sanitizedUser,
    token: accessToken,
    accessToken,
    role,
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  };
}
// END ADDED: build additive auth response payload

async function LoginUser(req, res) {
  try {
    res.once("finish", () => {
      console.log("LOGIN_USER_RESPONSE_FINISHED", {
        statusCode: res.statusCode,
        headersSent: res.headersSent,
      });
    });

    res.once("close", () => {
      console.log("LOGIN_USER_RESPONSE_CLOSED", {
        statusCode: res.statusCode,
        headersSent: res.headersSent,
      });
    });

    console.log("LOGIN_USER_START", {
      body: req.body,
      hasPhone: !!req.body?.users_phone,
      hasPassword: !!req.body?.users_password,
    });

    const { users_phone, users_password } = req.body;

    if (!users_phone || !users_password) {
      console.log("LOGIN_USER_VALIDATION_FAILED", {
        hasPhone: !!users_phone,
        hasPassword: !!users_password,
      });
      return res.status(400).json({
        status: "failure",
        message: "You must enter your phone and password.",
      });
    }

    const userDatalastLog = {
      last_log: new Date(),
    };

    const result = await getAllData("users", "users_phone = ?", [users_phone]);
    console.log("LOGIN_USER_QUERY_RESULT", {
      status: result?.status,
      count: result?.data?.length ?? 0,
    });

    if (result.status === "success" && result.data.length > 0) {
      const user = result.data[0];
      console.log("LOGIN_USER_FOUND", {
        userId: user?.users_id || user?.id || null,
        phone: user?.users_phone || null,
      });

      const isPasswordValid = await bcrypt.compare(
        users_password,
        user.users_password
      );
      console.log("LOGIN_USER_PASSWORD_CHECK", {
        isPasswordValid,
      });

      if (isPasswordValid) {
        // START ADDED: access token response for normal user login
        const authPayload = buildAuthPayload(user, "user");
        const response = {
          status: "success",
          data: authPayload.data,
          token: authPayload.token,
          accessToken: authPayload.accessToken,
          role: authPayload.role,
          expiresIn: authPayload.expiresIn,
          verificationCode: user.users_verflyCode,
        };

        console.log("LOGIN_USER_BEFORE_LAST_LOG_UPDATE", {
          phone: users_phone,
        });

        void updateData(
          "users",
          userDatalastLog,
          "users_phone = ?",
          [users_phone],
          false
        ).catch((updateError) => {
          console.error("Failed to update user last_log:", updateError);
        });

        console.log("LOGIN_USER_BEFORE_RESPONSE", {
          role: response.role,
          hasToken: !!response.token,
          headersSent: res.headersSent,
        });

        return res.json(response);
        // END ADDED: access token response for normal user login
      } else {
        console.log("LOGIN_USER_PASSWORD_INVALID", {
          phone: users_phone,
        });
        return res.json({
          status: "failure",
          message: "User does not exist or password is incorrect.",
        });
      }
    } else {
      console.log("LOGIN_USER_NOT_FOUND", {
        phone: users_phone,
      });
      return res.json({
        status: "failure",
        message: "User does not exist or phone is incorrect.",
      });
    }
  } catch (error) {
    console.error("LOGIN_USER_ERROR", error?.stack || error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem retrieving data",
    });
  }
}

async function LoginAdmin(req, res) {
  try {
    res.once("finish", () => {
      console.log("LOGIN_ADMIN_RESPONSE_FINISHED", {
        statusCode: res.statusCode,
        headersSent: res.headersSent,
      });
    });

    res.once("close", () => {
      console.log("LOGIN_ADMIN_RESPONSE_CLOSED", {
        statusCode: res.statusCode,
        headersSent: res.headersSent,
      });
    });

    console.log("LOGIN_ADMIN_START", {
      body: req.body,
      hasPhone: !!req.body?.phone,
      hasPassword: !!req.body?.password,
    });

    const { phone, password } = req.body;

    if (!phone || !password) {
      console.log("LOGIN_ADMIN_VALIDATION_FAILED", {
        hasPhone: !!phone,
        hasPassword: !!password,
      });
      return res.status(400).json({
        status: "failure",
        message: "You must enter your phone and password.",
      });
    }

    const userDatalastLog = {
      last_log: new Date(),
    };

    const result = await getAllData("admin", "phone = ?", [phone]);
    console.log("LOGIN_ADMIN_QUERY_RESULT", {
      status: result?.status,
      count: result?.data?.length ?? 0,
    });

    if (result.status === "success" && result.data.length > 0) {
      const user = result.data[0];
      console.log("LOGIN_ADMIN_FOUND", {
        userId: user?.admin_id || user?.id || null,
        phone: user?.phone || null,
      });

      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log("LOGIN_ADMIN_PASSWORD_CHECK", {
        isPasswordValid,
      });

      if (isPasswordValid) {
        // START ADDED: access token response for admin login
        const authPayload = buildAuthPayload(user, "admin");
        const response = {
          status: "success",
          data: authPayload.data,
          token: authPayload.token,
          accessToken: authPayload.accessToken,
          role: authPayload.role,
          expiresIn: authPayload.expiresIn,
        };

        console.log("LOGIN_ADMIN_BEFORE_LAST_LOG_UPDATE", {
          phone,
        });

        void updateData("admin", userDatalastLog, "phone = ?", [phone], false).catch(
          (updateError) => {
            console.error("Failed to update admin last_log:", updateError);
          }
        );

        console.log("LOGIN_ADMIN_BEFORE_RESPONSE", {
          role: response.role,
          hasToken: !!response.token,
          headersSent: res.headersSent,
        });

        return res.json(response);
        // END ADDED: access token response for admin login
      } else {
        console.log("LOGIN_ADMIN_PASSWORD_INVALID", {
          phone,
        });
        return res.json({
          status: "failure",
          message: "User does not exist or password is incorrect.",
        });
      }
    } else {
      console.log("LOGIN_ADMIN_NOT_FOUND", {
        phone,
      });
      return res.json({
        status: "failure",
        message: "User does not exist or phone is incorrect.",
      });
    }
  } catch (error) {
    console.error("LOGIN_ADMIN_ERROR", error?.stack || error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem retrieving data",
    });
  }
}

module.exports = { LoginUser, LoginAdmin };

/*
const { getAllData, updateData } = require("../../controllers/functions");
const bcrypt = require("bcrypt"); // bcrypt: مكتبة تُستخدم لتشفير كلمات المرور والتحقق منها.

// دالة لتسجيل الدخول
async function LoginUser(req, res) {
  try {
    const { users_phone, users_password } = req.body; //req.body: يحتوي على بيانات المستخدم (البريد الإلكتروني وكلمة المرور) التي تم إرسالها من العميل.

    // التحقق من وجود البيانات
    if (!users_phone || !users_password) {
      return res.status(400).json({
        status: "failure",
        message: "You must enter your phone and password.",
      });
    }
    const userDatalastLog = {
      last_log: new  Date, // تعديل اخر تسجيل دخول
    };

    // استرجاع بيانات المستخدم من قاعدة البيانات دون كلمة المرور
    const result = await getAllData("users", "users_phone = ?", [users_phone]);

    // التحقق من النتيجة
    if (result.status === "success" && result.data.length > 0) {
      const user = result.data[0]; // الحصول على المستخدم (البيانات الأولى)
      console.log(user);

      // التحقق من كلمة المرور
      const isPasswordValid = await bcrypt.compare(
        users_password,
        user.users_password
      );

      if (isPasswordValid) {
        // كلمة المرور صحيحة
        // هنا نتحقق من حالة الموافقة
        res.json({ 
          status: "success", 
          data: user,
          verificationCode: user.users_verflyCode // إضافة كود التحقق في الاستجابة
        });
        updateData(
          "users",
          userDatalastLog,
          "users_phone = ?",
          [users_phone],
          false
        );
      } else {
        // كلمة المرور غير صحيحة
        res.json({
          status: "failure",
          message: "User does not exist or password is incorrect.",
        });
      }
    } else {
      res.json({
        status: "failure",
        message: "User does not exist or phone is incorrect.",
      });
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem retrieving data",
    });
  }
}
 async function LoginAdmin(req, res) {
  try {
    const { phone, password } = req.body; //req.body: يحتوي على بيانات المستخدم (البريد الإلكتروني وكلمة المرور) التي تم إرسالها من العميل.

    // التحقق من وجود البيانات
    if (!phone || !password) {
      return res.status(400).json({
        status: "failure",
        message: "You must enter your phone and password.",
      });
    }
    const userDatalastLog = {
      last_log: new Date(), // تعديل اخر تسجيل دخول
    };

    // استرجاع بيانات المستخدم من قاعدة البيانات دون كلمة المرور
    const result = await getAllData("admin", "phone = ?", [phone]);

    // التحقق من النتيجة
    if (result.status === "success" && result.data.length > 0) {
      const user = result.data[0]; // الحصول على المستخدم (البيانات الأولى)
      console.log(user);

      // التحقق من كلمة المرور
      const isPasswordValid = await bcrypt.compare(
        password,
        user.password
      );

      if (isPasswordValid) {
        // كلمة المرور صحيحة
        // هنا نتحقق من حالة الموافقة
        res.json({ status: "success", data: user });
        updateData(
          "admin",
          userDatalastLog,
          "phone = ?",
          [phone],
          false
        );
      } else {
        // كلمة المرور غير صحيحة
        res.json({
          status: "failure",
          message: "User does not exist or password is incorrect.",
        });
      }
    } else {
      res.json({
        status: "failure",
        message: "User does not exist or phone is incorrect.",
      });
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
    res.status(500).json({
      status: "failure",
      message: "There is a problem retrieving data",
    });
  }
}


// تصدير الدالة
module.exports = { LoginUser, LoginAdmin };
*/
