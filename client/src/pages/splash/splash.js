import React from "react";
import endaoment from "../../assets/images/endaoment.svg";
import orgs from "../../assets/images/orgs.png";
import grant from "../../assets/images/grant.png";
import contribute from "../../assets/images/contribute.png";
import fund from "../../assets/images/fund.png";
import tax from "../../assets/images/tax.png";
import endaomentfund from "../../assets/images/endaomentfund.png";
import styled from "styled-components";
import Modal from "../../components/uniSwap/Modal";
import { ReactTypeformEmbed } from "react-typeform-embed";
import { CSSTransitionGroup } from "react-transition-group";
import "./splash.scss";

class Splash extends React.Component {
  state = {
    isShowingModal: false
  };

  renderModal = () => {
    if (!this.state.isShowingModal) {
      return null;
    }

    return (
      <Modal onClose={() => this.setState({ isShowingModal: false })}>
        <CSSTransitionGroup
          transitionName="token-modal"
          transitionAppear={true}
          transitionLeave={true}
          transitionAppearTimeout={200}
          transitionLeaveTimeout={200}
          transitionEnterTimeout={200}
        >
          <div className="token-modal">
            <div className="token-modal__token-list">
              <ReactTypeformEmbed
                popup={false}
                url="https://robbie974107.typeform.com/to/lLyuy4"
                style={{ borderRadius: "1rem" }}
              />
            </div>
          </div>
        </CSSTransitionGroup>
      </Modal>
    );
  };

  render() {
    return (
      <div>
        <HomePageWrapper>
          <FullscreenWrapper>
            <img
              alt="endaoment"
              style={{ width: "15rem" }}
              src={endaoment}
            ></img>
            <BigHeader>A new way to give.</BigHeader>
            <Subtitle>smart contract donor-advised funds</Subtitle>
            <ButtonBlock>
              <a href="#about" className="ui button compact">
                Learn More
              </a>
              <p
                className="ui button compact green"
                onClick={() => {
                  this.setState({ isShowingModal: true });
                }}
                style={{ cursor: "pointer" }}
              >
                Request Access
              </p>
            </ButtonBlock>
          </FullscreenWrapper>
          <LearnMoreWrapper id="about">
            <SectionSubtitle>
              how{" "}
              <span
                style={{
                  fontFamily: "all-round-gothic",
                  fontWeight: "600",
                  fontSize: "1.5rem"
                }}
              >
                endaoment
              </span>{" "}
              works:
            </SectionSubtitle>
            <RightSectionWrapper>
              <EmojiImage alt="fund" src={fund}></EmojiImage>
              <ContentWrapper>
                <SmallLabel>STEP 1</SmallLabel>
                <SectionHeader>Open a fund</SectionHeader>
                <Subtitle>
                  provide basic info and become your fund's primary advisor in
                  seconds
                </Subtitle>
              </ContentWrapper>
            </RightSectionWrapper>
            <LeftSectionWrapper>
              <EmojiImage alt="contribute" src={contribute}></EmojiImage>
              <ContentWrapper>
                <SmallLabel>STEP 2</SmallLabel>
                <SectionHeader>Give some crypto</SectionHeader>
                <Subtitle>
                  funds accept any token traded on Uniswap and are exchanged by{" "}
                  <span
                    style={{
                      fontFamily: "all-round-gothic",
                      fontWeight: "600",
                      fontSize: "1.5rem"
                    }}
                  >
                    endaoment
                  </span>{" "}
                  into USDC
                </Subtitle>
              </ContentWrapper>
            </LeftSectionWrapper>
            <RightSectionWrapper>
              <EmojiImage alt="grant" src={grant}></EmojiImage>
              <ContentWrapper>
                <SmallLabel>STEP 3</SmallLabel>
                <SectionHeader>Offer grants</SectionHeader>
                <Subtitle>
                  make grant reccomendations to approved 501(c)(3) organizations
                  (no hate groups allowed)
                </Subtitle>
              </ContentWrapper>
            </RightSectionWrapper>
            <SectionWrapper>
              <EmojiImage alt="Orgs" src={orgs}></EmojiImage>
              <Header>Orgs recieve USDC</Header>
              <Subtitle>
                approved grant proceeds are easily transfered by organizations
                out to US bank accounts
              </Subtitle>
            </SectionWrapper>
            <SectionWrapper>
              <EmojiImage alt="Taxes" src={tax}></EmojiImage>
              <Header>Minimize your taxes</Header>
              <Subtitle>
                contribute long-term capital gains holdings for maximum
                deductions
              </Subtitle>
            </SectionWrapper>
            <SectionWrapper>
              <EmojiImage alt="Endaoment Fund" src={endaomentfund}></EmojiImage>
              <Header>Coming Soon</Header>
              <Subtitle>
                a community philanthropic DAO governed by you: fund primary
                advisors
              </Subtitle>
            </SectionWrapper>
            <SectionWrapper>
              <p
                className="ui button massive green"
                onClick={() => {
                  this.setState({ isShowingModal: true });
                }}
                style={{ cursor: "pointer", margin: "-2rem auto 2rem auto" }}
              >
                Request Access
              </p>
              <Header>Keep in touch</Header>
              <Subtitle>
                sign up to recieve notice when our public beta launches
              </Subtitle>
            </SectionWrapper>
          </LearnMoreWrapper>
          <img
            alt="endaoment"
            style={{ maxWidth: "10rem", margin: "0 auto" }}
            src={endaoment}
          ></img>
          <ButtonBlock>
            <a
              href="http://twitter.com/endaomentdotorg"
              target="new"
              className="ui button compact twitter"
            >
              <i className="twitter icon"></i>
              Follow
            </a>

            <a
              href="medium.com/endaomentdotorg"
              className="ui button compact disabled"
            >
              <i className="medium m icon"></i>
              Read More
            </a>
          </ButtonBlock>
        </HomePageWrapper>
        {this.renderModal()}
      </div>
    );
  }
}

