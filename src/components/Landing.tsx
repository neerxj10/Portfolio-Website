import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import { siteData } from "../data/siteData";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              {siteData.firstName.toUpperCase()}
              <br />
              <span>{siteData.lastName.toUpperCase()}</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>{siteData.hero.top}</h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">{siteData.hero.highlightA}</div>
              <div className="landing-h2-2">{siteData.hero.highlightB}</div>
            </h2>
            <h2>
              <div className="landing-h2-info">{siteData.hero.mainA}</div>
              <div className="landing-h2-info-1">{siteData.hero.mainB}</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
