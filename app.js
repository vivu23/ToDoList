//jshint esversion:6
const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/myListDB", {useNewUrlParser: true, useUnifiedTopology: true });

const itemsSchema = new mongoose.Schema({
  name: String
});

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your ToDo List!!"
});

const item2 = new Item({
  name: "Hit the + button to add new tasks"
});

const item3 = new Item({
  name: "<~~~ Hit this to delete finished task"
});

const item4 = new Item({
  name: "Hit this to edit your task ~~~>"
});
const defaultItems = [item1, item2, item3, item4];


app.get("/", function(req,res){

  let day = date.getDate();

  Item.find({}, function(err, foundItems){
    if(foundItems.length === 0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        } else {
          console.log("Inserted Successfully!");
        }
      });
      res.redirect("/");
    } else {
      res.render('list', {currentDay: day, listOfItems: foundItems});
    }
  });
});


app.post("/", function(req,res){
  const newItems = req.body.newItem;
  const item = new Item({
    name: newItems
  });
  item.save();
  res.redirect("/");
});

app.get("/edit/:id", function(req,res){
  const id = req.params.id;
  res.render('edit',{currentItem: id});
});

app.post("/edit/:id",function(req,res){
const newItemValue = req.body.newTodo;
const id = req.params.id;
Item.updateOne({name: id}, {name: newItemValue}, function(err){
  if(err){
    console.log(err);
  } else {
    console.log("Updated Successfully");
  }
});
res.redirect("/");
});

app.post("/delete", function(req,res){
  const checkedItemId = req.body.checkbox;
  Item.findOneAndDelete({_id: checkedItemId},function(err){
    if (err) {
      console.log(err);
    } else {
      console.log("Delete Successfully!");
      res.redirect("/");
    }
   });
});

app.listen(1307, function(){
  console.log("Running");
});
