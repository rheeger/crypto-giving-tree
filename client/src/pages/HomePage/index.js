import React from "react";
import Header from "../../components/Header";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import { updateAppTab } from "../../store/actions/appTab";

import "./main.css";

class HomePage extends React.Component {
  componentDidMount() {
    this.props.updateAppTab("");
  }
  renderButton() {
    if (!this.props.gtFunds) {
      return;
    }
    if (Object.keys(this.props.gtFunds).length === 0) {
      return (
        <Link to="/funds/new" className="ui button basic green">
          <i className="plus circle icon" />
          Create a Fund
        </Link>
      );
    }
    if (Object.keys(this.props.gtFunds).length > 0) {
      return (
        <Link to="/funds" className="ui button basic green">
          See My Funds
        </Link>
      );
    }
  }

  render() {
    return (
      <div>
        <Header />
        <div>
          <Grid className="Container">
            <Grid.Row>
              <Grid.Column
                style={{
                  margin: "5rem auto",
                  textAlign: "center",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center"
                }}
                width={16}
              >
                <div>
                  <h1>A new way to give crypto.</h1>
                  <h3>
                    Start your own charitable fund. &nbsp; Extend grants to any
                    non-profit organization.
                  </h3>
                  <br />
                  <br />
                  {this.renderButton()}
                </div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { gtFunds: state.gtFunds, web3: state.web3connect };
};

export default connect(mapStateToProps, { updateAppTab })(HomePage);
