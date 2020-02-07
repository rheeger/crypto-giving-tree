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
                Request Beta Access
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
            <LeftSectionWrapper>
              <EmojiImage alt="fund" src={fund}></EmojiImage>
              <ContentWrapper>
                <SmallLabel>STEP 1</SmallLabel>
                <SectionHeader>Open a fund</SectionHeader>
                <Subtitle>become the primary advisor of your own fund</Subtitle>
              </ContentWrapper>
            </LeftSectionWrapper>
            <RightSectionWrapper>
              <EmojiImage alt="contribute" src={contribute}></EmojiImage>
              <ContentWrapper>
                <SmallLabel>STEP 2</SmallLabel>
                <SectionHeader>Give some crypto</SectionHeader>
                <Subtitle>funds accept any token traded on Uniswap</Subtitle>
              </ContentWrapper>
            </RightSectionWrapper>
            <LeftSectionWrapper>
              <EmojiImage alt="grant" src={grant}></EmojiImage>
              <ContentWrapper>
                <SmallLabel>STEP 3</SmallLabel>
                <SectionHeader>Offer grants</SectionHeader>
                <Subtitle>
                  make grant reccomendations to almost every
                  <br />
                  501(c)(3) organization
                </Subtitle>
              </ContentWrapper>
            </LeftSectionWrapper>
            <SectionWrapper>
              <EmojiImage alt="Orgs" src={orgs}></EmojiImage>
              <Header>Orgs recieve USDC</Header>
              <Subtitle>
                funds are easily transfered by organizations out to US bank
                accounts
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
                philanthropic DAO governed by fund primary advisors
              </Subtitle>
            </SectionWrapper>
            <SectionWrapper>
              <p
                className="ui button huge green"
                onClick={() => {
                  this.setState({ isShowingModal: true });
                }}
                style={{ cursor: "pointer" }}
              >
                Request Beta Access
              </p>
              <Header>Be the first</Header>
              <Subtitle>
                sign up and recieve notice when our public beta launches
              </Subtitle>
            </SectionWrapper>
          </LearnMoreWrapper>
          <img
            alt="endaoment"
            style={{ width: "10rem", margin: "0 auto" }}
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
  min-width: 660px;
  background-color: whitesmoke;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-bottom: 10rem 0;
`;

const FullscreenWrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 1400px;
  text-align: center;
  margin: -10rem auto 5rem auto;
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
  margin: 10rem auto 0rem auto;
  padding: 8rem 0;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`;

const LeftSectionWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  text-align: left;
  margin: 8rem auto;
`;

const RightSectionWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: wrap;
  align-items: center;
  justify-content: space-around;
  text-align: left;
  margin: 8rem auto;
`;

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  margin: 5rem;
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

const ContentWrapper = styled.div``;

const EmojiImage = styled.img`
  width: 30rem;
  margin-left: 1rem;
`;
