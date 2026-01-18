import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trophy, Users, School, Mail, Phone, User, Plus, X, Zap, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  age: z.number().min(6, "Age must be at least 6").max(25, "Age must be under 25"),
});

const registrationSchema = z.object({
  schoolName: z.string().min(2, "School name is required").max(200, "School name too long"),
  schoolCity: z.string().min(2, "City is required").max(100, "City name too long"),
  contactName: z.string().min(2, "Contact name is required").max(100, "Name too long"),
  contactEmail: z.string().email("Invalid email address").max(255, "Email too long"),
  contactPhone: z.string().max(20, "Phone number too long").optional(),
  teamName: z.string().min(2, "Team name is required").max(100, "Team name too long"),
  category: z.enum(["junior", "senior"], { required_error: "Please select a category" }),
  teamMembers: z.array(teamMemberSchema).min(2, "At least 2 team members required").max(4, "Maximum 4 team members"),
  notes: z.string().max(500, "Notes too long").optional(),
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

const RoboLigaRegister = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [teamMembers, setTeamMembers] = useState<{ name: string; age: string }[]>([
    { name: "", age: "" },
    { name: "", age: "" },
  ]);

  const form = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      schoolName: "",
      schoolCity: "",
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      teamName: "",
      category: undefined,
      teamMembers: [],
      notes: "",
    },
  });

  const addTeamMember = () => {
    if (teamMembers.length < 4) {
      setTeamMembers([...teamMembers, { name: "", age: "" }]);
    }
  };

  const removeTeamMember = (index: number) => {
    if (teamMembers.length > 2) {
      setTeamMembers(teamMembers.filter((_, i) => i !== index));
    }
  };

  const updateTeamMember = (index: number, field: "name" | "age", value: string) => {
    const updated = [...teamMembers];
    updated[index][field] = value;
    setTeamMembers(updated);
  };

  const onSubmit = async (data: RegistrationFormData) => {
    // Validate team members
    const validMembers = teamMembers.filter(m => m.name.trim() && m.age);
    if (validMembers.length < 2) {
      toast.error("Please add at least 2 team members with name and age");
      return;
    }

    const parsedMembers = validMembers.map(m => ({
      name: m.name.trim(),
      age: parseInt(m.age, 10),
    }));

    // Validate ages for category
    if (data.category === "junior") {
      const hasOverage = parsedMembers.some(m => m.age > 15);
      if (hasOverage) {
        toast.error("Junior category is for ages up to 15 years only");
        return;
      }
    } else if (data.category === "senior") {
      const hasUnderage = parsedMembers.some(m => m.age < 15);
      if (hasUnderage) {
        toast.error("Senior category is for ages 15 and above");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from("roboliga_registrations").insert({
        school_name: data.schoolName.trim(),
        school_city: data.schoolCity.trim(),
        contact_name: data.contactName.trim(),
        contact_email: data.contactEmail.trim().toLowerCase(),
        contact_phone: data.contactPhone?.trim() || null,
        team_name: data.teamName.trim(),
        category: data.category,
        team_members: parsedMembers,
        student_count: parsedMembers.length,
        notes: data.notes?.trim() || null,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Registration submitted successfully!");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to submit registration");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-slate-900">
        <Header />
        <div className="pt-24 pb-16 px-4">
          <div className="container mx-auto max-w-2xl">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="pt-12 pb-8 text-center">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Registration Successful!</h2>
                <p className="text-slate-300 mb-6 max-w-md mx-auto">
                  Thank you for registering your team for SweSkola RoboLiga 2026. 
                  We'll send confirmation details to your email shortly.
                </p>
                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => navigate("/")}
                    variant="outline"
                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                  >
                    Back to Home
                  </Button>
                  <Button
                    onClick={() => {
                      setIsSuccess(false);
                      form.reset();
                      setTeamMembers([{ name: "", age: "" }, { name: "", age: "" }]);
                    }}
                    className="bg-primary hover:bg-primary/90"
                  >
                    Register Another Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-3xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 bg-primary/20 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/30 mb-6">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-primary font-semibold text-sm">Team Registration</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
              SweSkola <span className="text-primary">RoboLiga</span> 2026
            </h1>
            <p className="text-slate-400 max-w-xl mx-auto">
              Register your school team for Sweden's premier school robotics competition
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* School Information */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <School className="w-5 h-5 text-primary" />
                    School Information
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Details about your school
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="schoolName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">School Name *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Enter school name"
                              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="schoolCity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">City *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="e.g., Västerås"
                              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Contact Information */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Mail className="w-5 h-5 text-primary" />
                    Contact Person
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Teacher or school coordinator details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="contactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Full Name *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter contact person name"
                            className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Email Address *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="email@school.se"
                              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-slate-300">Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="tel"
                              placeholder="+46..."
                              className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Team Details */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" />
                    Team Details
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Your team name and competition category
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="teamName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Team Name *</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter your team name"
                            className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300">Competition Category *</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid md:grid-cols-2 gap-4 mt-2"
                          >
                            <Label
                              htmlFor="junior"
                              className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                                field.value === "junior"
                                  ? "bg-blue-500/20 border-blue-500"
                                  : "bg-slate-900 border-slate-600 hover:border-slate-500"
                              }`}
                            >
                              <RadioGroupItem value="junior" id="junior" className="mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Zap className="w-4 h-4 text-blue-400" />
                                  <span className="font-semibold text-white">ROBO-SPRINT</span>
                                </div>
                                <p className="text-blue-400 text-sm font-medium mb-1">Junior (up to 15 years)</p>
                                <p className="text-slate-400 text-xs">
                                  Air-hockey style ball passing challenge
                                </p>
                              </div>
                            </Label>
                            <Label
                              htmlFor="senior"
                              className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                                field.value === "senior"
                                  ? "bg-purple-500/20 border-purple-500"
                                  : "bg-slate-900 border-slate-600 hover:border-slate-500"
                              }`}
                            >
                              <RadioGroupItem value="senior" id="senior" className="mt-1" />
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <Trophy className="w-4 h-4 text-purple-400" />
                                  <span className="font-semibold text-white">ROBO-RACE</span>
                                </div>
                                <p className="text-purple-400 text-sm font-medium mb-1">Senior (15+ years)</p>
                                <p className="text-slate-400 text-xs">
                                  Navigate, collect, and deposit objects
                                </p>
                              </div>
                            </Label>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Team Members */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    Team Members
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Add 2-4 students to your team
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">{index + 1}</span>
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-3">
                        <Input
                          value={member.name}
                          onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                          placeholder="Student name"
                          className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                        />
                        <Input
                          value={member.age}
                          onChange={(e) => updateTeamMember(index, "age", e.target.value)}
                          placeholder="Age"
                          type="number"
                          min="6"
                          max="25"
                          className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                        />
                      </div>
                      {teamMembers.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTeamMember(index)}
                          className="text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  {teamMembers.length < 4 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addTeamMember}
                      className="w-full border-dashed border-slate-600 text-slate-400 hover:text-white hover:bg-slate-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Team Member
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Additional Notes */}
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Additional Notes</CardTitle>
                  <CardDescription className="text-slate-400">
                    Any special requirements or questions (optional)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Enter any additional information..."
                            rows={3}
                            className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 resize-none"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Submit Button */}
              <div className="flex flex-col items-center gap-4">
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white font-semibold px-12 py-6 text-lg rounded-xl shadow-lg shadow-primary/30"
                >
                  {isSubmitting ? "Submitting..." : "Submit Registration"}
                </Button>
                <p className="text-slate-500 text-sm text-center">
                  By registering, you agree to the competition rules and guidelines.
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default RoboLigaRegister;
