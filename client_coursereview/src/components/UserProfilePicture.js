import React, { Component } from "react";
import { FaCamera } from "react-icons/fa";
import "./UserProfilePicture.css";

class UserProfilePicture extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: "",
      imagePreviewUrl: ""
    };
    this.handleImageChange = this.handleImageChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log("handle uploading-", this.state.file);
  }

   handleImageChange(event) {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
     reader.onloadend = async() => {
        await this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
    };
    reader.readAsDataURL(file);
  }

  render() {
    return (
      <div className="col-mt-4">
        <div className="text-center avatar rounded-circle m-auto">
          <img
            className="profilepic"
            src="https://placeimg.com/444/445"
            alt="Card cap"
          />
        </div>
        <div className="p-image">
          {/* <FaCamera upload-button /> */}
          <form onSubmit={this.handleSubmit}>
            <input
              className="file-upload"
              type="file"
              accept="image/*"
              onChange={this.handleImageChange}
            />
          </form>
        </div>
        <div className="pl-2 pt-2">
          <br />
          <h4 className="card-title text-left">First Name Last Name</h4>
          <hr />
          <dl className="text-secondary">
            <dt> Username: </dt>
            <dd>User's user name</dd>
            <dt>Email: </dt>
            <dd>User's email</dd>
          </dl>
        </div>
      </div>
    );
  }
}

export default UserProfilePicture;
