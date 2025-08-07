require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const { getConnection } = require("./controllers/db");
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3118;
const path = require("path");


// Serve static files from the 'query' directory
// Debug route to check if files exist
app.get('/debug/check-file/:path(*)', (req, res) => {
  const filePath = path.join(__dirname, 'query', req.params.path);
  res.json({ 
    __dirname: __dirname,
    requestedPath: req.params.path,
    fullPath: filePath,
    exists: fs.existsSync(filePath),
    queryDirExists: fs.existsSync(path.join(__dirname, 'query')),
    queryAuthDirExists: fs.existsSync(path.join(__dirname, 'query/auth')),
    queryAuthUserImagesDirExists: fs.existsSync(path.join(__dirname, 'query/auth/userImages')),
    queryAuthUserImagesImagesDirExists: fs.existsSync(path.join(__dirname, 'query/auth/userImages/images')),
    logoExists: fs.existsSync(path.join(__dirname, 'query/auth/userImages/images/logo.png'))
  });
});
////////////////////////////// auth
const loginUserRoute = require("./routes/authRoutes/LoginUserRout");
const registerUserRoute = require("./routes/authRoutes/RegisterUserRout");
const verifyUserRoute = require("./routes/authRoutes/VfcRout");
const fgpasswordRout = require("./routes/authRoutes/FgpasswordRout");
const getUserDataRout = require("./routes/authRoutes/userRout"); 
const UpdateUserProfileRout = require("./routes/authRoutes/UpdateUserProfileRout");

////////////////////////////// PersonalDataRegister
const insertPersonalDataRegisterRout = require("./routes/personaldata/personalDataRegisterRout");
const updatePDR = require("./routes/personaldata/personalDataRegisterRout");
const getPDR = require("./routes/personaldata/personalDataRegisterRout");
 
//goal
const DataGoalsRout = require("./routes/managePersonalData/goal/DataGoalsRout");
//gender
const DataGenderRout = require("./routes/managePersonalData/gender/DataGenderRout");
//typicalday
const DataTypicaldayRout = require("./routes/managePersonalData/typicalday/DataTypicaldayRout");
//specialprograms
const DataSpecialProgramsRout = require("./routes/managePersonalData/specialprograms/DataSpecialProgramsRout");
//specialevent
const DataSpecialEventRout = require("./routes/managePersonalData/specialevent/DataSpecialEventRout");
//restnight
const DataRestNightRout = require("./routes/managePersonalData/restnight/DataRestNightRout");
//physicallyactive
const DataPhysicallyActiveRout = require("./routes/managePersonalData/physicallyactive/DataPhysicallyActiveRout");
//offers
const DataOffersRout = require("./routes/managePersonalData/offers/DataOffersRout");
//lastidealweight
const DataLastIdealWeightRout = require("./routes/managePersonalData/lastidealweight/DataLastIdealWeightRout");
//energylevels
const DataEnergyLevelsRout = require("./routes/managePersonalData/energylevels/DataEnergyLevelsRout");
//diettype
const DataDietTypeRout = require("./routes/managePersonalData/diettype/DataDietTypeRout");
//dailywater
const DataDailyWaterRout = require("./routes/managePersonalData/dailywater/DataDailyWaterRout");
//bodytype
const DataBodyTypeRout = require("./routes/managePersonalData/bodytype/DataBodyTypeRout");
//badhabits
const DataBadHabitsRout = require("./routes/managePersonalData/badhabits/DataBadHabitsRout");
//areasattention
const DataAreasAttentionRout = require("./routes/managePersonalData/areasattention/DataAreasAttentionRout");
//activities
const DataActivitiesRout = require("./routes/managePersonalData/activities/DataActivitiesRout");
//profileRout
const GetProfileRout = require("./routes/profile/getProfileRout");

////////////////////////////// getDataSteps
const GetDataStepsRout = require("./routes/Analytics/getDataAnalyticsRout");

////////////////////////////// Food
const DataFoodRout = require("./routes/food/DataFoodRout");

////////////////////////////// challenges
const DatachallengesRout = require("./routes/challenges/challengesRout");

////////////////////////////// chapter

const chapterRout = require("./routes/chapter/chapterRout");

////////////////////////////// mealFood
const mealFoodRout = require("./routes/mealFood/mealFoodRout");

////////////////////////////// feedbacks
const feedbacksRout = require("./routes/feedbacks/feedbacksRout");

////////////////////////////// trainings
const trainingsRout = require("./routes/trainings/trainingsRout");
 
////////////////////////////// exercise
const exerciseRout = require("./routes/exercise/exerciseRout");

////////////////////////////// equipments
const equipmentRout = require("./routes/equipment/equipmentRout");
////////////////////////////// coupon
const couponRout = require("./routes/coupon/DataCouponRout");
 
 
app.use(express.json());

