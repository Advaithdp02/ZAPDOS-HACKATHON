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

const CreateRecruitmentRound = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    jobId,
    round_name: "",
    round_type: "",
    round_date: "",
    venue: "",
    description: "",
    selected_students: [],
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [students, setStudents] = useState([]);
  const [jobDetails, setJobDetails] = useState(null);

  // ✅ Fetch Job Details
  useEffect(() => {
    const fetchJobAndStudents = async () => {
      try {
        const jobRes = await axiosClient.get(`/jobs/${jobId}`);
        setJobDetails(jobRes.data);

        // Optionally, fetch eligible students for that job
        const studentRes = await axiosClient.get(`/students/eligible/${jobId}`);
        setStudents(studentRes.data || []);
        setStudents(studentRes.data || []);
setFormData((prev) => ({
  ...prev,
  selected_students: (studentRes.data || []).map((s) => s._id),
}));

      } catch (err) {
        toast.error("Failed to load job or student data");
      } finally {
        setFetching(false);
      }
    };

    fetchJobAndStudents();
    
  }, [jobId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStudentSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setFormData({ ...formData, selected_students: selected });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const payload = {
      ...formData,
      job_role: jobId, // ✅ map jobId → job_role
    };

    const { data } = await axiosClient.post("/recruitments", payload);
    toast.success(data.message || "Recruitment round created successfully!");
    navigate(`/recruitment/job/${jobId}`);
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to create round");
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
            Create Recruitment Round
          </CardTitle>
          {jobDetails && (
            <p className="text-center text-gray-500 text-sm">
              For Job: <span className="font-medium">{jobDetails.job_role}</span> at{" "}
              <span className="font-medium">{jobDetails.company?.company_name}</span>
            </p>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="round_name">Round Name</Label>
              <Input
                id="round_name"
                name="round_name"
                value={formData.round_name}
                onChange={handleChange}
                placeholder="e.g., Technical Interview Round 1"
                required
              />
            </div>

            <div>
              <Label htmlFor="round_type">Round Type</Label>
              <select
                id="round_type"
                name="round_type"
                value={formData.round_type}
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
                required
              >
                <option value="">Select Type</option>
                <option value="Aptitude">Aptitude</option>
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Group Discussion">Group Discussion</option>
                <option value="Managerial">Managerial</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="round_date">Round Date</Label>
                <Input
                  id="date"
                  name="round_date"
                  type="date"
                  value={formData.round_date}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  name="venue"
                  value={formData.venue}
                  onChange={handleChange}
                  placeholder="e.g., Main Auditorium"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Add any details or instructions for the round"
              />
            </div>

            <div>
  <Label htmlFor="selected_students">Select Students</Label>

  <div className="max-h-64 overflow-y-auto border rounded-lg p-3 bg-white">
    {students.map((s) => (
      <div
        key={s._id}
        className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
          formData.selected_students.includes(s._id)
            ? "bg-blue-100"
            : "hover:bg-gray-100"
        }`}
        onClick={() => {
          setFormData((prev) => ({
            ...prev,
            selected_students: prev.selected_students.includes(s._id)
              ? prev.selected_students.filter((id) => id !== s._id) // Deselect
              : [...prev.selected_students, s._id], // Select
          }));
        }}
      >
        <div>
          <p className="font-medium text-gray-800">
            {s.first_name} {s.last_name}
          </p>
          <p className="text-xs text-gray-500">
            {s.department_id?.name || "N/A"}
          </p>
        </div>
        <input
          type="checkbox"
          checked={formData.selected_students.includes(s._id)}
          readOnly
        />
      </div>
    ))}
  </div>

  <p className="text-sm text-gray-500 mt-1">
    Click on a student to select or deselect.
  </p>
</div>


            <Button type="submit" className="w-full mt-4" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Creating...
                </span>
              ) : (
                "Create Round"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateRecruitmentRound;
