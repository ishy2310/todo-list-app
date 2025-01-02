// import express from "express";
// import bodyParser from "body-parser";
// import pg from "pg";


// const app = express();
// const port = 3000;

// const db = new pg.Client({
//   user:"postgres",
//   host:"localhost",
//   database:"permalist",
//   password:"data1",
//   port:5432
// })
// db.connect()

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(express.static("public"));

// let items = [
//   { id: 1, title: "Buy milk" },
//   { id: 2, title: "Finish homework" },
// ];

// app.get("/", async (req, res) => {
//   try{
//     const result = await db.query('SELECT * FROM items ORDER BY id ASC');
//     items= result.rows;
//     res.render("index.ejs", {
//       listTitle: "TO DO",
//       listItems: items,
//     });

//   }catch(err){
//     console.log(err)
//   }
 
// });

// app.post("/add", async (req, res) => {
  
//   try{
//     const item = req.body.newItem;

//     await db.query("INSERT INTO items(title)VALUES($1)", [item]);


//     items.push({ title: item });
//     res.redirect("/");
//   }catch(err){
//     console.log(err)
//   }
// });

// app.post("/edit",async (req, res) => {
  

//   try{
//     const item = req.body.updatedItemTitle;
//   const id = req.body.updatedItemId;
   
//     await db.query("UPDATE items SET title = ($1) WHERE id = $2", [item, id]);
//     res.redirect("/");
//   }catch(err){
//     console.log(err)
//   }


// });

// app.post("/delete", async(req, res) => {
//   try{
//     const id = req.body.deleteItemId;
//     await db.query("DELETE FROM items WHERE id =$1",[id]);
//     res.redirect("/");
//   }catch(err){
//     console.log(err);
//   }


// });

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`);
// });
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); 

const app = express();

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});


db.connect()
  .then(() => console.log("Connected to the database!"))
  .catch((err) => console.error("Database connection error:", err));

  app.use(cors({ origin: "*" })); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public")); 


app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM items ORDER BY id ASC");
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching items.");
  }
});

app.post("/add", async (req, res) => {
  try {
    const item = req.body.newItem;
    await db.query("INSERT INTO items(title) VALUES($1)", [item]);
    res.status(201).send("Item added successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding item.");
  }
});

app.post("/edit", async (req, res) => {
  try {
    const { updatedItemTitle, updatedItemId } = req.body;
    await db.query("UPDATE items SET title = $1 WHERE id = $2", [updatedItemTitle, updatedItemId]);
    res.status(200).send("Item updated successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating item.");
  }
});

app.post("/delete", async (req, res) => {
  try {
    const id = req.body.deleteItemId;
    await db.query("DELETE FROM items WHERE id = $1", [id]);
    res.status(200).send("Item deleted successfully!");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting item.");
  }
});


const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
