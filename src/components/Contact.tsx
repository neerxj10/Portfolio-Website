import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";
import { siteData } from "../data/siteData";

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>Email</h4>
            <p>
              <a href={`mailto:${siteData.email}`} data-cursor="disable">
                {siteData.email}
              </a>
            </p>
            <h4>Location</h4>
            <p>Tamilnadu, India</p>
          </div>
          <div className="contact-box">
            <h4>Social</h4>
            <a
              href={siteData.social.github}
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href={siteData.social.linkedin}
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Linkedin <MdArrowOutward />
            </a>
            <a
              href={siteData.social.x}
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              X <MdArrowOutward />
            </a>
            <a
              href={siteData.social.instagram}
              target="_blank"
              data-cursor="disable"
              className="contact-social"
            >
              Instagram <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>{siteData.fullName}</span>
            </h2>
            <h5>
              <MdCopyright /> {new Date().getFullYear()}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
