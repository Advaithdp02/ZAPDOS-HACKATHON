import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import axiosClient from "../axiosClient";

const UpdateJobRole = () => {
    const { id } = useParams(); // 🔹 get job ID from URL
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        job_role: "",
        job_description: "",
        job_location: "",
        job_skills: "",
        employment_type: "",
        package_lpa: "",
        eligible_departments: [],
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
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // 🔹 Fetch companies and departments
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [companyRes, deptRes] = await Promise.all([
                    axiosClient.get("/company"),
                    axiosClient.get("/department"),
                ]);
                setCompanies(companyRes.data || []);
                setDepartments(deptRes.data || []);
            } catch (err) {
                toast.error("Failed to load company/department data");
            }
        };
        fetchInitialData();
    }, []);

    // 🔹 Fetch job details by ID
    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await axiosClient.get(`/jobs/${id}`);
                setFormData({
                    job_role: data.job_role || "",
                    job_description: data.job_description || "",
                    job_location: data.job_location || "",
                    job_skills: data.job_skills ? data.job_skills.join(", ") : "",
                    employment_type: data.employment_type || "",
                    package_lpa: data.package_lpa || "",
                    eligible_departments: data.eligible_departments?.map((d) => d._id) || [],
                    company: data.company?._id || "",
                    min_cgpa: data.min_cgpa || "",
                    backlog_allowed: data.backlog_allowed || false,
                    contact_person: data.contact_person || "",
                    contact_email: data.contact_email || "",
                    contact_phone: data.contact_phone || "",
                    drive_date: data.drive_date ? data.drive_date.split("T")[0] : "",
                    application_deadline: data.application_deadline ? data.application_deadline.split("T")[0] : "",
                });
            } catch (err) {
                toast.error("Failed to fetch job details");
            } finally {
                setFetching(false);
            }
        };
        fetchJob();
    }, [id]);

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
            };

            const { data } = await axiosClient.put(`/jobs/${id}`, payload);
            toast.success(data.message || "Job role updated successfully!");

            
            navigate("/jobs");
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetching)
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-10 px-4">
            <Card className="w-full max-w-3xl shadow-xl border border-gray-200 rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
                        Update Job Role
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
                                />
                            </div>
                            <div>
                                <Label htmlFor="employment_type">Employment Type</Label>
                                <select
                                    id="employment_type"
                                    name="employment_type"
                                    value={formData.employment_type}
                                    onChange={handleChange}
                                    className="w-full border rounded-lg p-2"
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
                        </div>

                        <div>
                            <Label htmlFor="job_skills">Required Skills</Label>
                            <Input
                                id="job_skills"
                                name="job_skills"
                                value={formData.job_skills}
                                onChange={handleChange}
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
                                        backlog_allowed: e.target.value === "true",
                                    })
                                }
                                className="w-full border rounded-lg p-2"
                            >
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
                                />
                            </div>
                            <div>
                                <Label htmlFor="contact_phone">Contact Phone</Label>
                                <Input
                                    id="contact_phone"
                                    name="contact_phone"
                                    value={formData.contact_phone}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-4" disabled={loading}>
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 className="animate-spin w-4 h-4" />
                                    Updating...
                                </span>
                            ) : (
                                "Update Job Role"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default UpdateJobRole;
