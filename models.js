const mongoose = require('mongoose');

// Schema below to represent a document (object) that will be held in our DB
const blogPostSchema = mongoose.Schema({
  title: {type: String, required: true},
  content: {type: String, required: true},
  author: {
    firstName: String,
    lastName: String
  }
});

/*
virtuals - (http://mongoosejs.com/docs/guide.html#virtuals)

++++  Allow's us to build our own get funcitons to return objects from the DB that are formatted the way we like
*******   However this will not translate back into the DB it is purely Client Side Delivery only
*/

// authorString
blogPostSchema.virtual('authorString').get(function() {
  return `${this.author.firstName} ${this.author.lastName}`.trim()
});


// this is an *instance method* which will be available on all instances
// of the model. This method will be used to return an object that only
// exposes *some* of the fields we want from the underlying data
blogPostSchema.methods.serialize = function() {

  return {
    id: this._id,
    title: this.title,
    content: this.content,
    author: this.authorString
  }
};

// note that all instance methods and virtual properties on our
// schema must be defined *before* we make the call to `.model`.

// mongoose.model(<model name>, <Schema from above to use>, <db collection name>);
const BlogPosts = mongoose.model('blogPosts', blogPostSchema, 'blogPosts');


module.exports = {BlogPosts}