export default Splash;

const HomePageWrapper = styled.div`
  background-color: whitesmoke;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 2rem;
  padding-left: 2rem;
  padding-right: 2rem;
  width: 100%;
  box-sizing: border-box;
`;

const FullscreenWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  max-width: 1400px;
  text-align: center;
  margin-top: 10vh;
`;

const Header = styled.p`
  font-family: all-round-gothic;
  font-weight: 400;
  font-size: 4rem;
  margin-top: 3rem;
`;

const BigHeader = styled.p`
  font-family: all-round-gothic;
  font-weight: 400;
  font-size: 5rem;
  margin-top: 3rem;
  padding: 2rem;
`;

const Subtitle = styled.p`
  font-family: all-round-gothic;
  font-weight: 400;
  font-size: 1.5rem;
  margin-top: -3rem;
`;

const SectionSubtitle = styled.p`
  font-family: all-round-gothic;
  font-weight: 400;
  font-size: 1.5rem;
`;

const ButtonBlock = styled.div`
  display: flex;
  justify-content: center;
  margin: 2rem;
  padding-bottom: 5rem;
`;

const LearnMoreWrapper = styled.div`
  background-color: whitesmoke;
  width: 1300px;
  max-width: 100vw;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  padding: 5rem 0;
`;

const LeftSectionWrapper = styled.div`
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  text-align: left;
  max-width: 100vw;
  margin: 5rem auto;
  padding: 1rem;
`;

const RightSectionWrapper = styled.div`
  display: flex;
  flex-flow: wrap;
  align-items: center;
  justify-content: center;
  text-align: left;
  max-width: 100vw;
  margin: 5rem auto;
  padding: 1rem;
`;

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  max-width: 100vw;
  margin: 5rem auto;
  padding: 2rem;
`;

const SmallLabel = styled.p`
  font-family: all-round-gothic;
  font-weight: 700;
  font-size: 1.5rem;
  margin-top: 3rem;
`;

const SectionHeader = styled.p`
  font-family: all-round-gothic;
  font-weight: 400;
  font-size: 4rem;
  text-align: left;
`;

const ContentWrapper = styled.div`
  padding: 1rem;
  width: 500px;
  height: auto;
  max-width: 100vw;
`;

const EmojiImage = styled.img`
  width: 100vw;
  height: auto;
  padding: 1rem 0rem 1rem 1rem;
  max-width: 30rem;
`;
