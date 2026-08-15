import React, { useState } from "react";
import PageHeader from "../../components/PageHeader";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "Registration issue",
    message: "",
  });

  return (
    <>
      {/* Header Alignment Fix */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "35px 20px 10px",
        }}
      >
        <PageHeader
          title="Contact Us"
          sub="Have questions? We'd love to hear from you."
        />
      </div>

      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "40px",
            alignItems: "start",
          }}
        >
          {/* Left Side */}
          <div>
            <h2
              style={{
                marginBottom: "15px",
                fontSize: "32px",
                color: "#111827",
              }}
            >
              Get in Touch
            </h2>

            <p
              style={{
                color: "#64748b",
                fontSize: "15px",
                lineHeight: 1.7,
                marginBottom: "30px",
              }}
            >
              Have questions about an event, registration, or becoming an
              organizer? Fill out the form and we'll respond as soon as
              possible.
            </p>

            <div style={{ marginBottom: "20px" }}>
              <h4
                style={{
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                📧 Email
              </h4>
              <p style={{ color: "#64748b", fontSize: "12px",paddingLeft:"25px" }}>
                anushree24anu@gmail.com
              </p>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <h4
                style={{
                  color: "#374151",
                  marginBottom: "8px",

                }}
              >
                📍 Address
              </h4>
              <p style={{ color: "#64748b",fontSize: "12px",paddingLeft:"25px" }}>
                Student Activity Center, Block C
              </p>
            </div>

            <div>
              <h4
                style={{
                  color: "#374151",
                  marginBottom: "8px",
                }}
              >
                🕒 Response Time
              </h4>
              <p style={{ color: "#64748b",fontSize: "12px",paddingLeft:"25px" }}>
                Within 24 Hours
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <form
            className="card"
            style={{
              padding: "30px",
              borderRadius: "16px",
            }}
            action="https://formsubmit.co/anushree24anu@gmail.com"
            method="POST"
          >
            {/* Hidden Fields */}
            <input type="hidden" name="_captcha" value="false" />

            <input
              type="hidden"
              name="_subject"
              value="New Contact Message - Eventra"
            />

            <input
              type="hidden"
              name="_template"
              value="table"
            />

            <input
              type="hidden"
              name="_next"
              value="http://localhost:5173/contact"
            />

            {/* Name */}
            <div className="formfield">
              <label>Full Name</label>

              <input
                className="input"
                type="text"
                name="name"
                placeholder="Enter your name"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />
            </div>


            {/* Gmail */}
            <div className="formfield">
              <label>Gmail Address</label>

              <input
                className="input"
                type="email"
                name="email"
                placeholder="example@gmail.com"
                required
                pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$"
                title="Please enter a valid Gmail address"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value.toLowerCase(),
                  })
                }
              />
            </div>


            {/* Subject */}
            <div className="formfield">
              <label>Subject</label>

              <select
                className="input"
                name="subject"
                value={form.subject}
                onChange={(e) =>
                  setForm({
                    ...form,
                    subject: e.target.value,
                  })
                }
              >
                <option>Registration issue</option>
                <option>Become an organizer</option>
                <option>General question</option>
                <option>Report a bug</option>
              </select>
            </div>


            {/* Message */}
            <div className="formfield">
              <label>Message</label>

              <textarea
                className="input"
                name="message"
                rows="6"
                placeholder="Write your message..."
                required
                value={form.message}
                onChange={(e) =>
                  setForm({
                    ...form,
                    message: e.target.value,
                  })
                }
              />
            </div>


            {/* Button */}
            <button
              className="btn btn-primary btn-block"
              style={{
                marginTop: "10px",
              }}
              type="submit"
            >
              Send Message
            </button>

          </form>

        </div>
      </section>
    </>
  );
}