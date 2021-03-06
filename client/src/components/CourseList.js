import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Course from '../components/Course';
import './CourseList.css';
import {GET_ALL_COURSES, GET_COURSE_BY_TITLE, SEARCH_STUPID_COURSES} from "../queries/queries"
import { Query } from 'react-apollo';
import {FaSearch } from 'react-icons/fa';


class ShowList extends Component {
   constructor(props) {
      super(props);
      this.state = {
         reload: false,
         searchTerm: undefined
      };
   }
   
   componentDidMount() {
      
   }

   handleChange = (e) => {
      e.preventDefault();
      let value = e.target.value;
      console.log(`ShowList: ${value}`);
      this.setState({ searchTerm: value });
      this.setState({reload: true});
   }

   onSubmit(e) {
      e.preventDefault();
   }
   async searchShows() {
      const { searchTerm, data } = this.state
      if (searchTerm) {
         try {
            // filter our data
            console.log("our data:", data)
            const filteredCourse = data.filter(c => {
               if (c.coursename) {
                  return c.coursename.indexOf(searchTerm) !== -1
               }
            })
            this.setState({ searchData: filteredCourse });
         } catch (e) {
            console.log(e);
         }
      }
   }
   render() {
      
      let body = null;
      let li = null;
      const { searchTerm } = this.state;
      console.log(`search course by title: ${searchTerm}`);

      if (this.state.reload && searchTerm) {
         li = <Query query={SEARCH_STUPID_COURSES} variables={{ title: searchTerm }}>
         {({ data }) => {
            console.log(`search course by title: ${JSON.stringify(data)}`);
            const {searchCourses} = data;
            if(!searchCourses) {
               return (
                  <div>
                     <li>
                     <p>Course not Found</p>
                     </li>
                  </div>
               );
            }
            return (
               <div>
                  {searchCourses.map((course) => {
                           console.log(course._id);
									return (
                                 <li key={course._id}>
                                    <Link className="showlink" to={`/coursedetails/${course._id}`}>{course.title}</Link>
                                 </li>
									);
								})}
               </div>
            );
         }}
      </Query>
      } 
      else {
         li = 
      <Query query={GET_ALL_COURSES}>
					{({ data }) => {
						console.log(`showlist data: ${JSON.stringify(data)}`);
                  const {allcourses} = data;
                  console.log("courses",allcourses);
						if(!allcourses) {
							return null;
                  }
						return (
							<div>
								{allcourses.map((course) => {
                           console.log(course._id);
									return (
                                 <li key={course._id}>
                                   <strong> <Link className="showlink" to={`/coursedetails/${course._id}`}>{course.title}</Link></strong>
                                 </li>
									);
								})}
							</div>
						);
					}}
				</Query>
      }
      body = (
         <div className="container">
            <form className="my-form" method="POST " name="formName" onSubmit={this.onSubmit}>
               
              <strong> <label name="searchlabel">
                  {' '}
                  <FaSearch/>  SEARCH COURSES
                  <br/>
                 <input className = "searchbox"
                     type="text"
                     name="searchTerm"
                     value={this.state.value} 
                     onChange={this.handleChange}
                  />
               </label>
               </strong>
            </form>
            <ul className="list-unstyled">{li}</ul>
         </div>

      );

      return body;
   }

}

export default ShowList;
