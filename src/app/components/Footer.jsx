import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="footer footer-center bg-base-300 text-base-content p-4">
        <aside>
          <p>
            Copyright © {new Date().getFullYear()} - All right reserved by <a href="https://rajaul.vercel.app/" target="_blank">Rajaul Hira</a>
          </p>
        </aside>
      </footer>
    </div>
  );
};

export default Footer;
