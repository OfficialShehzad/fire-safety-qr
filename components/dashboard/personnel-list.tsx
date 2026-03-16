"use client";

import { useEffect, useState } from "react";
import { getPersonnelList } from "@/lib/auth-service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

export function PersonnelList() {
    const [list, setList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPersonnelList();
                setList(data);
            } catch (error) {
                console.error("Error fetching list:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <Card className="border-none shadow-sm bg-white">
            <CardHeader>
                <CardTitle className="text-xl">Registered Personnel</CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead>Name</TableHead>
                            <TableHead>Contractor</TableHead>
                            <TableHead>Blood</TableHead>
                            <TableHead>Emergency Contact</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {list.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                                    No personnel records found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            list.map((person) => (
                                <TableRow key={person.id}>
                                    <TableCell className="font-medium">{person.name}</TableCell>
                                    <TableCell className="text-slate-600">{person.contractor}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                                            {person.bloodGroup}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-slate-600">{person.emergencyContact}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}