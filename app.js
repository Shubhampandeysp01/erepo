const express = require("express")
const app = express()
const dotenv = require("dotenv")
const path = require("path")
const res = require("express/lib/response")
dotenv.config()
const PORT = 3006
const dbcreate  = require("./mydata")

app.use(express.json())
app.get("/allinfo", dbcreate.getinfo);
app.get("/:id", dbcreate.getinfoById);
app.get("/flats/price-range", dbcreate.getFlatInfoByPriceRange);
app.put("/:id", dbcreate.updateinfo);
app.post('/add', dbcreate.createinfo);
app.delete("/:id", dbcreate.deleteinfo);
app.listen(PORT, () => console.log(`Server is running on ${PORT}`))
