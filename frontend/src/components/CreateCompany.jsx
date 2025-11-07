import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; // For clean success/error notifications
import { Loader2 } from "lucide-react";
import axiosClient from "../axiosClient";




const CreateCompany = () => {
  const [formData, setFormData] = useState({
    company_name: "",
    industry_type: "",
    email: "",
    phone_number: "",
    website: "",
    address: "",
    city: "",
    state: "",
    country: "",
    
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    const { data } = await axiosClient.post("/company/", {
      ...formData,
      jobs: formData.jobs
        ? formData.jobs.split(",").map((job) => job.trim())
        : [],
    });

    toast.success(data.message || "Company created successfully!");
    setFormData({
      company_name: "",
      industry_type: "",
      email: "",
      phone_number: "",
      website: "",
      address: "",
      city: "",
      state: "",
      country: "",
      jobs: "",
    });
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center py-10 px-4">
      <Card className="w-full max-w-2xl shadow-xl border border-gray-200 rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800 text-center">
            Create New Company
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Company Name */}
            <div>
              <Label htmlFor="company_name">Company Name</Label>
              <Input
                id="company_name"
                name="company_name"
                value={formData.company_name}
                onChange={handleChange}
                placeholder="e.g., TechNova Solutions"
                required
              />
            </div>

            {/* Industry Type */}
            <div>
              <Label htmlFor="industry_type">Industry Type</Label>
              <Input
                id="industry_type"
                name="industry_type"
                value={formData.industry_type}
                onChange={handleChange}
                placeholder="e.g., Information Technology"
                required
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="e.g., hr@technova.com"
                />
              </div>
              <div>
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  type="tel"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="+91 9876543210"
                />
              </div>
            </div>

            {/* Website */}
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                value={formData.website}
                onChange={handleChange}
                placeholder="e.g., www.technova.com"
              />
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full company address"
              />
            </div>

            {/* City, State, Country */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g., Bengaluru"
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="e.g., Karnataka"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g., India"
                />
              </div>
            </div>

            

            {/* Submit */}
            <Button
              type="submit"
              className="w-full mt-4"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin w-4 h-4" />
                  Creating...
                </span>
              ) : (
                "Create Company"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateCompany;
