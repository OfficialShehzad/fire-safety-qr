import { getPersonnelById, UserFormData } from "@/lib/auth-service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Phone, ShieldAlert, User, Building2, Briefcase } from "lucide-react";
import Link from "next/link";

export default async function UserProfilePage({ params }: { params: { id: string } }) {
    // 1. Await the params object
    const { id } = await params;

    if (!id) {
        return (
            <div className="flex h-screen items-center justify-center">
                <p>Invalid URL: No ID provided</p>
            </div>
        );
    }

    // 2. Fetch the person
    const person = await getPersonnelById(id);

    if (!person) {
        return (
            <div className="flex h-screen items-center justify-center p-4">
                <Card className="max-w-md text-center">
                    <CardHeader>
                        <CardTitle className="text-destructive">Invalid QR Code</CardTitle>
                        <CardDescription>
                            The personnel record `{id}` could not be found.
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-8 px-4">
            <div className="max-w-lg mx-auto space-y-4">

                {/* Header Status */}
                <div className="flex justify-center mb-6">
                    <div className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-2 border border-green-200 shadow-sm">
                        <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        VERIFIED PERSONNEL
                    </div>
                </div>

                {/* Main Profile Card */}
                <Card className="border-none shadow-xl overflow-hidden">
                    <div className="bg-slate-900 p-6 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight capitalize">{person.name}</h1>
                                <p className="text-slate-400 text-sm mt-1 tracking-widest font-semibold uppercase">
                                    Contractor - {person.contractor}
                                </p>
                            </div>
                            <Badge className="bg-red-600 text-white border-none text-lg px-3 py-1">
                                {person.bloodGroup}
                            </Badge>
                        </div>
                    </div>

                    <CardContent className="p-6 space-y-6">
                        {/* Project Details */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <Building2 className="h-3 w-3" /> COMPANY
                                </p>
                                <p className="font-semibold text-slate-900">{person.company}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs text-slate-500 flex items-center gap-1">
                                    <Briefcase className="h-3 w-3" /> PROJECT
                                </p>
                                <p className="font-semibold text-slate-900">{person.project}</p>
                            </div>
                        </div>

                        <Separator className="bg-slate-100" />

                        {/* Personal Details */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3 text-slate-600">
                                    <User className="h-5 w-5" />
                                    <span className="text-sm">Age</span>
                                </div>
                                <span className="font-bold text-slate-900">{person.age} Years</span>
                            </div>

                            {/* Emergency Section - High Visibility */}
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mt-4">
                                <div className="flex items-center gap-2 text-red-700 mb-3">
                                    <ShieldAlert className="h-5 w-5" />
                                    <span className="text-sm font-bold uppercase tracking-wide">Emergency Contact</span>
                                </div>
                                <a
                                    href={`tel:${person.emergencyContact}`}
                                    className="flex items-center justify-between bg-white border border-red-200 rounded-lg p-3 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                >
                                    <span className="font-bold text-lg">{person.emergencyContact}</span>
                                    <Phone className="h-5 w-5 fill-current" />
                                </a>
                            </div>
                   
                            <div className="bg-red-50 border border-red-100 rounded-xl p-4 mt-4">
                                <div className="flex items-center gap-2 text-red-700 mb-3">
                                    <ShieldAlert className="h-5 w-5" />
                                    <span className="text-sm font-bold uppercase tracking-wide">Emergency Contact</span>
                                </div>
                                <a
                                    href={`tel:${person.emergencyContact}`}
                                    className="flex items-center justify-between bg-white border border-red-200 rounded-lg p-3 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                >
                                    <span className="font-bold text-lg">{person.emergencyContact2}</span>
                                    <Phone className="h-5 w-5 fill-current" />
                                </a>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Info */}
                <p className="text-center text-slate-400 text-xs py-4">
                    Record ID: {person.id} <br />
                    Aster Project • Fire Safety Protocol
                </p>
            </div>
        </div>
    );
}