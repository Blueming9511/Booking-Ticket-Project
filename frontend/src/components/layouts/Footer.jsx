import React from "react";
import { Layout, Row, Col, Divider } from "antd";

const { Footer } = Layout;

const AppFooter = () => {
    return (
        <Footer style={{ background: "#001529", color: "#fff", padding: "40px 10%" }}>
            <Row gutter={[32, 32]} justify="center">
                {/* About Section */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <h3 style={{ color: "#fff" }}>About Us</h3>
                    <p style={{ opacity: 0.8 }}>
                        We provide the best services to help you achieve your goals. Our mission is to deliver
                        high-quality products with customer satisfaction.
                    </p>
                </Col>

                {/* Quick Links */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <h3 style={{ color: "#fff" }}>Quick Links</h3>
                    <ul style={{ listStyle: "none", padding: 0 }}>
                        <li><a href="/" style={{ color: "#fff", opacity: 0.8 }}>Home</a></li>
                        <li><a href="/about" style={{ color: "#fff", opacity: 0.8 }}>About</a></li>
                        <li><a href="/services" style={{ color: "#fff", opacity: 0.8 }}>Services</a></li>
                        <li><a href="/contact" style={{ color: "#fff", opacity: 0.8 }}>Contact</a></li>
                    </ul>
                </Col>

                {/* Contact Section */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <h3 style={{ color: "#fff" }}>Contact Us</h3>
                    <p style={{ opacity: 0.8 }}>📍 123 Main Street, City, Country</p>
                    <p style={{ opacity: 0.8 }}>📧 email@example.com</p>
                    <p style={{ opacity: 0.8 }}>📞 +123 456 7890</p>
                </Col>

                {/* Social Media */}
                <Col xs={24} sm={12} md={8} lg={6}>
                    <h3 style={{ color: "#fff" }}>Follow Us</h3>
                    <p>
                        <a href="#" style={{ color: "#fff", opacity: 0.8, marginRight: 10 }}>Facebook</a>
                        <a href="#" style={{ color: "#fff", opacity: 0.8, marginRight: 10 }}>Twitter</a>
                        <a href="#" style={{ color: "#fff", opacity: 0.8 }}>Instagram</a>
                    </p>
                </Col>
            </Row>

            <Divider style={{ backgroundColor: "#fff", opacity: 0.2 }} />

            <Row justify="center">
                <Col>
                    <p style={{ textAlign: "center", opacity: 0.6 }}>
                        © {new Date().getFullYear()} Your Company Name. All Rights Reserved.
                    </p>
                </Col>
            </Row>
        </Footer>
    );
};

export default AppFooter;