app.get("/", (req, res) => {
  // قراءة ملف HTML منفصل
  const welcomePath = path.join(__dirname, 'views', 'welcome.html');
  
  if (fs.existsSync(welcomePath)) {
    const htmlContent = fs.readFileSync(welcomePath, 'utf8');
    res.send(htmlContent);
  } else {
    res.status(404).json({ error: "Welcome page not found" });
  }
});

// مسار إدارة قاعدة البيانات
app.get("/db-admin", (req, res) => {
  const dbAdminPath = path.join(__dirname, 'simple_db_admin.html');
  
  if (fs.existsSync(dbAdminPath)) {
    const htmlContent = fs.readFileSync(dbAdminPath, 'utf8');
    res.send(htmlContent);
  } else {
    res.status(404).json({ error: "Database admin page not found" });
  }
});

// مسار لعرض حالة النظام
app.get("/status", async (req, res) => {
  try {
    const connection = await getConnection();

    // الحصول على معلومات قاعدة البيانات
    const [tables] = await connection.execute("SHOW TABLES");
    const [serverInfo] = await connection.execute("SELECT VERSION() as version, NOW() as current_datetime");

    await connection.end();

    res.json({
      status: "success",
      message: "النظام يعمل بشكل طبيعي",
      database: {
        connected: true,
        version: serverInfo[0].version,
        tables_count: tables.length,
        current_time: serverInfo[0].current_datetime
      },
      server: {
        port: PORT,
        environment: process.env.NODE_ENV || "development",
        uptime: process.uptime()
      }
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "خطأ في الاتصال بقاعدة البيانات",
      error: error.message
    });
  }
});

// مسار لعرض معلومات API
app.get("/api-info", (req, res) => {
  res.json({
    name: "Ideal Body Fitness API",
    version: "1.0.0",
    description: "API لتطبيق اللياقة البدنية والصحة",
    endpoints: {
      auth: "/api84818auth",
      personal_data: "/api84818datar",
      food: "/api84818datafood",
      trainings: "/api84818datatrainings",
      exercise: "/api84818dataexercise",
      challenges: "/api84818datachallenges",
      chapter: "/api84818datachapter",
      meal_food: "/api84818datamealfood",
      feedback: "/api84818datafeedback",
      equipment: "/api84818dataequipment",
      coupon: "/api84818dataecoupon",
      analytics: "/api84818dataAnaly",
      profile: "/api84818dataUser"
    }
  });
});

//auth
app.use("/api84818auth", registerUserRoute);
app.use("/api84818auth", loginUserRoute);
app.use("/api84818auth", verifyUserRoute);
app.use("/api84818auth", fgpasswordRout); 
app.use("/api84818auth", UpdateUserProfileRout);
app.use("/api84818auth", getUserDataRout);
//PersonalDataRegister
app.use("/api84818datar", insertPersonalDataRegisterRout);
app.use("/api84818datar", updatePDR);
app.use("/api84818datar", getPDR);
 
//goal
app.use("/api84818datar", DataGoalsRout);

//gender
app.use("/api84818datar", DataGenderRout);

//typicalday
app.use("/api84818datar", DataTypicaldayRout);

//specialprograms
app.use("/api84818datar", DataSpecialProgramsRout);

//specialevent
app.use("/api84818datar", DataSpecialEventRout);

//restnight
app.use("/api84818datar", DataRestNightRout);

//physicallyactive
app.use("/api84818datar", DataPhysicallyActiveRout);

//offers
app.use("/api84818datar", DataOffersRout);

//lastidealweight
app.use("/api84818datar", DataLastIdealWeightRout);

//energylevels
app.use("/api84818datar", DataEnergyLevelsRout);

//diettype
app.use("/api84818datar", DataDietTypeRout);

//dailywater
app.use("/api84818datar", DataDailyWaterRout);

//bodytype
app.use("/api84818datar", DataBodyTypeRout);

//badhabits
app.use("/api84818datar", DataBadHabitsRout);

//areasattention
app.use("/api84818datar", DataAreasAttentionRout);

//activities
app.use("/api84818datar", DataActivitiesRout);

//profile
app.use("/api84818dataUser", GetProfileRout);

//Analytics
app.use("/api84818dataAnaly", GetDataStepsRout);

// Food
app.use("/api84818datafood", DataFoodRout);

// challenges
app.use("/api84818datachallenges", DatachallengesRout);

// chapter
app.use("/api84818datachapter", chapterRout);

////////////////////////////// mealFood
app.use("/api84818datamealfood", mealFoodRout);

//////////////////////////// feedbacks
app.use("/api84818datafeedback", feedbacksRout);

//////////////////////////// trainings
app.use("/api84818datatrainings", trainingsRout);
 
//////////////////////////// exercise
app.use("/api84818dataexercise", exerciseRout);

//////////////////////////// equipmentRout
app.use("/api84818dataequipment", equipmentRout);
////////////////////////////// coupon
 app.use("/api84818dataecoupon", couponRout);
 
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on Port:${PORT}`);
});







