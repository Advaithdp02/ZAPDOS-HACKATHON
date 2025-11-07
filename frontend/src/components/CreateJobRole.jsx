import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import axiosClient from "../axiosClient";

const CreateJobRole = () => {
  const [formData, setFormData] = useState({
  job_role: "",
  job_description: "",
  job_location: "",
  job_skills: "",
  employment_type: "",
  package_lpa: "",
  eligible_departments: [], // ✅ must be array, not string
  company: "",
  min_cgpa: "",
  backlog_allowed: "",
  contact_person: "",
  contact_email: "",
  contact_phone: "",
  drive_date: "",
  application_deadline: "",
});

  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);

useEffect(() => {
  const fetchDepartments = async () => {
    try {
      const { data } = await axiosClient.get("/department");
      setDepartments(data || []);
    } catch (error) {
      toast.error("Failed to fetch departments");
    }
  };
  fetchDepartments();
}, []);

  // Fetch companies to populate dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await axiosClient.get("/company");
        setCompanies(data || []);
      } catch (error) {
        toast.error("Failed to fetch companies");
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const payload = {
      ...formData,
      job_skills: formData.job_skills
        ? formData.job_skills.split(",").map((s) => s.trim()).filter(Boolean)
        : [],
      eligible_departments: Array.isArray(formData.eligible_departments)
        ? formData.eligible_departments
        : [],
    };

    console.log("Submitting job payload:", payload); // <--- inspect this in browser console

    // make sure this path matches your backend mounting (use /api/jobs if backend uses app.use("/api/jobs", ...))
    const { data } = await axiosClient.post("/jobs", payload);

    toast.success(data.message || "Job role created successfully!");
    setFormData({
      job_role: "",
      job_description: "",
      job_location: "",
      job_skills: "",
      employment_type: "",
      package_lpa: "",
      eligible_departments: [], // reset as array!
      company: "",
      min_cgpa: "",
      backlog_allowed: "",
      contact_person: "",
      contact_email: "",
      contact_phone: "",
      drive_date: "",
      application_deadline: "",
    });
  } catch (err) {
    console.error("Submit error:", err.response ?? err);
    toast.error(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-10 px-4">
      <Card className="w-full max-w-3xl shadow-xl border border-gray-200 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
            Create Job Role
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="job_role">Job Title</Label>
              <Input
                id="job_role"
                name="job_role"
                value={formData.job_role}
                onChange={handleChange}
                placeholder="e.g., Software Engineer"
                required
              />
            </div>

            <div>
              <Label htmlFor="job_description">Job Description</Label>
              <Textarea
                id="job_description"
                name="job_description"
                value={formData.job_description}
                onChange={handleChange}
                placeholder="Describe the role and responsibilities"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="job_location">Job Location</Label>
                <Input
                  id="job_location"
                  name="job_location"
                  value={formData.job_location}
                  onChange={handleChange}
                  placeholder="e.g., Bengaluru"
                />
              </div>
              <div>
  <Label htmlFor="employment_type">Employment Type</Label>
  <select
    id="employment_type"
    name="employment_type"
    value={formData.employment_type}
    onChange={handleChange}
    className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary"
    required
  >
    <option value="">Select Employment Type</option>
    <option value="Full-time">Full-time</option>
    <option value="Part-time">Part-time</option>
    <option value="Internship">Internship</option>
    <option value="Contract">Contract</option>
  </select>
</div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="package_lpa">Package (LPA)</Label>
                <Input
                  id="package_lpa"
                  name="package_lpa"
                  type="number"
                  value={formData.package_lpa}
                  onChange={handleChange}
                  placeholder="e.g., 6.5"
                />
              </div>
              <div>
                <Label htmlFor="min_cgpa">Minimum CGPA</Label>
                <Input
                  id="min_cgpa"
                  name="min_cgpa"
                  type="number"
                  value={formData.min_cgpa}
                  onChange={handleChange}
                  placeholder="e.g., 7.0"
                />
              </div>
            </div>

            <div>
  <Label htmlFor="eligible_departments">Eligible Departments</Label>
  <select
  id="eligible_departments"
  name="eligible_departments"
  multiple
  value={formData.eligible_departments}
  onChange={(e) =>
    setFormData({
      ...formData,
      eligible_departments: Array.from(
        e.target.selectedOptions,
        (option) => option.value
      ),
    })
  }
  className="w-full border rounded-lg p-2"
  required
>
  {departments.map((dept) => (
    <option key={dept._id} value={dept._id}>
      {dept.name}
    </option>
  ))}
</select>

  <p className="text-sm text-gray-500 mt-1">
    Hold <kbd>Ctrl</kbd> (Windows) or <kbd>Cmd</kbd> (Mac) to select multiple.
  </p>
</div>


            <div>
              <Label htmlFor="job_skills">Required Skills</Label>
              <Input
                id="job_skills"
                name="job_skills"
                value={formData.job_skills}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, MongoDB"
              />
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              <select
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              >
                <option value="">Select Company</option>
                {companies.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.company_name}
                  </option>
                ))}
              </select>
            </div>

            <div>
  <Label htmlFor="backlog_allowed">Backlogs Allowed</Label>
  <select
    id="backlog_allowed"
    name="backlog_allowed"
    value={formData.backlog_allowed}
    onChange={(e) =>
      setFormData({
        ...formData,
        backlog_allowed: e.target.value === "true", // ✅ convert to boolean
      })
    }
    className="w-full border rounded-lg p-2"
    required
  >
    <option value="">Select</option>
    <option value="true">Yes</option>
    <option value="false">No</option>
  </select>
</div>


            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="application_deadline">Application Deadline</Label>
                <Input
                  id="application_deadline"
                  name="application_deadline"
                  type="date"
                  value={formData.application_deadline}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="contact_person">Contact Person</Label>
                <Input
                  id="contact_person"
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  placeholder="e.g., HR Manager"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="e.g., hr@company.com"
                />
              </div>
              <div>
                <Label htmlFor="contact_phone">Contact Phone</Label>
                <Input
                  id="contact_phone"
                  name="contact_phone"
                  value={formData.contact_phone}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Creating...
                </span>
              ) : (
                "Create Job Role"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateJobRole;
