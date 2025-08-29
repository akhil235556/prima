import React from 'react';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer text-center">
            <div className="container">
                <span className="t10 copyRight"> Copyright © <script>document.write(new Date().getFullYear());</script>2019 <span className="blue-text">Camions Logistics Solutions Pvt Ltd.</span> All rights reserved.</span>
            </div>
        </footer>
    );
}

export default Footer;