//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

mongoose.connect('mongodb://127.0.0.1:27017/wikiDB', {useNewUrlParser: true});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));


const articleSchema = {
    title: String,
    content: String
}

const Article = mongoose.model('Article', articleSchema)


app.route("/articles")
  .get((req, res) => {
    Article.find({}).then((foundArticles) => {
      res.send(foundArticles);
    });
  })

  .post((req,res) => {
      const newArticle = new Article({title: req.body.title , content: req.body.content});
      try {
        newArticle.save();
        res.send("Article added successfully.");
      } catch (error) {
        res.send(error);
      }
  })

  .delete((req, res) => {
  try {
    Article.deleteMany().then(() => {res.send("Article deleted successfully.");});
  } catch (error) {
    console.log(error);
  }});


app.route("/articles/:articleTitle")
.get((req, res) => {
  try {
    Article.findOne({title:req.params.articleTitle}).then((article) => 
    {if (article) {
      res.send(article);
    }
    else {
      res.send("No article found");
    }});
  } catch (err) {
    res.send(err);
  }
})

.put((req, res) => {
  try {
    Article.findOneAndUpdate({title: req.params.articleTitle},{title: req.body.title, content: req.body.content},{new: true}).then(() => {res.send("Article updated");});
  } catch (error) {
    console.log(error);
  }
})

.patch((req, res) => {
  try {
    Article.findOneAndUpdate({title: req.params.articleTitle},{$set: req.body},{new: true}).then(() => {res.send("Article updated");});
  } catch (err) {
    console.log(err);
  }
})

.delete((req, res) => {
  try {
    Article.deleteOne({title: req.params.articleTitle}).then(() => {res.send("Article deleted successfully.");});
  } catch (err) {
    console.log(err);
  }
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

