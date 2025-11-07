import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import axiosClient from "../axiosClient";

const ManageRecruitmentResults = () => {
  const { roundId } = useParams();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch students of this round
  useEffect(() => {
    const fetchRoundData = async () => {
      try {
        const { data } = await axiosClient.get(`/recruitments/${roundId}`);
        setStudents(data.students || []);
      } catch (err) {
        toast.error("Failed to load round details");
      } finally {
        setLoading(false);
      }
    };
    fetchRoundData();
  }, [roundId]);

  const handleStatusUpdate = async (studentId, status) => {
    try {
      await axiosClient.put(`/recruitments/${roundId}/student/${studentId}`, {
        status,
      });
      toast.success(`Student marked as ${status}`);

      setStudents((prev) =>
        prev.map((s) =>
          s._id === studentId ? { ...s, status } : s
        )
      );
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
      </div>
    );

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
      <Card className="w-full max-w-4xl shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 text-center">
            Manage Round Results
          </CardTitle>
        </CardHeader>

        <CardContent>
          {students.length === 0 ? (
            <p className="text-center text-gray-500">No students found for this round.</p>
          ) : (
            <div className="space-y-3">
              {students.map((s) => (
                <div
                  key={s._id}
                  className="flex items-center justify-between border p-3 rounded-lg bg-white hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {s.first_name} {s.last_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {s.email} — {s.department_id?.name || "N/A"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleStatusUpdate(s._id, "selected")}
                      className={`${
                        s.status === "selected" ? "bg-green-600" : "bg-gray-200 text-black"
                      }`}
                    >
                      Selected
                    </Button>
                    <Button
                      onClick={() => handleStatusUpdate(s._id, "rejected")}
                      className={`${
                        s.status === "rejected" ? "bg-red-600" : "bg-gray-200 text-black"
                      }`}
                    >
                      Rejected
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManageRecruitmentResults;
