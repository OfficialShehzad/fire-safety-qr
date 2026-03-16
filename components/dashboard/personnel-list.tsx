"use client";

import { useEffect, useState } from "react";
import { getPersonnelList } from "@/lib/auth-service";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Loader2, Search, ChevronLeft, ChevronRight, QrCode, Download } from "lucide-react";
import { useQRCode } from 'next-qrcode';
import { jsPDF } from "jspdf";

export function PersonnelList() {
    const { Canvas } = useQRCode();
    const [list, setList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<any>(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

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

    const filteredList = list.filter((person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.contractor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentItems = filteredList.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredList.length / itemsPerPage);


    // ... inside your component

    const downloadQR = (format: 'png' | 'pdf') => {
        const canvas = document.querySelector('canvas');
        if (!canvas || !selectedUser) return;

        const qrImage = canvas.toDataURL("image/png");

        if (format === 'png') {
            const link = document.createElement('a');
            link.download = `QR-${selectedUser.name.replace(/\s+/g, '-').toLowerCase()}.png`;
            link.href = qrImage;
            link.click();
        } else {
            // PDF Generation
            const doc = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4'
            });

            // Add Title & Branding
            doc.setFontSize(20);
            // doc.text("Safety QR Profile", 105, 40, { align: "center" });

            doc.setFontSize(14);
            doc.setTextColor(100);
            // doc.text(`Personnel: ${selectedUser.name}`, 105, 50, { align: "center" });
            // doc.text(`${selectedUser.company} - ${selectedUser.project}`, 105, 58, { align: "center" });

            // Add the QR Code (centered)
            // image, x, y, width, height
            doc.addImage(qrImage, 'PNG', 55, 75, 100, 100);

            // Add Footer Info
            doc.setFontSize(10);
            // doc.text("Scan this code to view the full safety credentials and emergency contact info.", 105, 190, { align: "center" });

            doc.save(`QR-${selectedUser.name.replace(/\s+/g, '-').toLowerCase()}.pdf`);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>;

    return (
        <div className="space-y-4">
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                    placeholder="Search personnel..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="pl-10"
                />
            </div>

            <Card className="border-none shadow-sm bg-white">
                <CardHeader><CardTitle className="text-xl">Registered Personnel</CardTitle></CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Contractor</TableHead>
                                <TableHead>Blood</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentItems.map((person) => (
                                <TableRow key={person.id}>
                                    <TableCell className="font-medium">{person.name}</TableCell>
                                    <TableCell>{person.contractor}</TableCell>
                                    <TableCell><Badge variant="outline" className="text-red-600">{person.bloodGroup}</Badge></TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" onClick={() => setSelectedUser(person)}>
                                            <QrCode className="h-4 w-4 mr-2" /> QR Code
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination Controls Here */}
                </CardContent>
            </Card>

            {/* QR Code Popup */}
            <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Personnel QR Code</DialogTitle>
                        <DialogDescription>
                            Scan to view safety profile for <strong>{selectedUser?.name}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col items-center justify-center space-y-6 py-4">
                        <div className="p-4 bg-white rounded-xl shadow-inner border border-slate-100">
                            {selectedUser && (
                                <Canvas
                                    text={`${window.location.origin}/user/${selectedUser.id}`}
                                    options={{
                                        // level: 'M',
                                        margin: 3,
                                        scale: 4,
                                        width: 250,
                                        color: { dark: '#0f172a', light: '#ffffff' },
                                    }}
                                />
                            )}
                        </div>

                        <div className="flex gap-3 w-full">
                            <Button onClick={() => downloadQR('png')} className="flex-1" variant="secondary">
                                <Download className="mr-2 h-4 w-4" /> PNG
                            </Button>
                            <Button onClick={() => downloadQR('pdf')} className="flex-1">
                                <Download className="mr-2 h-4 w-4" /> PDF
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}