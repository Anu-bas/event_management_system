import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";
import { useToast } from "../../context/ToastContext";
import PageHeader from "../../components/PageHeader";

const CATEGORIES = ["Technology", "Design", "Business", "Seminar", "Arts", "Sports", "Other"];
const COLORS = ["blue", "green", "purple", "orange"];

const empty = { title: "", category: "Technology", date: "", time: "", venue: "", capacity: 50, status: "draft", price: 0, color: "blue", desc: "", tags: "" };

export default function EventForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [form, setForm] = useState(empty);
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      api.get(`/events/${id}`).then((res) => {
        const e = res.data;
        setForm({ ...e, tags: (e.tags || []).join(", ") });
      });
    }
  }, [id]);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean), capacity: Number(form.capacity), price: Number(form.price) };
    try {
      if (isEdit) {
        await api.put(`/events/${id}`, payload);
        toast("Event updated.", "✓");
      } else {
        await api.post("/events", payload);
        toast("Event created.", "🎉");
      }
      navigate("/organizer/events");
    } catch (err) {
      toast(err.response?.data?.message || "Could not save event.", "⚠️");
    }
  };

  return (
    <>
      <PageHeader title={isEdit ? "Edit Event" : "Create Event"} sub="Fill in the details below" />
      <form className="card" style={{ padding: 26, maxWidth: 640 }} onSubmit={submit}>
        <div className="formfield">
          <label>Event title</label>
          <input className="input" required value={form.title} onChange={set("title")} />
        </div>
        <div className="grid grid-2">
          <div className="formfield">
            <label>Category</label>
            <select className="input" value={form.category} onChange={set("category")}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="formfield">
            <label>Status</label>
            <select className="input" value={form.status} onChange={set("status")}>
              <option value="draft">Draft</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
        <div className="grid grid-2">
          <div className="formfield">
            <label>Date</label>
            <input className="input" type="date" required value={form.date} onChange={set("date")} />
          </div>
          <div className="formfield">
            <label>Time</label>
            <input className="input" type="time" required value={form.time} onChange={set("time")} />
          </div>
        </div>
        <div className="formfield">
          <label>Venue</label>
          <input className="input" required value={form.venue} onChange={set("venue")} />
        </div>
        <div className="grid grid-2">
          <div className="formfield">
            <label>Capacity</label>
            <input className="input" type="number" min={1} required value={form.capacity} onChange={set("capacity")} />
          </div>
          <div className="formfield">
          <label>Accent color</label>
          <select className="input" value={form.color} onChange={set("color")}>
            {COLORS.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        </div>
        
        <div className="formfield">
          <label>Description</label>
          <textarea className="input" rows={4} value={form.desc} onChange={set("desc")} />
        </div>
        <div className="formfield">
          <label>Tags (comma separated)</label>
          <input className="input" placeholder="Workshop, Free, Networking" value={form.tags} onChange={set("tags")} />
        </div>
        <button className="btn btn-purple btn-sm" style={{ padding: "10px 20px" }}>{isEdit ? "Save changes" : "Create event"}</button>
      </form>
    </>
  );
}
