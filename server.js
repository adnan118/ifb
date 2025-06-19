require("dotenv").config();  
const express = require("express");
const mysql = require("mysql2/promise");
const { getConnection } = require("./controllers/db");
const app = express();
const PORT = process.env.PORT || 443;
const path = require("path");

// Serve static files from the 'query' directory
app.use('/query', express.static(path.join(__dirname, 'query')));

////////////////////////////// auth
const loginUserRoute = require("./routes/authRoutes/LoginUserRout");
const registerUserRoute = require("./routes/authRoutes/RegisterUserRout");
const verifyUserRoute = require("./routes/authRoutes/VfcRout");
const fgpasswordRout = require("./routes/authRoutes/FgpasswordRout");
const getUserDataRout = require("./routes/authRoutes/LoginUserRout");

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

app.get("/", async (req, res) => {
  try {
    const connection = await getConnection();
    // يمكن استخدام الاتصال لأي استعلام هنا
    await connection.end(); // اغلاق الاتصال بعد الاستخدام
    res.json({ message: "Connected to the database successfully!" });
  } catch (error) {
    console.error("خطأ في الاتصال:", error);
    res.status(500).json({ message: "Database connection failed." });
  }
});

//auth
app.use("/api84818auth", registerUserRoute);
app.use("/api84818auth", loginUserRoute);
app.use("/api84818auth", verifyUserRoute);
app.use("/api84818auth", fgpasswordRout);
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

