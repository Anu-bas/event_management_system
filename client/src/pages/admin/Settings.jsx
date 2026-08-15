import React from "react";
import { useToast } from "../../context/ToastContext";
import PageHeader from "../../components/PageHeader";

export default function Settings() {
  const toast = useToast();
  const save = (e) => { e.preventDefault(); toast("Settings saved.", "✓"); };

  return (
    <>
      <PageHeader title="System Settings" sub="Configure platform-wide behavior" />
      <div className="grid grid-2">
        <form className="card" style={{ padding: 24 }} onSubmit={save}>
          <div className="section-title">Platform settings</div>
          <div className="formfield"><label>Platform name</label><input className="input" defaultValue="Eventra" /></div>
          <div className="formfield"><label>Support email</label><input className="input" defaultValue="support@eventra.com" /></div>
          <div className="formfield">
            <label>Organizer approval</label>
            <select className="input"><option>Manual review required</option><option>Auto-approve all</option></select>
          </div>
          <button className="btn btn-orange btn-sm" style={{ padding: "9px 18px" }}>Save settings</button>
        </form>
        <form className="card" style={{ padding: 24 }} onSubmit={save}>
          <div className="section-title">Registration rules</div>
          <div className="formfield"><label>Default registration deadline</label><select className="input"><option>Until event starts</option><option>24 hours before event</option><option>3 days before event</option></select></div>
          <div className="formfield"><label>Allow waitlists when full</label><select className="input"><option>Yes</option><option>No</option></select></div>
          <div className="formfield"><label>Max events per organizer</label><input className="input" type="number" defaultValue={20} /></div>
          <button className="btn btn-orange btn-sm" style={{ padding: "9px 18px" }}>Save settings</button>
        </form>
      </div>
    </>
  );
}
