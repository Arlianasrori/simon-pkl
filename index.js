import { app } from "./config/app.js";
app.listen(process.env.PORT || 2008,console.log("server is running on port 2008"))