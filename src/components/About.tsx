import "./styles/About.css";
import { siteData } from "../data/siteData";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">{siteData.about}</p>
      </div>
    </div>
  );
};

export default About;
