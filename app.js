const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require('method-override');
//49.Project part b
//b)i)Creating boilerplate
const ejsMate = require("ejs-mate");


async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
  .then((res) => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,"/public")))
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
app.get("/", (req, res) => {
  res.send("workign");
});
//ii)Listing Model
// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description: "By the beach",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"India",
//     });
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successful testing");
// });
//iV) Index Route
app.get("/listings", async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});
//Vi) Create New Route - New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});
//V) Show Route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});
//Vi) Create New Rout
app.post("/listings",async (req, res) => {
  // let{title,description,image,price,location,country} = req.body
  //the above code is the normal way to get all this details below is another way
  let listing = new Listing(req.body.listing);
  await listing.save();
  res.redirect("/listings");
});
//Vii) Update(Edit&Update Route)-Edit Route
app.get("/listings/:id/edit",async(req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});
//Vii) Update(Edit&Update Route)-Update Route
app.put("/listings/:id",async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})
app.get("/privacy",async(req,res)=>{
  res.render("listings/privacy.ejs");
});

app.get("/terms",async(req,res)=>{
  res.render("listings/terms.ejs");
});

//viii)Delete Route
app.delete("/listings/:id",async(req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings")
})
