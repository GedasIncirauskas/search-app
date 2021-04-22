import axios from "../../utils/request";
import React, { Component } from "react";
import Spinner from "../../components/Spinner/Spinner";
import { connect } from "react-redux";
import "./SearchBar.scss";

const accessKey = "0P032Y31sGd2Ct2i04kchNLCp9-O9hTrf91bedq8dNc";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
  }

  state = {
    searchText: "",
    imagesBox: [],
    error: null,
    loading: false,
  };

  imageSearchHandler() {
    this.setState({ loading: true });
    axios
      .get(`/photos?query=${this.state.searchText}&client_id=${accessKey}`)
      .then((response) => {
        this.setState({
          imagesBox: response.data.results,
          loading: false,
        });
      });
    setTimeout(() => {
      if (this.state.imagesBox.length <= 0) {
        this.setState({
          error: "We cannot find your image!",
        });
      }
    }, 2000);
  }

  changeHandler(event) {
    this.setState({
      searchText: event.target.value,
      error: null,
      loading: false,
    });
  }

  saveSearch(e) {
    e.preventDefault();
    this.props.saveSearch(this.state.searchText);
  }

  searchAgain(item) {
    this.setState({ searchText: item });
    axios
      .get(`/photos?query=${item}&client_id=${accessKey}`)
      .then((response) => {
        this.setState({
          imagesBox: response.data.results,
        });
      });
  }

  render() {
    return (
      <div>
        <div className="Input-style">
          <h2>Find your awesome images</h2>
          <input
            type="search"
            placeholder="Search for images..."
            value={this.state.searchText}
            onChange={this.changeHandler}
          />
          <button onClick={() => this.imageSearchHandler()}>Search</button>
          {this.state.searchText.length > 0 &&
          this.state.imagesBox.length > 0 ? (
            <button onClick={(e) => this.saveSearch(e)}>Save</button>
          ) : null}
          {this.state.error ? <h3>{this.state.error}</h3> : null}
        </div>
        {this.props.savedSearch.map((item, index) => (
          <span key={index} onClick={() => this.searchAgain(item, index)}>
            {item}
            <span
              className="close-button"
              onClick={() => this.props.deleteSearch(index)}
            >
              X
            </span>
          </span>
        ))}
        {this.state.loading ? (
          <Spinner />
        ) : (
          <div className="Image-gallary">
            {this.state.imagesBox.map((image) => (
              <img
                key={image.id}
                src={image.urls.small}
                alt={image.description}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    savedSearch: state.savedSearch,
  };
};

const mapDispatchToProps = (dispath) => {
  return {
    saveSearch: (input) => dispath({ type: "SAVE_SEARCH", input }),
    deleteSearch: (index) => dispath({ type: "DELETE_SEARCH", index }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchBar);
