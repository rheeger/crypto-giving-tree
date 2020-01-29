import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import { Card } from "semantic-ui-react";
import { updateAppTab } from "../../store/actions/appTab";

class Manager extends React.Component {
  componentDidMount() {
    this.props.updateAppTab("funds");
  }

  truncateContract(address) {
    if (address) {
      return address.substring(0, 4) + "..." + address.substring(39, 42);
    }
    return;
  }
  renderList() {
    return Object.values(this.props.gtFunds)
      .sort((a, b) => a.fundDAI - b.fundDAI)
      .reverse()
      .map(function(fund, index) {
        if (!fund.id) {
          return null;
        }
        return (
          <Link to={`/funds/${fund.id}`} style={{ margin: "1rem" }} key={index}>
            <div className="ui centered link card">
              <div className="content">
                <div className="center aligned header">{fund.branchName}</div>
                <div className="center aligned description">
                  <div>
                    <i className="file alternate outline icon"></i>
                    {fund.id.substring(0, 6) +
                      "..." +
                      fund.id.substring(37, 42)}{" "}
                  </div>
                </div>
              </div>
              <div className="extra content">
                <div className="center aligned header">${fund.fundDAI}</div>
              </div>
            </div>
          </Link>
        );
      });
  }

  render() {
    if (!this.props.gtFunds) {
      return <div>Loading...</div>;
    }

    if (Object.values(this.props.gtFunds).length < 1) {
      return (
        <div
          style={{
            textAlign: "center",
            display: "flex-flow",
            alignContent: "center"
          }}
        >
          <Header />
          <div style={{ marginTop: "5rem" }}>
            <h1>Oops!</h1>
            <h3>Looks like this address hasn't created a fund yet.</h3>
            <br></br>
            <div>
              <Link to={`/funds/new`} className="ui button compact green">
                <i className="plus circle icon" />
                Create a Fund
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Header />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1rem"
          }}
        >
          <div style={{ width: "950px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start"
              }}
            >
              <h2>My Funds:</h2>
              <div>
                <Link
                  to="/funds/new"
                  className="ui button compact forest green"
                >
                  <i className="plus circle icon" />
                  New Fund
                </Link>
              </div>
            </div>
            <p>
              Found {Object.values(this.props.gtFunds).length} Funds managed by:{" "}
              {this.props.web3.account}
            </p>
            <Card.Group className="">{this.renderList()}</Card.Group>
            <br />
            <br />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    gtFunds: state.gtFunds,
    web3: state.web3connect
  };
};

export default connect(mapStateToProps, { updateAppTab })(Manager);
