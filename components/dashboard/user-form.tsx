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
        project: "Aster",
        name: "",
        age: "",
        contractor: "",
        bloodGroup: "",
        emergencyContact: "",
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
            setFormData(prev => ({ ...prev, name: "", age: "", contractor: "", bloodGroup: "", emergencyContact: "" }));
        } catch (error) {
            console.error("Error adding document: ", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto shadow-sm">
            <CardHeader>
                <CardTitle className="text-xl">Personnel Registration</CardTitle>
                <CardDescription>Enter details to generate safety records</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input id="company" value={formData.company} disabled className="bg-slate-50" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="project">Project</Label>
                            <Input id="project" value={formData.project} disabled className="bg-slate-50" />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input
                                id="name"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="age">Age</Label>
                            <Input
                                id="age"
                                type="number"
                                required
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="blood">Blood Group</Label>
                            <Input
                                id="blood"
                                placeholder="e.g. O+ve"
                                required
                                value={formData.bloodGroup}
                                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="contractor">Contractor</Label>
                            <Input
                                id="contractor"
                                required
                                value={formData.contractor}
                                onChange={(e) => setFormData({ ...formData, contractor: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="emergency">Emergency Contact</Label>
                            <Input
                                id="emergency"
                                type="tel"
                                required
                                value={formData.emergencyContact}
                                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
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