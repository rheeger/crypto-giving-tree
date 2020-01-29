import React from "react";
import { connect } from "react-redux";
import { Menu, Button } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { startWatching, initialize } from "../../store/reducers/web3connect";
import { setAddresses } from "../../store/reducers/swapAddresses";
import NotificationCenter from "../NotificationCenter";
import endaoment from "../../assets/images/endaoment.svg";
import history from "../../history";

class Header extends React.Component {
  componentDidMount() {
    const { initialize, startWatching } = this.props;
    try {
      initialize().then(startWatching);
    } catch (err) {
      console.log(err);
    }
  }

  componentDidUpdate() {
    const { web3, setAddresses } = this.props;

    if (
      this.hasSetNetworkId ||
      !web3 ||
      !web3.eth ||
      !web3.eth.net ||
      !web3.eth.net.getId
    ) {
      return;
    }

    web3.eth.net.getId((err, networkId) => {
      if (!err && !this.hasSetNetworkId) {
        setAddresses(networkId);
        this.hasSetNetworkId = true;
      }
    });
  }

  truncateAccount() {
    const { account } = this.props;
    return account.slice(0, 4) + "..." + account.slice(-4);
  }

  renderAccount() {
    const { account, initialized } = this.props;

    if (!account && !initialized) {
      return (
        <div>
          <Button
            style={{
              margin: "1rem 0rem 1rem 0",
              padding: "10px",
              borderRadius: "0px 5px 5px 0px"
            }}
            className="ui button basic grey"
            loading
          >
            Connecting
          </Button>
        </div>
      );
    }

    return (
      <Link to={`/funds`} className={`ui two-buttons`}>
        <Button
          style={{
            margin: "1rem 0rem 1rem 0",
            padding: "10px",
            borderRadius: "5px 0px 0 5px",
            borderLeftWidth: "0px"
          }}
          floated="left"
          color="green"
          basic={this.props.appTab === "funds" ? false : true}
        >
          <i className="user circle icon" />
          {this.truncateAccount()}
        </Button>
      </Link>
    );
  }

  render() {
    const whitelist = [
      process.env.REACT_APP_MEW_MAIN,
      process.env.REACT_APP_PEEP_ETH,
      process.env.REACT_APP_BRAVE_WALLET,
      process.env.REACT_APP_GT_ADMIN
    ];
    if (
      this.props.web3.account &&
      !whitelist.includes(this.props.web3.account)
    ) {
      history.push("/");
    }
    return (
      <div>
        <Menu style={{ margin: "1rem" }}>
          <Link to="/alpha" className="item">
            {/* <h1
              style={{
                fontFamily: "all-round-gothic, sans-serif",
                fontWeight: "500",
                fontStyle: "normal",
                fontmargin: "0 auto",
                fontSize: "2rem"
              }}
              >
              endaoment
            </h1> */}
            <img
              alt="endaoment"
              style={{ width: "12rem", height: "3rem" }}
              src={endaoment}
            ></img>
          </Link>

          <Menu.Menu position="right">
            <div style={{ margin: "0 auto" }}>
              <h6 style={{ color: "red" }}>
                <i className="exclamation triangle icon red" />
                THIS IS A DEMO, USE AT YOUR OWN RISK
              </h6>
            </div>
          </Menu.Menu>
          <Menu.Menu position="right">
            <div>
              {this.renderAccount()}
              <Link to={`/orgs`} className={`ui two-buttons`}>
                <Button
                  style={{
                    margin: "1rem 1rem 1rem 0",

                    padding: "10px",
                    borderRadius: "0px 5px 5px 0px",
                    borderRightWidth: "none"
                  }}
                  floated="right"
                  color="blue"
                  basic={this.props.appTab === "orgs" ? false : true}
                >
                  <i className="sistrix medium icon" />
                  Organizations
                </Button>
              </Link>
            </div>
          </Menu.Menu>
        </Menu>

        <NotificationCenter></NotificationCenter>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    appTab: state.appTab,
    gtFunds: state.gtFunds,
    web3: state.web3connect,
    account: state.web3connect.account,
    initialized: state.web3connect.initialized
  };
};

export default connect(mapStateToProps, dispatch => ({
  setAddresses: networkId => dispatch(setAddresses(networkId)),
  initialize: () => dispatch(initialize()),
  startWatching: () => dispatch(startWatching())
}))(Header);
