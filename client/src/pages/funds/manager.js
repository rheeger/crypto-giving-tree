import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Header from "../../components/Header";

class Manager extends React.Component {
  renderList() {
    return Object.values(this.props.gtFunds).map(function(fund, index) {
      return (
        <div className="item" key={fund.id}>
          <div className="right floated content">balance: ${fund.fundDAI}</div>
          <i className="large middle aligned icon file alternate outline" />
          <div className="content">
            <Link to={`/funds/${fund.id}`}>{fund.branchName}</Link>
            <div className="description">{fund.id}</div>
          </div>
        </div>
      );
    });
  }

  render() {
    if (!this.props.gtFunds) {
      return <div>Loading...</div>;
    }

    return (
      <div>
        <Header />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ width: "700px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h2>Active Funds:</h2>
              <div>
                <Link to="/funds/new" className="ui button basic forest green">
                  <i className="plus circle icon" />
                  New Fund
                </Link>
              </div>
            </div>
            <div className="ui celled list">{this.renderList()}</div>
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

export default connect(mapStateToProps)(Manager);
