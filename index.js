import { app } from "./config/app.js";
console.log(process.memoryUsage()); 
app.listen(process.env.PORT || 2008,console.log("server is running on port 2008"))