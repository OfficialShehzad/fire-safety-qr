"use client";

import { useEffect, useState } from "react";
import { getPersonnelList } from "@/lib/auth-service";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import {
    Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import {
    Loader2, Search, QrCode, Download,
    X
} from "lucide-react";
import { useQRCode } from "next-qrcode";
import { jsPDF } from "jspdf";

export function PersonnelList() {
    const { Canvas } = useQRCode();

    const [list, setList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const isBulk = selectedUser === "bulk";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getPersonnelList();
                setList(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // ✅ FILTER
    const filteredList = list.filter((person) =>
        person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        person.contractor.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredList.length / itemsPerPage);

    const currentItems = filteredList.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    // ✅ SELECT LOGIC (MAX 8)
    const toggleSelectUser = (person: any) => {
        const exists = selectedUsers.find(u => u.id === person.id);

        if (exists) {
            setSelectedUsers(selectedUsers.filter(u => u.id !== person.id));
        } else {
            if (selectedUsers.length >= 8) return;
            setSelectedUsers([...selectedUsers, person]);
        }
    };

    // ✅ SINGLE DOWNLOAD
    const downloadQR = () => {
        const canvas = document.querySelector('canvas');
        if (!canvas || !selectedUser) return;

        const qrImage = canvas.toDataURL("image/png");

        const doc = new jsPDF();
        doc.addImage(qrImage, 'PNG', 55, 75, 100, 100);
        doc.save(`QR-${selectedUser.name}.pdf`);
    };

    // ✅ BULK PDF (8 PER PAGE)
    const downloadBulkPDF = () => {
        const doc = new jsPDF();

        const canvases = document.querySelectorAll("canvas");

        const positions = [
            [20, 20], [110, 20],
            [20, 80], [110, 80],
            [20, 140], [110, 140],
            [20, 200], [110, 200],
        ];

        selectedUsers.forEach((user, i) => {
            const canvas = canvases[i] as HTMLCanvasElement;
            if (!canvas) return;

            const img = canvas.toDataURL("image/png");
            const [x, y] = positions[i];

            doc.addImage(img, "PNG", x, y, 60, 60);

            doc.setFontSize(10);
            doc.text(user.name, x + 30, y + 65, { align: "center" });
        });

        doc.save("Bulk-QR.pdf");
    };

    if (loading) {
        return (
            <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
            </div>
        );
    }

    return (
        <div className="space-y-4">

            {/* SEARCH */}
            <div className="flex justify-between items-center">
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <Input
                        placeholder="Search personnel..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-10"
                    />
                </div>

                <Button
                    disabled={selectedUsers.length === 0}
                    onClick={() => setSelectedUser("bulk")}
                >
                    Generate Bulk QR Codes ({selectedUsers.length})
                </Button>
            </div>

            {/* TABLE */}
            <Card className="border-none shadow-sm bg-white">
                <CardHeader className="flex justify-between">
                    <CardTitle>Registered Personnel</CardTitle>
                    {selectedUsers.length ? (
                        <div className="flex items-center gap-2 text-black/80 cursor-pointer" onClick={() => setSelectedUsers([])} >
                            Deselect
                            <X />
                        </div>
                    ) : null}
                </CardHeader>

                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead></TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Contractor</TableHead>
                                <TableHead>Blood</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {currentItems.map((person) => (
                                <TableRow key={person.id}>
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={!!selectedUsers.find(u => u.id === person.id)}
                                            onChange={() => toggleSelectUser(person)}
                                        />
                                    </TableCell>

                                    <TableCell>{person.name}</TableCell>
                                    <TableCell>{person.contractor}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="text-red-600">
                                            {person.bloodGroup}
                                        </Badge>
                                    </TableCell>

                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setSelectedUser(person)}
                                        >
                                            <QrCode className="h-4 w-4 mr-2" />
                                            QR
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="flex items-center justify-between mt-4">

                        <p className="text-sm text-slate-500">
                            Page {currentPage} of {totalPages}
                        </p>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => prev - 1)}
                            >
                                Prev
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => prev + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* MODAL */}
            <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
                <DialogContent className="sm:max-w-md max-h-[80vh] overflow-y-scroll">
                    <DialogHeader>
                        <DialogTitle>
                            {isBulk ? "Bulk QR Codes" : "QR Code"}
                        </DialogTitle>
                        <DialogDescription>
                            {isBulk
                                ? "Download up to 8 QR codes"
                                : `QR for ${selectedUser?.name}`}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col items-center space-y-6">

                        {/* SINGLE */}
                        {!isBulk && selectedUser && (
                            <Canvas
                                text={`${window.location.origin}/user/${selectedUser.id}`}
                                options={{ width: 250 }}
                            />
                        )}

                        {/* BULK GRID */}
                        {isBulk && (
                            <div className="grid grid-cols-2 gap-4">
                                {selectedUsers.map((user) => (
                                    <div key={user.id} className="text-center">
                                        <Canvas
                                            text={`${window.location.origin}/user/${user.id}`}
                                            options={{ width: 120 }}
                                        />
                                        <p className="text-xs mt-1">{user.name}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* DOWNLOAD */}
                        <Button
                            onClick={() => {
                                if (isBulk) downloadBulkPDF();
                                else downloadQR();
                            }}
                            className="w-full"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}