const bluebird = require("bluebird");
const Promise = bluebird.Promise;
const uuidv4 = require("uuid/v4");
const collection = require("../config/mongoCollections");
const course = collection.course;
const user = require("./user"); 

function check(num){
  return !isNaN(parseFloat(num))&&isFinite(num);
}

const exportedMethods = {
  async getAllCourse(){
      const course_collection = await course();
      const result = await course_collection.find({}).toArray();;
      if(result === null) throw "No such course in MongoDB";
      return result;
  },
  async getCourseById(id){
      if (id == null || id == undefined || id == "") throw "You must provide an id to search for";
      if (typeof(id) !== 'string') throw "Invalid id";

      const course_collection = await course();
      const result = await course_collection.findOne({_id:id});
      if(result === null) throw "No such course in MongoDB";
      return result;
  },// get /users/:id
  async getCourseByTitle(title){
    if (title == null || title == undefined || title == "") throw "You must provide an title to search for";
    if (typeof(title) !== 'string') throw "Invalid type";

    const course_collection = await course();
    const result = await course_collection.findOne({title:title});
    if(result === null) throw "No such course in MongoDB";
    return result;
    },
  async addCourse(title, campus) {

      const newCourse = {
          _id: uuidv4(),
          title: title,
          campus: campus,//true campus, false off campus
          reviews: [],
          ratings: 0.0,
          rating_number: 0
      };
      
      const course_collection = await course();

      const newInsertInformation = await course_collection.insertOne(newCourse);
      if (newInsertInformation.insertedCount === 0)throw "Could not add task";
      const newId = newInsertInformation.insertedId;

      return await this.getCourseById(newId);;
  },//post /users
  async addReviewCourse(course_id, review_id){
      const course_collection = await course();
      let update_course = await this.getCourseById(course_id);
      update_course.reviews.push(review_id);
      const updatedInfo = await course_collection.updateOne({_id: update_course._id}, { $set: { "title" : update_course.title,
          "campus" : update_course.campus,
          "reviews" : update_course.reviews,
          "ratings" : update_course.ratings,
          "rating_number": update_course.rating_number} },{ upsert: true });
      if (updatedInfo.modifiedCount === 0) {
          throw "could not add new review to user successfully";
      }

      return await this.getCourseById(update_course._id);
  },
  async addRatingCourse(course_id, rating, difficulty){
      const course_collection = await course();
      let update_course = await this.getCourseById(course_id);
      update_course.ratings = (update_course.ratings * update_course.rating_number + rating) / (update_course.rating_number + 1);
      update_course.difficulty = (update_course.difficulty * update_course.rating_number + difficulty) / (update_course.rating_number + 1);
      update_course.rating_number++;

      const updatedInfo = await course_collection.updateOne({_id: update_course._id}, { $set: { "title" : update_course.title,
          "campus" : update_course.campus,
          "reviews" : update_course.reviews,
          "ratings" : update_course.ratings,
          "difficulty": update_course.difficulty,
          "rating_number": update_course.rating_number} },{ upsert: true });
      if (updatedInfo.modifiedCount === 0) {
          throw "could not add new review to user successfully";
      }

      return await this.getCourseById(update_course._id);
  }
}

module.exports = exportedMethods;