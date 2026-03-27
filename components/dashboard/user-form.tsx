"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { addUserToFirestore } from "@/lib/auth-service";
import { Loader2, CheckCircle2 } from "lucide-react";

export function DashboardUserForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const [formData, setFormData] = useState({
        company: "Interio by Godrej",
        project: "Aster DM Healthcare Trivandrum Private Limited",
        name: "",
        age: "",
        contractor: "",
        bloodGroup: "",
        emergencyContact: "",
        emergencyContact2: "",
        manualId: "", 
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsSuccess(false);

        try {
            await addUserToFirestore({
                ...formData,
                age: parseInt(formData.age),
            });
            setIsSuccess(true);
            // Reset non-static fields
            setFormData(prev => ({ ...prev, name: "", age: "", contractor: "", bloodGroup: "", emergencyContact: "", emergencyContact2: "", manualId: "", }));
        } catch (error) {
            console.error("Error adding document: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-4xl mx-auto shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl">Personnel Registration</CardTitle>
                <CardDescription>Enter details to generate safety records</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Company / Project */}
                        <div className="space-y-2">
                            <Label>Company</Label>
                            <Input value={formData.company} disabled className="bg-slate-50" />
                        </div>

                        <div className="space-y-2">
                            <Label>Project</Label>
                            <Input value={formData.project} disabled className="bg-slate-50" />
                        </div>

                        {/* Name */}
                        <div className="space-y-2 md:col-span-2">
                            <Label>Full Name</Label>
                            <Input
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Manual ID */}
                        <div className="space-y-2">
                            <Label>ID Number</Label>
                            <Input
                                required
                                value={formData.manualId}
                                onChange={(e) => setFormData({ ...formData, manualId: e.target.value })}
                            />
                        </div>

                        {/* Age */}
                        <div className="space-y-2">
                            <Label>Age</Label>
                            <Input
                                type="number"
                                required
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            />
                        </div>

                        {/* Blood */}
                        <div className="space-y-2">
                            <Label>Blood Group</Label>
                            <Input
                                required
                                value={formData.bloodGroup}
                                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                            />
                        </div>

                        {/* Contractor */}
                        <div className="space-y-2">
                            <Label>Contractor</Label>
                            <Input
                                required
                                value={formData.contractor}
                                onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                            />
                        </div>

                        {/* Emergency Contacts */}
                        <div className="space-y-2">
                            <Label>Emergency Contact</Label>
                            <Input
                                type="tel"
                                required
                                value={formData.emergencyContact}
                                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label>Emergency Contact 2</Label>
                            <Input
                                type="tel"
                                value={formData.emergencyContact2}
                                onChange={(e) => setFormData({ ...formData, emergencyContact2: e.target.value })}
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                            <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                        ) : isSuccess ? (
                            <><CheckCircle2 className="mr-2 h-4 w-4" /> Data Saved Successfully</>
                        ) : (
                            "Register Person"
                        )}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
