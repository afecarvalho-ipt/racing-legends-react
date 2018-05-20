import "bootstrap/dist/css/bootstrap.css";

import React from "react";
import ReactDOM from "react-dom";

import {
  getCategories,
  getCategoryImage,
  getDriversByCategory,
  getDriverImage,
  getDriverDetailsById
} from "./api";

class CategoryList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      categories: []
    };
  }

  async componentDidMount() {
    try {
      const categories = await getCategories();

      this.setState({
        categories: categories
      });
    } catch (e) {
      console.error(e);
    }
  }

  handleCategoryClicked(evt, category) {
    evt.preventDefault();

    this.props.onCategoryClicked(category);
  }

  render() {
    const categories = this.state.categories;

    return (
      <div className="container">
        <div className="row">
          {categories.map(category => (
            <div className="col-sm-4" key={category.id}>
              <a
                href="#"
                onClick={e =>
                  this.handleCategoryClicked(e, category)
                }
                className="thumbnail"
              >
                <img
                  src={getCategoryImage(category.id)}
                  alt={category.name}
                  style={{
                    height: 200,
                    objectFit: "cover"
                  }}
                />
                <h4>{category.name}</h4>
              </a>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

class DriverList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      drivers: []
    };
  }

  async componentDidMount() {
    try {
      const drivers = await getDriversByCategory(
        this.props.categoryId
      );

      this.setState({ drivers: drivers });
    } catch (e) {
      console.error(e);
    }
  }

  handleDriverClicked(evt, driver) {
    evt.preventDefault();

    this.props.onDriverClicked(driver);
  }

  render() {
    const drivers = this.state.drivers;

    return (
      <div className="container">
        <button
          type="button"
          onClick={this.props.onBackClicked}
          className="btn btn-default"
        >
          Back
        </button>
        <div className="row">
          {drivers.map(driver => (
            <a
              href="#"
              onClick={evt =>
                this.handleDriverClicked(evt, driver)
              }
              className="col-sm-3"
              key={driver.id}
            >
              <div className="thumbnail">
                <img
                  src={getDriverImage(driver.id)}
                  alt={driver.name}
                  style={{
                    height: 300,
                    objectFit: "cover"
                  }}
                />
                <h4>{driver.name}</h4>
              </div>
            </a>
          ))}
        </div>
      </div>
    );
  }
}

class DriverDetails extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      driverDetails: null
    };
  }

  async componentDidMount() {
    try {
      const details = await getDriverDetailsById(
        this.props.driverId
      );

      this.setState({ driverDetails: details });
    } catch (e) {
      console.error(e);
    }
  }

  render() {
    const details = this.state.driverDetails;

    console.log(details);

    if (details == null) {
      return null;
    }

    return (
      <div className="container-fluid">
        <button
          type="button"
          onClick={this.props.onBackClicked}
          className="btn btn-default"
        >
          Back
        </button>
        <div className="row">
          <div className="col-xs-3">
            <img
              className="img-responsive"
              src={getDriverImage(details.id)}
            />
          </div>
          <div className="col-xs-9">
            <h3>{details.name}</h3>
          </div>
        </div>
        <div className="row">
          <h4>Introduction</h4>
          <p>{details.introduction}</p>
          <h4>Career</h4>
          {details.career.map(stage => (
            <div key={stage.title}>
              <h5>{stage.title}</h5>
              <p style={{ whiteSpace: "pre-wrap" }}>
                {stage.text}
              </p>
            </div>
          ))}
        </div>
        Should show details for {this.props.driverId}
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      screen: "categoryList",
      currentCategory: null,
      currentDriver: null
    };
  }

  handleCategoryClicked(category) {
    console.log(category);

    this.setState({
      screen: "driverList",
      currentCategory: category
    });
  }

  goToDriverDetails(driver) {
    this.setState({
      currentDriver: driver,
      screen: "driverDetails"
    });
  }

  goBackToCategoryList() {
    this.setState({ screen: "categoryList" });
  }

  goBackToDriverList() {
    this.setState({ screen: "driverList" });
  }

  render() {
    switch (this.state.screen) {
      case "categoryList":
        return (
          <CategoryList
            onCategoryClicked={category =>
              this.handleCategoryClicked(category)
            }
          />
        );
      case "driverList":
        return (
          <DriverList
            categoryId={this.state.currentCategory.id}
            onDriverClicked={driver =>
              this.goToDriverDetails(driver)
            }
            onBackClicked={() =>
              this.goBackToCategoryList()
            }
          />
        );
      case "driverDetails":
        return (
          <DriverDetails
            onBackClicked={() => this.goBackToDriverList()}
            driverId={this.state.currentDriver.id}
          />
        );
      default:
        return <div>Shouldn't get here...</div>;
    }
  }
}

ReactDOM.render(
  React.createElement(App),
  document.getElementById("root")
);
